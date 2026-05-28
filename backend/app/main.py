from datetime import timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Importações dos módulos que acabamos de criar
from app.config.database import engine, get_db, Base
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse
from app.utils.auth_utils import verify_password, create_access_token, get_current_user

# Comando que lê o model 'User' e cria a tabela automaticamente no Postgres
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fixer API", version="1.0.0")

# Permite que qualquer página web (HTML/JS) se conecte à API sem erros de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROTA DE LOGIN
@app.post("/api/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="E-mail ou senha incorretos"
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(days=1)
    )
    
    return {
        "message": "Login efetuado com sucesso!",
        "token": access_token,
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email
        }
    }

# ROTA DO DASHBOARD (PROTEGIDA)
@app.get("/api/dashboard/summary")
def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    dashboard_data = {
        "totalFixes": 124,
        "pendingTasks": 8,
        "efficiencyRate": "94.2%",
        "recentActivity": [
            {"id": 1, "action": "Sistema Fixer iniciado em Python", "time": "Há 5 minutos"},
            {"id": 2, "action": "Conexão SQLAlchemy ORM ativa", "time": "Há 10 minutos"}
        ],
        "user_logged": current_user.get("email")
    }
    return dashboard_data