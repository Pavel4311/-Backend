const pool = require("./pool");

const createTable_MortgageProfile = async () => {
  try {
    const createTableQuery = `
CREATE TABLE IF NOT EXISTS MortgageProfile (
    id SERIAL PRIMARY KEY,
    user_id UUID References User(id),
    propertyPrice Decimal(12,2) not null,
    propertyType VARCHAR(50) not null check(property type in 
    'apartment_in_new_building', 
    'apartment_in_secondary_building', 
    'house', 
    'house_with_land_plot', 
    'land_plot', 
    'other'
  )),
  down_payment_amount DECIMAL(12,2) NOT NULL,
  mat_capital_amount DECIMAL(12,2),
  mat_capital_included BOOLEAN NOT NULL DEFAULT false,
  mortgage_term_years INT NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL
  )`;
    await pool.query(createTableQuery);
    console.log("MortgageProfile table created successfully");
  } catch (err) {
    console.error("Error creating table", err);
  }
};

// 2) MortgageCalculation
const createTable_MortgageCalculation = async () => {
  try {
    const createTableQuery = `
  CREATE TABLE IF NOT EXISTS MortgageCalculation (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES "User"(id),
    mortgage_profile_id INT NOT NULL REFERENCES MortgageProfile(id) ON DELETE CASCADE,
    monthly_payment DECIMAL(12,2) NOT NULL,
    total_payment DECIMAL(14,2) NOT NULL,
    total_overpayment_amount DECIMAL(14,2) NOT NULL,
    possible_tax_deduction DECIMAL(12,2) NOT NULL,
    savings_due_mother_capital DECIMAL(12,2) NOT NULL,
    recommended_income DECIMAL(12,2) NOT NULL,
    payment_schedule TEXT NOT NULL
  )`;
    await pool.query(createTableQuery);
    console.log("MortgageCalculation table created successfully");
  } catch (err) {
    console.error("Error creating table", err);
  }
};

const dropTable = async () => {
  await pool.query(`DROP TABLE IF EXISTS MortgageCalculation;`);
  console.log("Таблица users успешно удалена");
};

const runMigrations = async () => {
  await createTable_MortgageProfile();
  await createTable_MortgageCalculation();
  console.log("All migrations completed");
};

module.exports = {
  createTable_MortgageProfile,
  createTable_MortgageCalculation,
  runMigrations,
  dropTable,
};
