import sqlite3
from datetime import datetime

DB_PATH = "leads.db"


def init_db():
    """Inicializa o banco de dados e cria a tabela de leads se não existir."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            nome          TEXT    NOT NULL,
            email         TEXT    NOT NULL,
            celular       TEXT    NOT NULL,
            data_cadastro TEXT    NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def inserir_lead(nome: str, email: str, celular: str) -> dict:
    """
    Insere um novo lead no banco de dados.
    Retorna o registro inserido como dicionário.
    """
    agora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO leads (nome, email, celular, data_cadastro) VALUES (?, ?, ?, ?)",
        (nome, email, celular, agora),
    )
    conn.commit()
    lead_id = cursor.lastrowid
    conn.close()
    return {"id": lead_id, "nome": nome, "email": email, "celular": celular, "data_cadastro": agora}


def listar_leads() -> list:
    """Retorna todos os leads cadastrados."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM leads ORDER BY data_cadastro DESC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows
