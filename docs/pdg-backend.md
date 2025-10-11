# Documento Técnico: Backend

## 1. Introducción
Este documento describe la arquitectura, tecnologías, modelos de datos, APIs y lógica de negocio del backend para el sistema de gestión de grupos y reservas deportivas. El objetivo es proporcionar una base robusta, escalable y segura que cumpla con los requisitos funcionales y técnicos definidos.

## 2. Arquitectura General
- Arquitectura modular basada en servicios (monolito escalable o microservicios según el volumen esperado).
- Backend desacoplado del frontend, expone API RESTful y/o GraphQL.
- Integración con sistemas de notificaciones y autenticación centralizada.
- Persistencia en base de datos relacional (PostgreSQL/MySQL) o NoSQL (MongoDB) según necesidades.

### Diagrama de Arquitectura
```mermaid
flowchart TD
	A[Frontend SPA / App Móvil] --API REST/GraphQL--> B[Backend]
	B --ORM--> C[(Base de Datos)]
	B --Notificaciones--> D[Servicios Externos]
	B --Autenticación--> E[OAuth2/JWT]
	D --Email/Push/WhatsApp--> F[Usuarios]
```

## 3. Tecnologías y Herramientas

Las tecnologías y herramientas recomendadas para el desarrollo del backend son:

- **Lenguaje y Framework:** Node.js (NestJS)
- **Base de datos:** PostgreSQL, MySQL o MongoDB
- **ORM:** TypeORM, Prisma
- **Autenticación:** JWT, OAuth2, integración con Google, Facebook, Apple, Microsoft
- **Notificaciones:** SendGrid (email), Firebase Cloud Messaging (push), Twilio (WhatsApp)
- **Contenerización y despliegue:** Docker, CI/CD (GitHub Actions, GitLab CI)
- **Monitorización:** Prometheus, Grafana
- **Logs:** ELK Stack (Elasticsearch, Logstash, Kibana)

## 4. Modelos de Datos
El backend implementará los siguientes modelos, alineados con la definición funcional y técnica:
### Usuario
- id (PK)
- nombre
- email
- contraseña (hash)
- deportes_preferidos

### Grupo
- id (PK)
- nombre
- administradores (array de id_usuario)
- miembros (array de id_usuario)

### ReservaUnificada
- id (PK)
- fecha
- grupo_id (FK)
- plazas_totales

### Reserva
- id (PK)
- reserva_unificada_id (FK)
- grupo_id (FK)
- fecha
- hora
- pistas (array o número de plazas)
- creador_id (FK)

### Partido/Eventos
- id (PK)
- reserva_unificada_id (FK)
- deporte
- participantes (array de id_usuario)
- suplentes (array de id_usuario)

### Diagrama Entidad-Relación
```mermaid
erDiagram
	USUARIO ||--o{ GRUPO : pertenece
	GRUPO ||--o{ USUARIO : tiene
	GRUPO ||--o{ RESERVAUNIFICADA : organiza
	RESERVAUNIFICADA ||--o{ RESERVA : agrupa
	RESERVA ||--|| RESERVAUNIFICADA : pertenece
	PARTIDO ||--|| RESERVAUNIFICADA : sobre
	PARTIDO ||--o{ USUARIO : participa
	PARTIDO ||--o{ USUARIO : suplente
```


## 5. API REST/GraphQL
El backend expondrá endpoints para la gestión de usuarios, grupos, reservas, reservas unificadas y partidos/eventos. Ejemplo de estructura REST:

- `/api/auth` (registro, login, autenticación OAuth2/JWT)
- `/api/usuarios` (CRUD de usuarios)
- `/api/grupos` (CRUD de grupos, gestión de miembros y administradores)
- `/api/reservas-unificadas` (crear, consultar, modificar reservas unificadas)
- `/api/reservas` (crear, consultar, modificar reservas individuales)
- `/api/partidos` (gestión de partidos/eventos, inscripción de participantes y suplentes)
- `/api/notificaciones` (envío y gestión de notificaciones)

Cada endpoint validará roles y permisos, y gestionará la lógica de negocio descrita en el documento funcional.

## 6. Lógica de Negocio
La lógica de negocio del backend cubre los siguientes aspectos clave:

### 6.1. Gestión de Usuarios
- Registro y autenticación segura (JWT/OAuth2).
- Edición de perfil y deportes preferidos.
- Validación de pertenencia a grupos.

### 6.2. Gestión de Grupos
- Creación y edición de grupos.
- Gestión de miembros y administradores.
- Permitir que usuarios pertenezcan a varios grupos.

