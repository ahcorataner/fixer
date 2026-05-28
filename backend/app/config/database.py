import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Substitua 'SUA_SENHA_AQUI' pela senha real do seu PostgreSQL (do pgAdmin)
# Se a senha tiver @, use %40 no lugar do @ (Ex: Fixer%402026)
DATABASE_URL = "postgresql://postgres:Fixer%40@localhost:5432/fixer_db"

# Cria o motor de conexão com o PostgreSQL
engine = create_engine(DATABASE_URL)

# Cria a fábrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe base
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()