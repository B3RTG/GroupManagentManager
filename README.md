
## Índice de idiomas / Language Index

| Español | English |
|---------|---------|
| [README.md](./README.md) | [README.en.md](./README.en.md) |

# Group Management Manager Monorepo

Este proyecto permite gestionar grupos deportivos, reservas de pistas/espacios y la inscripción de participantes, facilitando la organización y comunicación para distintos deportes y formatos.

## Estructura del Monorepo

```
root/
	apps/
		backend/         # API y lógica de negocio (NestJS)
		web/             # Aplicación web (Vite/React)
		mobile/
			groupmanagmentapp/ # App móvil (Flutter)
	packages/
		shared/          # Código compartido entre módulos
	docs/              # Documentación técnica y funcional
	README.md          # Descripción general del proyecto
	.gitignore         # Configuración de archivos ignorados
	pnpm-workspace.yaml# Configuración de workspaces
```

## Comandos principales

Desde la raíz del monorepo, usando pnpm:

- Instalar dependencias:
	```bash
	pnpm install
	```
- Iniciar backend:
	```bash
	pnpm dev:backend
	```
- Iniciar web:
	```bash
	pnpm dev:web
	```
- Iniciar app móvil (Flutter):
	```bash
	pnpm dev:mobile
	# O manualmente:
	cd apps/mobile/groupmanagmentapp && flutter run
	```
- Lint y formato en todos los workspaces:
	```bash
	pnpm lint
	pnpm format
	```

## Buenas prácticas

- Mantén cada workspace bien documentado y estructurado.
- Usa ramas por feature y PRs para cambios.
- Los archivos `.env` y variables sensibles están protegidos por `.gitignore`.
- El archivo `.env.example` sirve de plantilla para configuración local.
- Consulta la carpeta `docs/` para información técnica y diagramas.


## Colaboración

Para contribuir:
- Sigue las buenas prácticas de desarrollo.
- Revisa la documentación y utiliza ramas de desarrollo para tus cambios.
- Haz commits descriptivos y revisa los cambios antes de subirlos.

## Licencia
Este proyecto está licenciado bajo los términos de la licencia MIT. Consulta el archivo LICENSE para más detalles.

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

Para dudas, sugerencias o soporte, puedes contactar al responsable del repositorio:

- **Autor:** Albert (B3RTG)
- **Email:** [albert.kais@gmail.com]
- O abre un issue en GitHub.
