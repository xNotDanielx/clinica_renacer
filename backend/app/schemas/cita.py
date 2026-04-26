from datetime import date, datetime, time
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.commons.enums import EstadoCita


class CitaBase(BaseModel):
    id_paciente: str
    id_codigo_promocional: int | None = None
    fecha_programada: date
    hora_inicio: time
    hora_fin: time
    monto_base: Decimal | None = None
    monto_descuento: Decimal | None = None
    monto_final: Decimal | None = None
    nota: str | None = None
    estado: EstadoCita


class CitaCreate(CitaBase):
    pass


class CitaCreateRequest(BaseModel):
    id_paciente: str
    id_codigo_promocional: int | None = None
    fecha_programada: date
    hora_inicio: time
    hora_fin: time
    nota: str | None = None
    estado: EstadoCita = EstadoCita.PENDIENTE
    procedimiento_ids: list[int]
    valor_consulta: Decimal


class CitaUpdate(BaseModel):
    id_paciente: str | None = None
    id_codigo_promocional: int | None = None
    fecha_programada: date | None = None
    hora_inicio: time | None = None
    hora_fin: time | None = None
    monto_base: Decimal | None = None
    monto_descuento: Decimal | None = None
    monto_final: Decimal | None = None
    nota: str | None = None
    estado: EstadoCita | None = None


class CitaOut(CitaBase):
    id: int
    fecha_ultima_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)


class CitaCambiarEstadoRequest(BaseModel):
    estado: EstadoCita
