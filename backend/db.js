const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',
  database: 'gestor-de-gastos',
  password: 'matias',
  port: 5432,
});

module.exports = pool;
