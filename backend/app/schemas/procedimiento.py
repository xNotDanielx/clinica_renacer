from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ProcedimientoBase(BaseModel):
    nombre: str
    descripcion: str
    precio: Decimal
    activo: bool = True


class ProcedimientoCreate(ProcedimientoBase):
    pass


class ProcedimientoUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    precio: Decimal | None = None
    activo: bool | None = None


class ProcedimientoOut(ProcedimientoBase):
    id: int
    fecha_ultima_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)