### 6.3. Gestión de Reservas y Reservas Unificadas
- Creación de reservas individuales siempre asociadas a una reserva unificada.
- Unificación de reservas para sumar plazas y gestionar eventos conjuntos.
- Modificación y consulta de reservas y reservas unificadas.

### 6.4. Gestión de Partidos/Eventos
- Creación de partidos/eventos sobre reservas unificadas.
- Inscripción de participantes y suplentes.
- Lógica de reemplazo automático de suplentes.

### 6.5. Notificaciones
- Envío de notificaciones automáticas por email, push y WhatsApp (opcional).
- Avisos de plazas libres, cambios y reemplazos.

## 7. Seguridad y Autenticación
- Autenticación centralizada (JWT/OAuth2).
- Roles y permisos: administrador, usuario.
- Validación de acceso a recursos según rol.
- Cifrado seguro de contraseñas (bcrypt).
- Protección de datos personales y cumplimiento de privacidad.

## 8. Ejemplos de Endpoints REST
```http
POST /api/auth/register
POST /api/auth/login
GET /api/usuarios/{id}
POST /api/grupos
POST /api/grupos/{id}/miembros
POST /api/reservas-unificadas
POST /api/reservas
POST /api/partidos
POST /api/partidos/{id}/inscripcion
POST /api/partidos/{id}/suplentes
POST /api/notificaciones
```

## 9. Integración con Notificaciones
- Integración con servicios externos (SendGrid, Firebase, Twilio).
- Gestión de plantillas y eventos de notificación.

## 10. Despliegue y Mantenimiento
- Contenerización con Docker.
- CI/CD para despliegue automatizado.
- Monitorización (Prometheus, Grafana).
- Logs centralizados (ELK Stack).
- Backups periódicos.

## 11. Diagramas Técnicos
Ver documento técnico general para diagramas de arquitectura y entidad-relación.

## 12. Flujos de Usuario

### 12.1. Registro y Autenticación de Usuario
1. El usuario puede registrarse y autenticarse de dos formas:
	- Mediante email/contraseña accediendo al endpoint `/api/auth/register` y enviando sus datos.
	- Mediante redes sociales (Google, Facebook, Apple, Microsoft) accediendo al endpoint `/api/auth/{proveedor}` y autorizando el acceso.
2. El backend valida los datos, crea el usuario y almacena la contraseña cifrada o vincula la cuenta social.
3. El usuario inicia sesión usando email/contraseña (`/api/auth/login`) o mediante el proveedor social, recibiendo un token JWT/OAuth2.
4. El token se usa para autenticar y autorizar todas las operaciones posteriores.

### 12.2. Creación y Gestión de Grupos
1. Un usuario autenticado accede al endpoint de creación de grupo (`/api/grupos`).
2. El backend crea el grupo y asigna al usuario como administrador.
3. El administrador puede invitar y gestionar miembros y otros administradores.
4. Los usuarios pueden pertenecer a varios grupos.

### 12.3. Creación de Reservas y Reservas Unificadas
1. Un administrador accede al endpoint de creación de reserva unificada (`/api/reservas-unificadas`).
2. Se crean una o varias reservas individuales asociadas a la reserva unificada (`/api/reservas`).
3. El backend suma las plazas y gestiona la relación entre reservas y reserva unificada.
4. Se pueden modificar y consultar reservas y reservas unificadas.

### 12.4. Inscripción a Partidos/Eventos y Gestión de Suplentes
1. Los usuarios ven las plazas disponibles en la reserva unificada y acceden al endpoint de inscripción (`/api/partidos/{id}/inscripcion`).
2. Si las plazas principales están llenas, pueden inscribirse como suplentes (`/api/partidos/{id}/suplentes`).
3. El backend gestiona la lista de participantes y suplentes, y realiza reemplazos automáticos si hay bajas.

### 12.5. Envío de Notificaciones
1. El backend detecta eventos relevantes (nueva reserva, cambios, plazas libres, reemplazos).
2. Se envían notificaciones automáticas por email, push o WhatsApp según la configuración del usuario.
3. El sistema registra el estado y entrega de las notificaciones.


# ANEXO 

## Gestión de Reservas, Partidos y Eventos: Modelo y Flujo

Esta sección describe en detalle el modelo de datos y la lógica de negocio para la gestión de reservas, reservas agrupadas y partidos/eventos deportivos. El objetivo es facilitar la comprensión y el desarrollo posterior, asegurando flexibilidad y escalabilidad para distintos deportes y formatos.

### 1. Entidades principales

