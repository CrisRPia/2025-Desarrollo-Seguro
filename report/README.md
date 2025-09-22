## Reporte - Cristian Rodríguez

En este reporte se explican los errores de seguridad encontrados, se muestran
los tests para reproducirlos y se proponen soluciones.

[Ver en repositorio.](https://github.com/CrisRPia/2025-Desarrollo-Seguro/blob/practico-2/report/README.md)

### Problemas encontrados

#### Inyección sql

1. El endpoint para listar facturas (/invoices) es vulnerable a inyección SQL. Los parámetros status y operator de la consulta se concatenan directamente en una consulta cruda (raw) de Knex, permitiendo a un atacante manipular la lógica de la base de datos.

```ts
// services/backend/src/services/invoiceService.ts
class InvoiceService {
  static async list(
    userId: string,
    status?: string,
    operator?: string,
  ): Promise<Invoice[]> {
    let q = db<InvoiceRow>("invoices").where({ userId: userId });
    if (status) q = q.andWhereRaw(" status " + operator + " '" + status + "'");
    const rows = await q.select();
    // ...
  }
}
```

##### Prueba de Concepto (PoC)

El test de PoC demuestra cómo un atacante puede bypassar el filtro de userId y obtener todas las facturas del sistema inyectando una condición OR '1'='1'.

[Ver PoC](../services/backend/test/pocs/sqli.poc.test.ts)

##### Solución Propuesta

Utilizar consultas parametrizadas (prepared statements) en lugar de concatenación de strings. Knex maneja esto de forma segura al pasar los valores como bindings, evitando que sean interpretados como código SQL.

```ts
// services/backend/src/services/invoiceService.ts
class InvoiceService {
  static async list(
    userId: string,
    status?: string,
    operator?: string,
  ): Promise<Invoice[]> {
    let q = db<InvoiceRow>("invoices").where({ userId: userId });
    if (status && operator) {
      q = q.andWhere("status", operator, status);
    }
    const rows = await q.select();
    // ...
  }
}
```

#### Credenciales Embebidas (Hard Coded Credentials)

Se han encontrado múltiples credenciales y secretos embebidos directamente en el código fuente y en archivos de configuración. Esto representa un riesgo severo, ya que cualquiera con acceso al repositorio puede verlos.

```
services/backend/src/knexfile.ts: Credenciales de la base de datos como fallback.
services/backend/src/middleware/auth.middleware.ts: Secreto de JWT "secreto_super_seguro".
services/backend/src/utils/jwt.ts: Mismo secreto de JWT.
docker-compose.yaml: Credenciales para la base de datos (POSTGRES_USER, POSTGRES_PASSWORD) y el servidor SMTP.
```

##### Solución Propuesta

Todas las credenciales y secretos deben ser externalizados del código y gestionados a través de variables de entorno. Se debe utilizar un archivo .env para el desarrollo local (y añadirlo al .gitignore) y configurar las variables de entorno correspondientes en los entornos de producción.

#### Falsificación de Peticiones del Lado del Servidor (SSRF)

La función de pago de facturas es vulnerable a SSRF. El parámetro paymentBrand recibido del cliente se utiliza sin validación para construir la URL a la que el servidor backend realizará una petición HTTP.

```ts
// services/backend/src/services/invoiceService.ts
const paymentResponse = await axios.post(`http://${paymentBrand}/payments`, {
  ccNumber,
  ccv,
  expirationDate,
});
```

##### Prueba de Concepto (PoC)

El test demuestra que es posible forzar al servidor a enviar una petición a un servicio de pago no autorizado (master en lugar de visa), lo que podría ser explotado para interactuar con servicios internos de la red.

[Ver PoC](../services/backend/test/pocs/ssrf.poc.test.ts)

Implementar una lista blanca (allow-list) de los paymentBrand permitidos y validar la entrada del usuario contra esta lista antes de realizar la petición saliente.

```ts
// services/backend/src/services/invoiceService.ts (Solución)
const ALLOWED_PAYMENT_BRANDS = ["visa", "mastercard"];

