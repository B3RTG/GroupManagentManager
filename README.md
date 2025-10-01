## Licencia
Este proyecto está licenciado bajo los términos de la licencia MIT. Consulta el archivo LICENSE para más detalles.

# Sistema de Gestión de Grupos y Reservas Deportivas

Este proyecto permite gestionar grupos deportivos, reservas de pistas/espacios y la inscripción de participantes, facilitando la organización y comunicación para distintos deportes y formatos.

## Estructura del Proyecto

```
root/
	backend/        # Código fuente y tests del backend (API, lógica de negocio, modelos)
	web/            # Código fuente y tests de la app web (SPA)
	mobile/         # Código fuente y tests de la app móvil (PWA o nativo)
	docs/           # Documentación técnica y funcional
	scripts/        # Scripts de despliegue, migraciones, utilidades
	.github/        # Workflows de CI/CD
	README.md       # Descripción general del proyecto
```

## Descripción de Carpetas
- **backend/**: Implementación de la API, lógica de negocio, modelos y tests del servidor.
- **web/**: Aplicación web para usuarios y administradores, desarrollada como SPA.
- **mobile/**: Aplicación móvil (PWA o nativa) para acceso desde dispositivos móviles.
- **docs/**: Documentación funcional y técnica, especificaciones, diagramas y manuales.
- **scripts/**: Scripts para despliegue, migraciones de base de datos y utilidades.
- **.github/**: Configuración de workflows para integración y despliegue continuo (CI/CD).

## Recomendaciones Iniciales
- Mantener cada carpeta bien documentada y estructurada.
- Usar control de versiones (Git) y ramas para desarrollo y producción.
- Integrar CI/CD para pruebas y despliegue automatizado.
- Compartir modelos y utilidades comunes en una carpeta `shared/` si es necesario.
- Documentar dependencias y procesos en `docs/` y en este `README.md`.

## Documentación
Consulta la carpeta `docs/` para información técnica, funcional y diagramas detallados del sistema.

## Colaboración
Para contribuir, sigue las buenas prácticas de desarrollo, revisa la documentación y utiliza las ramas de desarrollo para tus cambios.

# Group Management Manager

Este monorepo contiene la gestión de grupos y reservas para deportes como pádel y otros.

## Estructura del proyecto

- `backend/` — API y lógica de negocio (NestJS)
- `web/` — Aplicación web (por definir)
- `mobile/` — Aplicación móvil (por definir)
- `docs/` — Documentación técnica y funcional
- `shared/` — Código compartido entre módulos
- `scripts/` — Scripts de automatización y utilidades
- `.github/` — Workflows y configuración de GitHub Actions

## Cómo empezar

1. Instala dependencias en cada módulo según corresponda.
2. Consulta la documentación en `docs/` para detalles técnicos y funcionales.
3. Usa el backend con NestJS para la API principal.

## Contacto

Para dudas o sugerencias, contacta al responsable del repositorio.
