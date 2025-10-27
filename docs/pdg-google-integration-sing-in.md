# Integración de Google Sign-In para Apps Móviles

## Flujo recomendado para apps móviles

1. La app móvil usa el paquete `google_sign_in` para obtener el `idToken` de Google.
2. La app envía ese `idToken` a tu backend (por ejemplo, con un endpoint `POST /auth/google/mobile`).
3. El backend valida el `idToken` con Google (usando la API de Google).
4. Si es válido, el backend crea (o busca) el usuario y responde con el JWT y los datos del usuario.

---

## Cambios necesarios en el backend (NestJS)

### A. Nuevo endpoint para login móvil con Google
- Ruta sugerida: `POST /auth/google/mobile`
- Body: `{ "idToken": "<token_obtenido_en_la_app>" }`

### B. Lógica del endpoint
1. Recibe el `idToken` en el body.
2. Valida el `idToken` llamando a Google (endpoint: `https://oauth2.googleapis.com/tokeninfo?id_token=...`).
3. Si es válido, extrae los datos del usuario (email, nombre, googleId, etc).
4. Busca o crea el usuario en tu base de datos.
5. Genera tu JWT y responde con el mismo formato que el login normal:
   ```json
   {
     "user": {
       "email": "string",
       "name": "string",
       "provider": "google",
       "googleId": "string"
     },
     "token": "JWT"
   }
   ```

### C. Seguridad
- Valida siempre el `idToken` con Google.
- No aceptes tokens sin validar.
- Opcional: verifica el `aud` del token para que coincida con tu clientId de Google.

---

## Ejemplo de implementación en NestJS

```typescript
// auth.controller.ts
@Post('google/mobile')
async googleMobileLogin(@Body('idToken') idToken: string) {
  // 1. Validar el idToken con Google
  const response = await this.httpService.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  ).toPromise();
  const data = response.data;
  if (!data || !data.email) {
    throw new UnauthorizedException('Invalid Google token');
  }
  // 2. Buscar o crear usuario
  // ... tu lógica aquí ...
  // 3. Generar JWT
  // ... tu lógica aquí ...
  // 4. Responder
  return {
    user: {
      email: data.email,
      name: data.name,
      provider: 'google',
      googleId: data.sub
    },
    token: 'JWT_GENERADO'
  };
}
```

---

## Resumen de cambios
- Añadir endpoint `POST /auth/google/mobile` que reciba `{ idToken }`.
- Validar el token con Google.
- Buscar/crear usuario y devolver JWT.

---

¿Dudas o necesitas ayuda para adaptar la lógica a tu servicio de usuarios/JWT en NestJS?