if (!ALLOWED_PAYMENT_BRANDS.includes(paymentBrand)) {
  throw new Error("Invalid payment provider");
}

const paymentResponse = await axios.post(`http://${paymentBrand}/payments`, {
  /* ... */
});
```

#### Recorrido de Directorios (Path Traversal)

El endpoint que sirve las facturas en PDF es vulnerable a Path Traversal. El pdfName proporcionado por el usuario se concatena directamente para construir la ruta del archivo a leer, sin una sanitización adecuada.

```ts
// services/backend/src/services/fileService.ts
class FileService {
  static async getFile(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  }
}
```

##### Prueba de Concepto (PoC)

El test intenta leer el archivo /etc/passwd del sistema de archivos del servidor utilizando secuencias ../ para navegar fuera del directorio esperado.

[Ver PoC](../services/backend/test/pocs/traversal.poc.test.ts)

##### Solución Propuesta

Sanitizar la entrada del usuario para eliminar cualquier carácter de recorrido de directorio. Se debe resolver la ruta final y verificar que permanezca dentro del directorio base previsto.

```ts
// services/backend/src/services/invoiceService.ts (Solución)
const path = require("path");
const INVOICES_DIR = path.resolve("/app/resources/invoices");

const fullPath = path.resolve(INVOICES_DIR, pdfName);

if (!fullPath.startsWith(INVOICES_DIR + path.sep)) {
  throw new Error("Attempted path traversal");
}

const pdf = await FileService.getFile(fullPath);
```

### Falta de Autorización (Broken Access Control)

Los endpoints dentro de`/users`, no estaban siendo protegidos por el middleware de autenticación debido a un error en el orden de configuración del middleware en la aplicación principal.

El código original tenía el middleware de autenticación configurado DESPUÉS de las rutas de usuarios:

```ts
// services/backend/src/app.ts (CONFIGURACIÓN INCORRECTA ORIGINAL)
app.use('/auth', authRoutes);        // Rutas públicas
app.use('/users', userRoutes);       // ❌ SIN PROTECCIÓN - middleware aún no aplicado
app.use(authMiddleware);             // ⚠️  Middleware aplicado DEMASIADO TARDE
app.use('/clinical-history', clinicalHistoryRoutes);
app.use('/invoices', invoiceRoutes);
````

Esto significaba que cualquiera podía acceder a todos los endpoints de usuarios.

##### Prueba de Concepto (PoC)

El test demuestra que era posible acceder a endpoints que deberían estar protegidos sin proporcionar un token JWT válido, debido al orden incorrecto del middleware.

```ts
it("should FAIL to update a user via PUT /users/:id without authentication", async () => {
  const response = await request(app)
    .put(`/users/${testUserId}`)
    .send({ first_name: "MaliciouslyUpdated" });

  // Un sistema seguro debe prevenir el acceso y retornar 401 o 403
  // Pero el test FALLA porque el código vulnerable permite el acceso
  expect(response.status).toBe(401);

  // Verificar que los datos NO fueron modificados
  const dbUser = await db("users").where({ id: testUserId }).first();
  expect(dbUser.first_name).toBe("Initial");
});
```

[Ver PoC](../services/backend/test/pocs/auth.poc.test.ts)

##### Solución Propuesta

La solución fue corregir el orden del middleware en la aplicación principal, moviendo `authMiddleware` ANTES de las rutas que necesitan protección:

```ts
// services/backend/src/app.ts (CONFIGURACIÓN CORREGIDA)
app.use("/auth", authRoutes); // Rutas públicas (sin protección)

// Proteger todo lo que viene después
app.use(authMiddleware); // ✅ Middleware aplicado ANTES de las rutas protegidas

app.use("/users", userRoutes); // ✅ Ahora protegidas
app.use("/clinical-history", clinicalHistoryRoutes);
app.use("/invoices", invoiceRoutes);
```

Adicionalmente, se modificó el archivo principal de la aplicación para evitar conflictos de puerto durante las pruebas, verificando si el puerto está disponible antes de iniciar el servidor:

