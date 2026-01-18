import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

pool.on('connect', (success)=>{
    console.log('database connection successfully.!!!', success);
})

pool.on('error', (error)=>{
    console.error('Problem occurs on connecting to database', error);
})

export default pool;