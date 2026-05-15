from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.db.database import Base, engine, ensure_schema_compatibility
import app.models
from app.routes import (
    citas_router,
    codigos_promocionales_router,
    pacientes_router,
    procedimientos_router,
)


app = FastAPI()

# Registra metadatos de todos los modelos y crea tablas si no existen.
Base.metadata.create_all(bind=engine)
ensure_schema_compatibility()

app.include_router(pacientes_router)
app.include_router(procedimientos_router)
app.include_router(citas_router)
app.include_router(codigos_promocionales_router)


# Enable CORS for local frontend during development
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend funcionando"}

@app.get("/test-db")
def test_db():
    try:
        conn = engine.connect()
        conn.close()
        return {"status": "DB conectada"}
    except Exception as e:
        return {"error": str(e)}