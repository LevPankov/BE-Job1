// можно было бы использовать registerAs из nestjs, было бы примерно то же самое
// но для маленького приложения так тоже норм

export default () => ({
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '60m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000',
    region: process.env.MINIO_REGION || 'ru-central1',
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
});
