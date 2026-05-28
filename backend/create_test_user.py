import sys
import uuid
from sqlalchemy import create_engine, Column, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from passlib.context import CryptContext

# 1. Configuração direta do Banco
# Se a sua senha tiver '@', lembre-se de usar '%40' no lugar do caractere.
URL_DIRETA = "postgresql://postgres:Fixer%402026@localhost:5432/fixer_db"

engine = create_engine(URL_DIRETA)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Modelo simplificado isolado
class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

def seed_user():
    print("[...] Conectando ao PostgreSQL e estruturando tabelas...")
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        email_teste = "admin@fixer.com"
        
        user_exists = db.query(User).filter(User.email == email_teste).first()
        if user_exists:
            print(f"[!] O usuário {email_teste} já está cadastrado.")
            return

        hashed_password = pwd_context.hash("Fixer@2026")
        new_user = User(
            name="Administrador Fixer",
            email=email_teste,
            password_hash=hashed_password
        )
        db.add(new_user)
        db.commit()
        print(f"[✓] Usuário de teste criado com sucesso!")
        print(f" -> Login: {email_teste} | Senha: Fixer@2026")
    except Exception as e:
        db.rollback()
        print(f"[X] Erro interno: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_user()