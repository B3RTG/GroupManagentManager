import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { skip } from 'rxjs';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    //skipMissingProperties: true,
  }));

  // --- CORS config solo en desarrollo o no-producción ---
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: ['http://localhost:33847'], // Puertos para Flutter web y desarrollo
      credentials: true, // si usas cookies o autenticación
    });
  }

  // --- Swagger config solo en desarrollo o no-producción ---
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Group Management API')
      .setDescription('Documentación de la API para gestión de grupos, reservas y partidos')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  // --- Fin Swagger config ---

  // log para ver las variables de entorno cargadas (solo en desarrollo)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Environment Variables:');
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
