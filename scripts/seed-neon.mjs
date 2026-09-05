import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: databaseUrl });

async function seed() {
  const client = await pool.connect();
  console.log("Connected to Neon. Seeding initial data...");

  const students = [
    ["st-rahul", "Rahul Sharma", "st-rahul", "batch-maths", "9876543210", "9876599901", "Class 10 Maths"],
    ["st-priya", "Priya Patel", "st-priya", "batch-maths", "9876543211", "9876599902", "Class 10 Maths"],
    ["st-aman", "Aman Verma", "st-aman", "batch-maths", "9876543212", null, "Class 10 Maths"],
    ["st-sneha", "Sneha Joshi", "st-sneha", "batch-science", "9876501111", null, "Class 9 Science"],
    ["st-arjun", "Arjun Singh", "st-arjun", "batch-science", "9876502222", null, "Class 9 Science"],
    ["st-meera", "Meera Nair", "st-meera", "batch-science", "9876503333", null, "Class 9 Science"],
    ["st-kabir", "Kabir Khan", "st-kabir", "batch-english", "9876504444", null, "Class 8 English"],
    ["st-ananya", "Ananya Iyer", "st-ananya", "batch-english", "9876505555", null, "Class 8 English"],
    ["st-rohan", "Rohan Desai", "st-rohan", "batch-english", "9876506666", null, "Class 8 English"],
  ];

  for (const s of students) {
    await client.query(
      `INSERT INTO students (id, name, roll_number, batch, parent_phone, student_phone, target_exam)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, parent_phone = EXCLUDED.parent_phone, student_phone = EXCLUDED.student_phone`,
      s,
    );
  }

  const teachers = [
    [
      "teacher-suhag",
      "Suhag Patel",
      "Sunrise Tuition Academy",
      "9737948529",
      "suhag.patel@sunrise.com",
      JSON.stringify(["Maths", "Physics"]),
    ],
    [
      "teacher-neha",
      "Neha Sharma",
      "Sunrise Tuition Academy",
      "9876543210",
      "neha.sharma@sunrise.com",
      JSON.stringify(["Science", "Chemistry"]),
    ],
  ];

  for (const t of teachers) {
    await client.query(
      `INSERT INTO teachers (id, name, tuition_name, phone, email, subjects)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email`,
      t,
    );
  }

  const res = await client.query("SELECT count(*) FROM students");
  console.log(`Success! Total students in Neon DB: ${res.rows[0].count}`);

  client.release();
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
