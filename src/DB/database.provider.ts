import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './types'; // Импортируем наш интерфейс

@Injectable()
export class KyselyProvider implements OnModuleDestroy {
    public readonly db: Kysely<Database>;

    constructor() {
        // Создаем экземпляр Kysely
        this.db = new Kysely<Database>({
            // Используем диалект PostgreSQL
            dialect: new PostgresDialect({
                // Создаем пул соединений к БД с помощью драйвера 'pg'
                pool: new Pool({
                    connectionString: process.env.DATABASE_URL, // Берем URL из переменной окружения
                }),
            }),
        });
    }

    // Этот хук гарантирует, что соединение с БД будет gracefully закрыто при остановке приложения.
    async onModuleDestroy() {
        await this.db.destroy();
    }
}