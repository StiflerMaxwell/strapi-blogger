const { Client } = require('pg');

const client = new Client({
  host: '47.242.44.33',
  port: 6543,
  database: 'postgres',
  user: 'postgres.2xOvVs9sNiMMYztCE42D',
  password: 'Z5IFydA8m6Qhuw6SRuRemov352HRv0',
  ssl: false,
});

async function checkTables() {
  try {
    await client.connect();
    console.log('连接成功！');
    
    // 检查当前所有表
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    console.log('\n当前数据库中的表：');
    tables.rows.forEach(row => {
      console.log(`- ${row.tablename}`);
    });
    
    // 检查是否存在 admin_users 表
    const adminUsersExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      );
    `);
    
    console.log(`\nadmin_users 表是否存在: ${adminUsersExists.rows[0].exists}`);
    
    // 检查 Strapi 相关表
    const strapiTables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename LIKE '%strapi%'
      ORDER BY tablename
    `);
    
    console.log('\nStrapi 相关表：');
    strapiTables.rows.forEach(row => {
      console.log(`- ${row.tablename}`);
    });
    
  } catch (err) {
    console.error('错误：', err.message);
  } finally {
    await client.end();
  }
}

checkTables();
