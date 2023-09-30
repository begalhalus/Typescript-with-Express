module.exports = {
  type: "mongodb",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: false,
  entities: ["src/entity/*.{js,ts}"],
  cli: {
    entitiesDir: "src/entity",
  },
};
