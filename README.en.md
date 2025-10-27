# Language | Idioma
--- | ---
[English](./README.en.md) | [Español](./README.md)
# Group Management Manager Monorepo

This project allows you to manage sports groups, court/space reservations, and participant registration, making organization and communication easier for various sports and formats.

## Monorepo Structure

```
root/
  apps/
    backend/         # API and business logic (NestJS)
    web/             # Web application (Vite/React)
    mobile/
      groupmanagmentapp/ # Mobile app (Flutter)
  packages/
    shared/          # Shared code between modules
  docs/              # Technical and functional documentation
  README.md          # Project overview (Spanish)
  README.en.md       # Project overview (English)
  .gitignore         # Ignored files configuration
  pnpm-workspace.yaml# Workspaces configuration
```

## Main Commands

From the monorepo root, using pnpm:

- Install dependencies:
  ```bash
  pnpm install
  ```
- Start backend:
  ```bash
  pnpm dev:backend
  ```
- Start web:
  ```bash
  pnpm dev:web
  ```
- Start mobile app (Flutter):
  ```bash
  pnpm dev:mobile
  # Or manually:
  cd apps/mobile/groupmanagmentapp && flutter run
  ```
- Lint and format all workspaces:
  ```bash
  pnpm lint
  pnpm format
  ```

## Best Practices

- Keep each workspace well documented and organized.
- Use feature branches and PRs for changes.
- `.env` files and sensitive variables are protected by `.gitignore`.
- The `.env.example` file serves as a template for local configuration.
- Check the `docs/` folder for technical information and diagrams.

## Collaboration

To contribute:
- Follow development best practices.
- Review documentation and use development branches for your changes.
- Make descriptive commits and review changes before pushing.

## Contact

For questions, suggestions, or support, contact the repository owner:

- **Author:** Albert (B3RTG)
- **Email:** [your-email@example.com]
- Or open an issue on GitHub.

## License
This project is licensed under the MIT license. See the LICENSE file for details.
