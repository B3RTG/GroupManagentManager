# Documento Técnico: Sistema de Gestión de Grupos y Reservas Deportivas

## 1. Objetivo del Proyecto
Desarrollar una plataforma para gestionar grupos deportivos, reservas de pistas/espacios y la inscripción de participantes, eliminando la dependencia de WhatsApp y facilitando la organización, comunicación y flexibilidad para distintos deportes y formatos.

## 2. Alcance Técnico

### 2.1. Gestión de Usuarios
- Registro y autenticación de usuarios (OAuth2/JWT, cifrado seguro).
- Perfil de usuario: nombre, contacto, deportes preferidos.
- Un usuario puede pertenecer a varios grupos.

### 2.2. Gestión de Grupos
- Creación y administración de grupos deportivos.
- Varios administradores por grupo.
- Invitación y gestión de miembros.

### 2.3. Gestión de Reservas
- Creación de reservas para pistas/espacios en fechas y horas específicas.
- Una reserva puede tener uno o más espacios/pistas (n plazas).
- Asignación de participantes principales y suplentes.
- Unificación de reservas para el mismo día (flexibilidad de plazas):
	- Se permite agrupar reservas mediante un campo `reserva_padre_id` o una tabla de agrupación (`ReservaUnificada`).
	- Al unificar, se suman las plazas y se gestionan los participantes y suplentes como un solo evento.
	- La interfaz mostrará el evento unificado, permitiendo inscribirse sobre el total de plazas.
	- El sistema gestiona suplentes y reemplazos automáticos en el conjunto de reservas unificadas.

### 2.4. Inscripción a Partidos/Eventos
- Los usuarios pueden apuntarse como participantes o suplentes.
- Visualización de plazas disponibles y suplentes.
- Lógica para reemplazo automático si hay baja o plazas libres.
- Notificaciones automáticas (email, push, WhatsApp opcional).

### 2.5. Adaptabilidad a Otros Deportes
- Configuración de número de participantes por partido/evento según el deporte.
- Soporte para diferentes reglas y dinámicas de inscripción.

## 3. Requerimientos Técnicos
- Plataforma web (SPA: React, Vue.js, Angular).
- Backend: Node.js (Express/NestJS) o Python (Django/FastAPI).
- Base de datos relacional (PostgreSQL/MySQL) o NoSQL (MongoDB).
- Sistema de notificaciones (SendGrid, Firebase, Twilio).
- Seguridad y privacidad de datos.
- Despliegue con Docker, CI/CD, monitorización y backups.

## 4. Modelos de Datos
**Usuario:** id, nombre, email, contraseña (hash), deportes_preferidos
**Grupo:** id, nombre, administradores (array de id_usuario), miembros (array de id_usuario)

**ReservaUnificada:** id, fecha, grupo_id, plazas_totales
**Reserva:** id, reserva_unificada_id, grupo_id, fecha, hora, pistas (array o número de plazas), creador_id
**Partido/Eventos:** id, reserva_unificada_id, deporte, participantes (array de id_usuario), suplentes (array de id_usuario)

## 5. Flujos y Casuística
- Reservas múltiples y unificadas en un día.
- Inscripción de participantes y suplentes.
- Reemplazo automático de suplentes.
- Visualización de plazas y suplentes en la interfaz.
- Usuarios en varios grupos y grupos con varios administradores.

## 6. Seguridad y Privacidad
- Roles y permisos: administrador, usuario.
- Gestión segura de datos y privacidad.

## 7. Despliegue y Mantenimiento
- Docker, CI/CD, monitorización (Prometheus, Grafana), logs centralizados (ELK Stack), backups.

## 8. Diagramas Técnicos


### 8.1. Diagrama Entidad-Relación (ER)
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

### 8.2. Diagrama de Arquitectura
```mermaid
flowchart TD
	A[Frontend SPA] --API REST/GraphQL--> B[Backend]
	B --ORM--> C[(Base de Datos)]
	B --Notificaciones--> D[Servicios Externos]
	B --Autenticación--> E[OAuth2/JWT]
	D --Email/Push/WhatsApp--> F[Usuarios]
```

### 8.3. Diagrama de Módulos
```mermaid
flowchart LR
	Auth[Autenticación]
	Users[Gestión de Usuarios]
	Groups[Gestión de Grupos]
	Reservations[Gestión de Reservas]
	Matches[Partidos/Eventos]
	Notif[Notificaciones]
	Admin[Panel de Administración]
	Auth --> Users
	Users --> Groups
	Groups --> Reservations
	Reservations --> Matches
	Matches --> Notif
	Admin --> Users
	Admin --> Groups
	Admin --> Reservations
	Admin --> Matches
```
