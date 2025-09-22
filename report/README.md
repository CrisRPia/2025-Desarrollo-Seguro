## Reporte - Cristian Rodríguez

En este reporte se explican los errores de seguridad encontrados, se muestran
los tests para reproducirlos y se proponen soluciones.

[Ver en repositorio.](https://github.com/CrisRPia/2025-Desarrollo-Seguro/blob/practico-2/report/README.md)

### Problemas encontrados

#### Inyección sql

1. El endpoint para listar facturas (/invoices) es vulnerable a inyección SQL. Los parámetros status y operator de la consulta se concatenan directamente en una consulta cruda (raw) de Knex, permitiendo a un atacante manipular la lógica de la base de datos.

``` ts
// services/backend/src/services/invoiceService.ts
class InvoiceService {
  static async list( userId: string, status?: string, operator?: string): Promise<Invoice[]> {
    let q = db<InvoiceRow>('invoices').where({ userId: userId });
    if (status) q = q.andWhereRaw(" status "+ operator + " '"+ status +"'");
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
    static async list( userId: string, status?: string, operator?: string): Promise<Invoice[]> {
        let q = db<InvoiceRow>('invoices').where({ userId: userId });
        if (status && operator) {
            q = q.andWhere('status', operator, status);
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
    expirationDate
});
```

##### Prueba de Concepto (PoC)

El test demuestra que es posible forzar al servidor a enviar una petición a un servicio de pago no autorizado (master en lugar de visa), lo que podría ser explotado para interactuar con servicios internos de la red.

[Ver PoC](../services/backend/test/pocs/ssrf.poc.test.ts)

Implementar una lista blanca (allow-list) de los paymentBrand permitidos y validar la entrada del usuario contra esta lista antes de realizar la petición saliente.

```ts
// services/backend/src/services/invoiceService.ts (Solución)
const ALLOWED_PAYMENT_BRANDS = ['visa', 'mastercard'];

if (!ALLOWED_PAYMENT_BRANDS.includes(paymentBrand)) {
    throw new Error('Invalid payment provider');
}

const paymentResponse = await axios.post(`http://${paymentBrand}/payments`, { /* ... */ });
```


#### Recorrido de Directorios (Path Traversal)

El endpoint que sirve las facturas en PDF es vulnerable a Path Traversal. El pdfName proporcionado por el usuario se concatena directamente para construir la ruta del archivo a leer, sin una sanitización adecuada.

```ts
// services/backend/src/services/fileService.ts
class FileService {
    static async getFile(filePath: string): Promise<string> {
        const content = await fs.readFile(filePath, 'utf-8');
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
const path = require('path');
const INVOICES_DIR = '/app/resources/invoices'; // Directorio base seguro

// ...
const safeBaseName = path.basename(pdfName);
const fullPath = path.join(INVOICES_DIR, safeBaseName);

// Verificar que la ruta resuelta está dentro del directorio base
if (!fullPath.startsWith(INVOICES_DIR)) {
    throw new Error('Attempted path traversal');
}

const pdf = await FileService.getFile(fullPath);
```

#### Falta de Autorización (Broken Access Control)

Varios endpoints, como el de obtener la historia clínica, verifican correctamente la autenticación (que el usuario haya iniciado sesión) pero no la autorización (que el usuario tenga permiso para ver el recurso específico). Esto permite que un usuario acceda a los datos de otro.

##### Prueba de Concepto (PoC)

El test demuestra que un usuario autenticado (user2) puede solicitar y obtener la historia clínica de otro usuario (user1) simplemente conociendo su ID.

[Ver PoC](../services/backend/test/pocs/auth.poc.test.ts)

##### Solución Propuesta

En cada consulta a un recurso, además de usar el ID del recurso (ej. historyId), se debe incluir una condición WHERE que verifique que el recurso pertenece al userId del usuario autenticado (obtenido del token JWT).

```ts
// services/backend/src/services/clinicalHistoryService.ts (Solución)
static async get(historyId: string, userId: string): Promise<ClinicalHistory | undefined> {
    const history = await db<ClinicalHistory>('clinical_histories')
        .where({ id: historyId, userId: userId }) // Añadir chequeo de propiedad
        .first();
    return history;
}
```

#### Inyección de Plantillas (Template Injection)

Las plantillas de correo electrónico para la activación de cuenta y reseteo de contraseña son vulnerables a inyección de plantillas del lado del servidor (SSTI). Los datos del usuario (como first_name) se renderizan en la plantilla EJS sin ser escapados correctamente.

```ts
// services/backend/src/services/authService.ts
const emailHtml = ejs.render(template, {
  user: user,
  activationLink: activationLink
});
```

##### Prueba de Concepto (PoC)

El test crea un usuario con un first_name que contiene código EJS `<%= 7*7 %>`. El test falla si este código se ejecuta y el resultado `49` aparece en el correo generado.

[Ver PoC](../services/backend/test/pocs/template-injection.poc.test.ts)

##### Solución Propuesta

# TODO
Asegurarse de que todos los datos de usuario en las plantillas EJS se rendericen con la sintaxis de escape <%= ... %> en lugar de la sintaxis sin escape <%- ... %>. Adicionalmente, se puede sanitizar la entrada del usuario antes de pasarla a la plantilla para eliminar cualquier carácter potencialmente peligroso.

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
import bcrypt from 'bcrypt';
// ...
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
const [newUser] = await db('users').insert({
    // ...
    password: hashedPassword
}).returning('*');

// services/backend/src/services/authService.ts (Solución al autenticar)
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
    throw new Error('Invalid credentials');
}
```
