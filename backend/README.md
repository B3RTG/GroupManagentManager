# Análisis Técnico Final y Documentación Backend

## Resumen Técnico
Este backend implementa una API REST robusta para la gestión de grupos, reservas, partidos/eventos, participantes e invitados, usando NestJS, TypeORM y PostgreSQL. El diseño sigue principios de modularidad, separación de responsabilidades y validación estricta mediante DTOs.

### Tecnologías principales
- **NestJS**: Framework para Node.js, arquitectura modular y escalable.
- **TypeORM**: ORM para gestión de entidades, relaciones y migraciones.
- **PostgreSQL**: Motor de base de datos relacional.
- **JWT Auth**: Autenticación y autorización basada en tokens.
- **class-transformer/class-validator**: Validación y transformación de DTOs.

## Arquitectura y Organización
El código está organizado en módulos por dominio: `groups`, `matches`, `reservations`, `unified-reservations`, `users`, `notifications`, etc. Cada módulo contiene:
- Controladores (Controllers): Definen los endpoints REST.
- Servicios (Services): Lógica de negocio y validaciones.
- DTOs: Definen la forma y validación de los datos de entrada/salida.
- Entidades: Modelos de base de datos y relaciones.

### Estructura de carpetas
```
src/
  ├── auth/
  ├── common/
  ├── groups/
  ├── matches/
  ├── migrations/
  ├── notifications/
  ├── reservations/
  ├── unified-reservations/
  └── users/
```

## Entidades y Relaciones Clave
- **User**: Usuario autenticado, puede ser creador de reservas, partidos o invitados.
- **Group**: Agrupa usuarios y reservas.
- **Reservation**: Reserva individual, asociada a usuario, grupo o partido.
- **UnifiedReservation**: Reserva compuesta que agrupa varias reservas y partidos.
- **Match**: Evento/partido, con participantes, suplentes e invitados.
- **Participant**: Relación usuario-partido, con rol (titular/suplente).
- **Guest**: Invitado a partido/reserva, con creador (createdBy).

Las relaciones están modeladas con entidades intermedias y claves foráneas, permitiendo trazabilidad y reglas de negocio avanzadas.

## Lógica de Negocio Principal
- **Gestión de reservas**: Validación de cupos, permisos, y relación con grupos/partidos.
- **Partidos/eventos**: Gestión de participantes, suplentes, invitados y reglas de promoción automática.
- **Invitados**: Gestión de invitaciones, aceptación/rechazo, y atribución de creador (auditoría).
- **DTOs**: Formalización estricta de entrada/salida, validación y transformación.
- **Consultas dinámicas**: Soporte para relaciones y filtros avanzados en endpoints.

## Seguridad y Autenticación
- **JWT**: Autenticación de usuarios y protección de endpoints.
- **Roles y permisos**: Validación de acceso según rol y relación con la entidad.
- **Decoradores y guards**: Implementación de lógica de autorización reutilizable.

## Migraciones y Base de Datos
- Migraciones gestionadas con TypeORM.
- Scripts para generación y ejecución de migraciones.
- Entidades sincronizadas con la base de datos y versionadas.

## DTOs Principales
- `CreateReservationForUnifiedDto`, `UnifiedReservationReadDto`, `CreateGuestDto`, `DisponibilityDto`, etc.
- Uso de `class-validator` para validación y `class-transformer` para salida tipada.

## Comandos habituales

### nestjs project
```bash
npm run start:dev   # ejecutar en modo depuración
npm run build       # build de la app
npm run start       # iniciar en modo desarrollo
npm run start:prod  # iniciar en modo producción
```

### typeorm
```bash
npm run typeorm migration:generate -- nombre_migracion -d ./src/data-source.ts   # generar nueva migración
npm run typeorm migration:run -- -d src/data-source.ts                           # ejecutar migraciones
npm run typeorm migration:generate -- src/migrations/reservation-creators-update -d src/data-source.ts
```

## Recursos útiles
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [class-validator](https://github.com/typestack/class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)
