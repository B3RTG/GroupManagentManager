# Módulo de Reservas, Reservas Unificadas, Partidos y Gestión de Invitados (Guest)

Este documento describe la estructura, endpoints y lógica recomendada para la gestión de reservas, reservas unificadas, partidos/eventos y participantes/invitados en el backend del sistema.

---

## 1. Entidades principales

- **UnifiedReservation**: Reserva agrupada para un grupo, fecha y hora.
- **Reservation**: Reserva individual (pista/espacio concreto).
- **Match**: Partido/evento asociado a una reserva unificada.
- **User**: Usuario registrado.
- **Guest**: Invitado externo (no usuario registrado) o suplente especial.

---

## 2. Endpoints REST recomendados

### Reservas Unificadas
- `GET /api/unified-reservations?groupId=&date=&time=`
- `POST /api/unified-reservations`
- `GET /api/unified-reservations/:id`
- `PUT /api/unified-reservations/:id`
- `DELETE /api/unified-reservations/:id`
- `POST /api/unified-reservations/:id/reservations`
- `GET /api/unified-reservations/:id/reservations`
- `GET /api/unified-reservations/:id/matches`

### Reservas individuales
- `POST /api/reservations`
- `POST /api/unified-reservations/:id/reservations`
- `GET /api/unified-reservations/:id/reservations`
- `PUT /api/reservations/:id`
- `DELETE /api/reservations/:id`

### Partidos/Eventos
- `POST /api/unified-reservations/:id/matches`
- `GET /api/unified-reservations/:id/matches`
- `GET /api/matches/:id`
- `PUT /api/matches/:id`
- `DELETE /api/matches/:id`

### Inscripción y suplentes
- `POST /api/matches/:id/participants`
- `POST /api/matches/:id/substitutes`
- `GET /api/matches/:id/participants`
- `POST /api/matches/:id/leave`

### Gestión de invitados (Guest)
- `POST /api/matches/:id/guests` — Invitar usuario externo o suplente especial (body: nombre, email opcional)
- `GET /api/matches/:id/guests` — Listar invitados/suplentes externos
- `DELETE /api/matches/:id/guests/:guestId` — Eliminar invitado/suplente externo

---

## 3. Lógica recomendada para invitados (Guest)

- Los invitados pueden ser usuarios no registrados (nombre, email opcional) o suplentes especiales.
- Al inscribir un invitado, se añade a la lista de suplentes o participantes del partido.
- El sistema debe permitir gestionar la aceptación/rechazo de la invitación si se requiere.
- Los invitados pueden convertirse en usuarios registrados si aceptan la invitación y completan el registro.
- Permitir notificar a los invitados por email si se proporciona.

---

## 4. Ejemplo de payloads y respuestas

### Crear invitado
```json
POST /api/matches/:id/guests
{
  "name": "Juan Invitado",
  "email": "juan@example.com"
}
```

### Respuesta
```json
{
  "id": "uuid-guest",
  "name": "Juan Invitado",
  "email": "juan@example.com",
  "status": "pending"
}
```

### Listar invitados
```json
GET /api/matches/:id/guests
[
  {
    "id": "uuid-guest",
    "name": "Juan Invitado",
    "email": "juan@example.com",
    "status": "pending"
  },
  {
    "id": "uuid-guest2",
    "name": "Ana Suplente",
    "email": null,
    "status": "accepted"
  }
]
```

---

## 5. Consideraciones de integración frontend-backend

- El frontend debe consultar el estado de reservas unificadas y partidos antes de crear o modificar recursos.
- El backend expone endpoints claros para cada acción, permitiendo al frontend decidir el flujo según la interacción del usuario.
- La gestión de invitados permite flexibilidad para deportes y grupos con participantes externos o suplentes especiales.

---

## 6. Resumen de flujo recomendado

1. El usuario crea una reserva individual.
2. El sistema consulta si existe una reserva unificada para ese grupo/día/hora.
3. El frontend pregunta al usuario si quiere sumar plazas o crear partido diferente.
4. El backend procesa la acción según el endpoint llamado.
5. Se crean/actualizan reservas unificadas, partidos y participantes/invitados según la lógica elegida.

---

## 7. Gestión de plazas, suplentes y validaciones en inscripciones

Para garantizar que no se superen los límites de plazas y suplentes en los partidos/eventos, se recomienda la siguiente lógica:

### Control de plazas principales
- Al inscribir un participante principal (usuario o guest), el servicio consulta el partido (`Match`) y suma el total de inscritos en `participants` + `guestParticipants`.
- Si el total es igual o mayor que `maxParticipants`, rechaza la inscripción y ofrece inscribirse como suplente.

### Control de suplentes
- Al inscribir un suplente (usuario o guest), el servicio suma el total en `substitutes` + `guestSubstitutes`.
- Si hay un límite (`maxSubstitutes`) y se supera, rechaza la inscripción.

### Promoción automática de suplentes
- Si un participante principal abandona, el servicio promueve automáticamente al primer suplente (usuario o guest) a participante principal, si hay plazas libres.

### Validación en endpoints
- Antes de añadir a cualquier array, el servicio valida los límites y devuelve error si se exceden.

#### Ejemplo de lógica en el servicio:
```typescript
if (match.participants.length + match.guestParticipants.length >= match.maxParticipants) {
  throw new BadRequestException('No hay plazas disponibles como participante principal');
}
```

### Estructura recomendada en la entidad Match
- `participants: User[]` — principales
- `substitutes: User[]` — suplentes registrados
- `guestParticipants: Guest[]` — invitados principales
- `guestSubstitutes: Guest[]` — invitados suplentes

### Ejemplo de respuesta del endpoint de consulta de inscritos:
```json
{
  "participants": [ { "id": "user-uuid", "name": "Usuario Real" } ],
  "substitutes": [ { "id": "user-uuid2", "name": "Suplente Real" } ],
  "guestParticipants": [ { "id": "guest-uuid", "name": "Invitado Principal" } ],
  "guestSubstitutes": [ { "id": "guest-uuid2", "name": "Invitado Suplente" } ]
}
```
---

Este documento debe servir como referencia principal para la implementación y extensión del módulo de reservas, partidos y gestión de invitados en el backend.