```ts
// services/backend/src/app.ts (Mejora adicional)
const isPortFree = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const testServer = net.createServer();
    testServer.listen(port, () => {
      testServer.close(() => resolve(true));
    });
    testServer.on("error", () => resolve(false));
  });
};

isPortFree(PORT).then((isFree) => {
  if (isFree) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  } else {
    console.log(`Port ${PORT} is in use, skipping server start`);
  }
});
```

#### Inyección de Plantillas (Template Injection)

Las plantillas de correo electrónico para la activación de cuenta y reseteo de contraseña son vulnerables a inyección de plantillas del lado del servidor (SSTI). Los datos del usuario (como first_name) se renderizan en la plantilla EJS sin ser escapados correctamente.

```ts
// services/backend/src/services/authService.ts
const link = `${process.env.FRONTEND_URL}/activate-user?token=${invite_token}&username=${encodeURIComponent(user.username)}`;
const template = `
  <html>
    <body>
      <h1>Hello <%= user.first_name %> <%= user.last_name %> </h1>
      <p>Click <a href=<%- link %>>here</a> to activate your account.</p>
    </body>
  </html>`;
const htmlBody = ejs.render(template);
```

##### Prueba de Concepto (PoC)

El test crea un usuario con un first_name que contiene código EJS `<%= 7*7 %>`. El test falla si este código se ejecuta y el resultado `49` aparece en el correo generado.

[Ver PoC](../services/backend/test/pocs/template-injection.poc.test.ts)

##### Solución Propuesta

La solución tiene dos partes. Primero, asegurarse de que la plantilla .ejs utilice la sintaxis de escape <%= ... %> para cualquier dato proveniente del usuario. Segundo, pasar los datos de forma segura a la plantilla.

```ts
// services/backend/src/services/authService.ts (Solución)
// Suponiendo que el template usa <%= user.first_name %>
const template = `
  <html>
    <body>
      <h1>Hello <%= user.first_name %> <%= user.last_name %> </h1>
      <p>Click <a href=<%- link %>>here</a> to activate your account.</p>
    </body>
  </html>`;

const htmlBody = ejs.render(template, {
  user: user,
  link: activationLink,
});
```

#### Almacenamiento Inseguro (Insecure Storage)

Las contraseñas de los usuarios se almacenan en la base de datos en texto plano, sin ningún tipo de hashing o salting. Si la base de datos se ve comprometida, todas las contraseñas quedarían expuestas.

```
services/backend/migrations/20250710003034_create_users_table.ts: El campo password es un string.
services/backend/src/services/authService.ts: La autenticación compara el texto plano de la contraseña.
services/backend/seeds/carga_test.js: Se insertan contraseñas en texto plano.
```

##### Solución Propuesta

Utilizar una función de hashing criptográficamente segura como bcrypt (que ya está incluida en las dependencias del proyecto) para hashear las contraseñas antes de guardarlas. La autenticación debe comparar el hash de la contraseña proporcionada con el hash almacenado.

```ts
// services/backend/src/services/userService.ts (Solución al crear)
import bcrypt from "bcrypt";
// ...
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
const [newUser] = await db("users")
  .insert({
    // ...
    password: hashedPassword,
  })
  .returning("*");

// services/backend/src/services/authService.ts (Solución al autenticar)
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
  throw new Error("Invalid credentials");
}
```

### Otros problemas

El proyecto hace un bastante mal trabajo al validar la estructura de los datos
utilizados. Esto resulta en vulnerabilidades como el SSRF mencionado, y puede
resultar en comportamiento indefinido fácilmente. Para mitigar esto, se
recomienda utilizar librerías de sanitización de datos como [zod](https://zod.dev/),
que además se pueden intregar al framework utilizado y swagger.

### Notas adicionales

- Existe [un script para ejecutar los pocs](../test.sh).

- Existe [un archivo con los resultados de pocs antes de las soluciones](./test_output.md)

### Bibliografía

Discutí la información y soluciones con Gemini. Sin embargo, no encuentro el
botón de compartir conversación en la interfaz. 😅.

Tambien tuve [una conversación con claude](https://claude.ai/share/d8f8ca31-5127-44af-8b20-b93650b966df)
