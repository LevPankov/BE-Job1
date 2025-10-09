export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '60m',
  },
  
  database: {
    url: process.env.DATABASE_URL,
  },
});