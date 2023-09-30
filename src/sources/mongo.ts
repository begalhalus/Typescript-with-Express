import { DataSource } from 'typeorm'
import { Users } from '../entity/Users'
import { Roles } from '../entity/Roles'
import * as path from 'path'
import * as dotenv from 'dotenv'

const dotenvAbsolutePath = path.join(__dirname, '../../.env')
dotenv.config({
  path: dotenvAbsolutePath
})
const MongoDB = new DataSource({
  type: 'mongodb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: ['query', 'error'],
  entities: [Users, Roles],
  migrations: [],
  subscribers: []
})
MongoDB.initialize()
  .then(() => {
    console.log('Data Source has been initialized OK')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })

export default MongoDB
