from app.routes.citas import router as citas_router
from app.routes.codigos_promocionales import router as codigos_promocionales_router
from app.routes.pacientes import router as pacientes_router
from app.routes.procedimientos import router as procedimientos_router

__all__ = [
    "pacientes_router",
    "procedimientos_router",
    "citas_router",
    "codigos_promocionales_router",
]
