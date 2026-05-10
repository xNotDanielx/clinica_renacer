from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AdministradorBase(BaseModel):
    usuario: str
    contrasena_hash: str
    activo: bool = True
    ultimo_acceso: datetime | None = None


class AdministradorCreate(AdministradorBase):
    pass


class AdministradorUpdate(BaseModel):
    usuario: str | None = None
    contrasena_hash: str | None = None
    activo: bool | None = None
    ultimo_acceso: datetime | None = None


class AdministradorOut(AdministradorBase):
    id: int
    fecha_ultima_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)