# pyright: strict, reportUnknownVariableType=false, reportAny=false

from typing import NamedTuple
import pytest
import random
import requests
from requests.utils import unquote  # pyright: ignore[reportAttributeAccessIssue]
import quopri
import re

MAILHOG_API = "http://localhost:8025/api/v2/messages"


class UserSetup(NamedTuple):
    username: str
    password: str
    token: str

# --- Setup en base al archivo de ejemplo

def get_last_email_body() -> str | None:
    resp = requests.get(MAILHOG_API)
    resp.raise_for_status()
    data = resp.json()

    if not data["items"]:
        return None  # no emails received yet

    last_email = data["items"][0]
    body = last_email["Content"]["Body"]
    decoded = quopri.decodestring(body).decode("utf-8", errors="replace")
    return unquote(decoded)


def extract_links(decoded_html: str) -> str:
    return re.findall(r'<a\s+href=["\']([^"\']+)["\']', decoded_html, re.IGNORECASE)[0]


def extract_query_params(url: str) -> str | None:
    # regex: busca ?token= o &token= seguido de cualquier cosa hasta &, # o fin de string
    patron = re.compile(r"(?:[?&])token=([^&#]+)")
    m = patron.search(url)
    return m.group(1) if m else None


@pytest.fixture(autouse=True)
def setup_create_user() -> UserSetup:
    # random username
    i = random.randint(1000, 999999)
    username = f"user{i}"
    email = f"{username}@test.com"
    password = "password"
    salida = requests.post(
        "http://localhost:5000/users",
        data={
            "username": username,
            "password": password,
            "email": email,
            "first_name": "Name",
            "last_name": f"{username}son",
        },
    )
    # user created
    assert salida.status_code == 201

    mail = get_last_email_body()
    link = extract_links(mail or "")
    token = extract_query_params(link)

    assert token is not None

    # activate user
    _ = requests.post(
        "http://localhost:5000/auth/set-password",
        json={"token": token, "newPassword": password},
    )

    login_resp = requests.post(
        "http://localhost:5000/auth/login",
        json={"username": username, "password": password},
    )
    login_resp.raise_for_status()

    auth_token = login_resp.json()["token"]

    return UserSetup(username=username, password=password, token=auth_token)

# --- Test de inyección de sql en invoices

def test_invoice_sql_injection(setup_create_user: UserSetup):
    response = requests.get(
        # Inluímos la inyección en el parámetro de status.
        f"http://localhost:5000/invoices?status=${r"' OR 1=1 --"}&operator==",
        headers={
            "Authorization": f"Bearer {setup_create_user.token}",
        }
    )

    # Está bien que la response devuelva 200 con una lista vacía, o que devuelva
    # 404. Para manejar ambos casos, simplemente aseveramos que no puede
    # responder 200 con datos.
    assert not(response.status_code == 200 and len(response.json()) != 0)
