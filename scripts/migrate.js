const fs = require("fs");
const path = require("path");
const pool = require("../src/config/db");

async function migrate() {
  // 실행 기록 테이블
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const executed = await pool.query("SELECT filename FROM migrations");
  const executedNames = executed.map((row) => row.filename);

  const migrationsDir = path.join(__dirname, "../migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (executedNames.includes(file)) {
      console.log(`Skip (already executed): ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");

    try {
      await pool.query(sql);
      await pool.query("INSERT INTO migrations (filename) VALUES (?)", [file]);
      console.log(`Executed: ${file}`);
    } catch (err) {
      console.error(`Failed on ${file}:`, err.message);
      process.exit(1);
    }
  }

  console.log("All migrations complete.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
