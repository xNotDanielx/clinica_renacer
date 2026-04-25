from fastapi import FastAPI
from app.db.database import engine

app = FastAPI()

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