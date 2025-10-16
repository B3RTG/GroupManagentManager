# Contexto y Progreso Backend Reservas

## Entidades principales (actualizadas)
- **UnifiedReservation**: Agrupa reservas individuales, gestiona estado global, relación con torneos/eventos.
- **Reservation**: Reserva individual, vinculada a usuarios, grupos y partidos.
- **Match**: Evento deportivo, vinculado a reservas, participantes, suplentes e invitados.
- **Guest**: Invitado externo o suplente especial, gestión de invitaciones y notificaciones.
- **Participant**: Gestión de lista principal y suplentes, reglas de cupo y promoción automática.

## Análisis y puntos clave
- Endpoints REST definidos para cada entidad, alineados con el documento `pdg-backend-modulo-reservas.md`.
- Lógica de negocio: control de cupos, validaciones de permisos, sincronización de estados entre entidades, gestión de participantes e invitados.
- Modelo actualizado: uso de entidad intermedia para participantes, arrays diferenciados para participantes, suplentes e invitados.
- Validaciones estrictas en servicios antes de modificar arrays (cupos, duplicados, permisos).
- Flujo recomendado: creación de reservas, consulta de reservas unificadas, gestión de partidos y participantes, integración frontend-backend.

## Todo List actual
- [ ] Diseñar endpoints y lógica UnifiedReservation
- [ ] Diseñar endpoints y lógica Reservation
- [ ] Diseñar endpoints y lógica Match
- [ ] Diseñar endpoints y lógica Guest
- [ ] Diseñar endpoints y lógica Participant

## Propuesta de endpoints UnifiedReservation (ejemplo)
- `GET /api/unified-reservations?groupId=&date=&time=`
- `POST /api/unified-reservations`
- `GET /api/unified-reservations/:id`
- `PUT /api/unified-reservations/:id`
- `DELETE /api/unified-reservations/:id`
- `POST /api/unified-reservations/:id/reservations`
- `GET /api/unified-reservations/:id/reservations`
- `GET /api/unified-reservations/:id/matches`

## Lógica de negocio principal UnifiedReservation

- Creación: Validar permisos del usuario/grupo, evitar duplicados para mismo grupo/fecha/hora.
- Actualización: Permitir modificar estado, fecha, hora, reservas asociadas. Validar que los cambios no generen conflictos.
- Eliminación: Solo si no hay partidos activos o reservas confirmadas asociadas.
- Gestión de reservas individuales: Añadir/quitar reservas, sincronizar estado global.
- Gestión de partidos: Relacionar partidos con la reserva unificada, sincronizar estados.
- Sincronización de estados: Si una reserva individual o partido cambia de estado, actualizar el estado global de la reserva unificada si corresponde.
- Validaciones: Evitar solapamientos, cupos máximos, permisos de grupo.

---

Este archivo sirve como referencia para continuar el desarrollo y análisis del backend de reservas, partidos y gestión de invitados.
