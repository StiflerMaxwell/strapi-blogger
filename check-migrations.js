const { Client } = require('pg');

const client = new Client({
  host: '47.242.44.33',
  port: 6543,
  database: 'postgres',
  user: 'postgres.2xOvVs9sNiMMYztCE42D',
  password: 'Z5IFydA8m6Qhuw6SRuRemov352HRv0',
  ssl: false,
});

async function checkMigrations() {
  try {
    await client.connect();
    console.log('连接成功！');
    
    // 检查迁移记录
    const migrations = await client.query('SELECT * FROM strapi_migrations ORDER BY time DESC');
    console.log('\n迁移记录：');
    migrations.rows.forEach(row => {
      console.log(`- ${row.name} (${row.time})`);
    });
    
    // 检查内部迁移
    const internalMigrations = await client.query('SELECT * FROM strapi_migrations_internal ORDER BY time DESC');
    console.log('\n内部迁移记录：');
    internalMigrations.rows.forEach(row => {
      console.log(`- ${row.name} (${row.time})`);
    });
    
    // 检查数据库模式
    const schema = await client.query('SELECT * FROM strapi_database_schema');
    console.log('\n数据库模式记录：');
    schema.rows.forEach(row => {
      console.log(`- ${row.id}: ${JSON.stringify(row.schema).substring(0, 100)}...`);
    });
    
  } catch (err) {
    console.error('错误：', err.message);
  } finally {
    await client.end();
  }
}

checkMigrations();
