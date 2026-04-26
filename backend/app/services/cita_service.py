from __future__ import annotations

from datetime import date, time
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.commons.enums import EstadoCita
from app.models.cita import Cita
from app.models.cita_procedimiento import CitaProcedimiento
from app.models.codigo_promocional import CodigoPromocional
from app.models.paciente import Paciente
from app.models.procedimiento import Procedimiento
from app.services.codigo_promocional_service import CodigoPromocionalService
from app.commons.exceptions import ConflictError, NotFoundError, ValidationError


class CitaService:
    @staticmethod
    def verificar_disponibilidad_horario(
        session: Session,
        fecha_programada: date,
        hora_inicio: time,
        hora_fin: time,
        cita_id_ignorar: int | None = None,
    ) -> None:
        stmt = select(Cita.id).where(
            Cita.fecha_programada == fecha_programada,
            Cita.estado != EstadoCita.CANCELADA.value,
            Cita.hora_inicio < hora_fin,
            Cita.hora_fin > hora_inicio,
        )
        if cita_id_ignorar is not None:
            stmt = stmt.where(Cita.id != cita_id_ignorar)

        conflicto = session.scalar(stmt.limit(1))
        if conflicto:
            raise ConflictError("Ya existe una cita que se solapa en ese horario")

    @staticmethod
    def _obtener_procedimientos(session: Session, procedimiento_ids: list[int]) -> list[Procedimiento]:
        if not procedimiento_ids:
            raise ValidationError("Debes seleccionar al menos un procedimiento")

        stmt = select(Procedimiento).where(
            Procedimiento.id.in_(procedimiento_ids),
            Procedimiento.activo.is_(True),
        )
        procedimientos = list(session.scalars(stmt).all())
        encontrados = {procedimiento.id for procedimiento in procedimientos}
        faltantes = [procedimiento_id for procedimiento_id in procedimiento_ids if procedimiento_id not in encontrados]
        if faltantes:
            raise NotFoundError(f"Procedimientos no encontrados o inactivos: {faltantes}")
        return procedimientos

    @staticmethod
    def _calcular_monto_base(procedimientos: list[Procedimiento]) -> Decimal:
        total = sum((Decimal(procedimiento.precio) for procedimiento in procedimientos), Decimal("0"))
        return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def crear_cita(
        session: Session,
        *,
        id_paciente: str,
        fecha_programada: date,
        hora_inicio: time,
        hora_fin: time,
        procedimiento_ids: list[int],
        valor_consulta: Decimal,
        id_codigo_promocional: int | None = None,
        nota: str | None = None,
        estado: EstadoCita = EstadoCita.PENDIENTE,
    ) -> Cita:
        with session.begin():
            paciente = session.get(Paciente, id_paciente)
            if not paciente:
                raise NotFoundError("Paciente no encontrado")

            if hora_fin <= hora_inicio:
                raise ValidationError("hora_fin debe ser mayor que hora_inicio")

            CitaService.verificar_disponibilidad_horario(session, fecha_programada, hora_inicio, hora_fin)

            procedimientos = CitaService._obtener_procedimientos(session, procedimiento_ids)
            monto_base = CitaService._calcular_monto_base(procedimientos)

            monto_descuento = Decimal("0.00")
            codigo = None
            if id_codigo_promocional is not None:
                codigo = session.get(CodigoPromocional, id_codigo_promocional)
                if not codigo:
                    raise NotFoundError("Código promocional no encontrado")
                codigo = CodigoPromocionalService.validar_codigo(session, codigo.codigo)
                monto_descuento = CodigoPromocionalService.calcular_descuento(
                    session,
                    codigo.codigo,
                    Decimal(valor_consulta),
                )

            monto_final = (monto_base + Decimal(valor_consulta) - monto_descuento).quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP,
            )

            cita = Cita(
                id_paciente=id_paciente,
                id_codigo_promocional=id_codigo_promocional,
                fecha_programada=fecha_programada,
                hora_inicio=hora_inicio,
                hora_fin=hora_fin,
                monto_base=monto_base,
                monto_descuento=monto_descuento,
                monto_final=monto_final,
                nota=nota,
                estado=estado.value,
            )
            session.add(cita)
            session.flush()

            for procedimiento in procedimientos:
                session.add(
                    CitaProcedimiento(
                        id_cita=cita.id,
                        id_procedimiento=procedimiento.id,
                        precio_unitario_al_reservar=procedimiento.precio,
                    )
                )

            session.flush()
            session.refresh(cita)
            return cita

    @staticmethod
    def listar_citas_por_fecha(session: Session, fecha_programada: date) -> list[Cita]:
        stmt = (
            select(Cita)
            .where(Cita.fecha_programada == fecha_programada)
            .options(
                selectinload(Cita.citas_procedimientos),
                selectinload(Cita.paciente),
                selectinload(Cita.codigo_promocional),
            )
            .order_by(Cita.hora_inicio)
        )
        return list(session.scalars(stmt).all())

    @staticmethod
    def cambiar_estado_cita(session: Session, cita_id: int, nuevo_estado: EstadoCita) -> Cita:
        cita = session.get(Cita, cita_id)
        if not cita:
            raise NotFoundError("Cita no encontrada")

        cita.estado = nuevo_estado.value
        session.flush()
        return cita
