from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.routes.deps import get_db
from app.routes.errors import to_http_exception
from app.schemas.cita import CitaCambiarEstadoRequest, CitaCreateRequest, CitaOut
from app.services.cita_service import CitaService
from app.common.security import get_current_administrador

router = APIRouter(prefix="/citas", tags=["Citas"])


@router.post("", response_model=CitaOut, status_code=201)
def crear_cita(payload: CitaCreateRequest, db: Session = Depends(get_db)):
    try:
        cita = CitaService.crear_cita(
            db,
            id_paciente=payload.id_paciente,
            fecha_programada=payload.fecha_programada,
            hora_inicio=payload.hora_inicio,
            hora_fin=payload.hora_fin,
            procedimiento_ids=payload.procedimiento_ids,
            valor_consulta=payload.valor_consulta,
            id_codigo_promocional=payload.id_codigo_promocional,
            nota=payload.nota,
            estado=payload.estado,
        )
        return cita
    except Exception as error:
        db.rollback()
        raise to_http_exception(error)


@router.get("", response_model=list[CitaOut])
def listar_citas_por_fecha(
    fecha_programada: date = Query(...),
    db: Session = Depends(get_db),
    administrador=Depends(get_current_administrador),
):
    try:
        return CitaService.listar_citas_por_fecha(db, fecha_programada)
    except Exception as error:
        raise to_http_exception(error)


@router.patch("/{cita_id}/estado", response_model=CitaOut)
def cambiar_estado_cita(cita_id: int, payload: CitaCambiarEstadoRequest, db: Session = Depends(get_db), administrador=Depends(get_current_administrador)):
    try:
        cita = CitaService.cambiar_estado_cita(db, cita_id, payload.estado)
        db.commit()
        db.refresh(cita)
        return cita
    except Exception as error:
        db.rollback()
        raise to_http_exception(error)
