import mysql from 'mysql2/promise'

let pool = null

const createPool = () =>
  mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'word_association_lab',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

const ensurePool = () => {
  if (!pool) {
    pool = createPool()
  }

  return pool
}

export const query = async (sql, params = []) => {
  const [rows] = await ensurePool().execute(sql, params)
  return rows
}

export const getPool = () => ensurePool()