#### UnifiedReservation (Reserva agrupada)
- Representa la reserva global para un grupo en una fecha concreta, sumando todas las plazas disponibles (por ejemplo, varias pistas en el mismo día).
- Permite agrupar varias reservas individuales bajo un mismo evento, facilitando la gestión de plazas y la inscripción de participantes/suplentes sobre el total.

#### Reservation (Reserva individual)
- Cada reserva representa una pista/espacio concreto, con su hora y detalles específicos.
- Permite flexibilidad para reservar varias pistas/espacios en el mismo día, y asociarlas a la reserva agrupada.

#### Match (Partido/Event/Actividad)
- Representa el partido o evento que se juega sobre una reserva agrupada, gestionando la inscripción de participantes y suplentes.
- Permite asociar la lógica deportiva (inscripción, suplentes, reglas) a la reserva agrupada, sin mezclarla con la lógica de reservas de pistas.

### 2. Relación entre entidades

- Una `UnifiedReservation` puede tener varias `Reservation` asociadas.
- Un `Match` se asocia a una `UnifiedReservation` y gestiona la inscripción de usuarios sobre el total de plazas.

#### Diagrama simplificado

```mermaid
erDiagram
		GROUP ||--o{ UNIFIEDRESERVATION : organiza
		UNIFIEDRESERVATION ||--o{ RESERVATION : agrupa
		UNIFIEDRESERVATION ||--o{ MATCH : tiene
		MATCH ||--o{ USER : participa
		MATCH ||--o{ USER : suplente
```

### 3. Ejemplo de flujo

1. El admin crea una `UnifiedReservation` para el grupo el sábado (total 12 plazas).
2. Se crean 3 `Reservation` individuales (3 pistas, diferentes horas).
3. Se crea un `Match` sobre la `UnifiedReservation` y los usuarios se inscriben como participantes/suplentes sobre el total de plazas.
4. El sistema gestiona la inscripción y el reemplazo automático de suplentes.

### 4. Ventajas del modelo

- Flexibilidad para deportes con varias pistas/espacios.
- Gestión clara de plazas y suplentes.
- Permite unificar reservas y gestionar eventos conjuntos.
- Mantiene la lógica deportiva separada de la lógica de reservas.

### 5. Ejemplo de entidades TypeORM

#### unifiedReservation.entity.ts
```typescript
@Entity()
export class UnifiedReservation {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	date: Date;

	@ManyToOne(() => Group)
	group: Group;

	@Column()
	totalSlots: number;

	@OneToMany(() => Reservation, (reservation) => reservation.unifiedReservation)
	reservations: Reservation[];

	@OneToMany(() => Match, (match) => match.unifiedReservation)
	matches: Match[];
}
```

#### reservation.entity.ts
```typescript
@Entity()
export class Reservation {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => UnifiedReservation, (ur) => ur.reservations)
	unifiedReservation: UnifiedReservation;

	@ManyToOne(() => Group)
	group: Group;

	@Column()
	date: Date;

	@Column()
	time: string;

	@Column()
	courts: number;

	@ManyToOne(() => User)
	creator: User;
}
```

#### match.entity.ts
```typescript
@Entity()
export class Match {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => UnifiedReservation, (ur) => ur.matches)
	unifiedReservation: UnifiedReservation;

	@ManyToOne(() => Group)
	group: Group;

	@Column()
	sport: string;

	@Column()
	maxParticipants: number;

	@ManyToMany(() => User)
	@JoinTable()
	participants: User[];

	@ManyToMany(() => User)
	@JoinTable()
	substitutes: User[];

	@ManyToOne(() => User)
	createdBy: User;
}
```

### 6. Endpoints REST recomendados

- `/api/unified-reservations` — CRUD de reservas agrupadas.
- `/api/reservations` — CRUD de reservas individuales.
- `/api/matches` — CRUD de partidos/eventos.
- `/api/unified-reservations/:id/matches` — Listar partidos de una reserva agrupada.
- `/api/matches/:id/inscripcion` — Inscribir participante.
- `/api/matches/:id/suplentes` — Inscribir suplente.

### 7. Lógica de negocio clave

- Al crear una reserva agrupada, se pueden asociar varias reservas individuales.
- Los partidos/eventos se crean sobre una reserva agrupada y gestionan la inscripción de usuarios.
- El sistema permite reemplazo automático de suplentes y notificaciones.

### 8. Consideraciones para el desarrollador

- Mantener la separación de responsabilidades entre reservas y partidos/eventos.
- Validar siempre la existencia y disponibilidad de plazas antes de inscribir participantes.
- Documentar y testear los endpoints y la lógica de reemplazo de suplentes.

---

Esta sección debe servir como referencia principal para cualquier desarrollador que implemente o extienda la gestión de reservas y partidos/eventos en el backend.