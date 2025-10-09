import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Pet task')
        .setDescription('Mega description 100%!')
        .setVersion('1.0')
        .addTag('API')
        .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        },
        'JWT-auth',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
        persistAuthorization: true,
        authAction: {
            defaultBearerAuth: {
            name: 'JWT-auth',
            schema: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            value: 'Enter your JWT token here',
            },
        },
        },
  });
}