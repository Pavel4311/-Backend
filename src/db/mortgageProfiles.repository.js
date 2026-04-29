const pool = require("./pool");

const getExecutor = (client) => client || pool;

const createProfile = async (client, profile) => {
  const executor = getExecutor(client);
  const query = `
    INSERT INTO MortgageProfile (
      property_price,
      property_type,
      down_payment_amount,
      mat_capital_amount,
      mat_capital_included,
      mortgage_term_years,
      interest_rate
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;
  const values = [
    profile.propertyPrice,
    profile.propertyType,
    profile.downPaymentAmount,
    profile.matCapitalAmount ?? null,
    profile.matCapitalIncluded,
    profile.mortgageTermYears,
    profile.interestRate,
  ];
  const result = await executor.query(query, values);
  return result.rows[0].id;
};

const saveCalculation = async (client, mortgageProfileId, calculation) => {
  const executor = getExecutor(client);
  const query = `
    INSERT INTO MortgageCalculation (
      mortgage_profile_id,
      monthly_payment,
      total_payment,
      total_overpayment_amount,
      possible_tax_deduction,
      savings_due_mother_capital,
      recommended_income,
      payment_schedule
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  const values = [
    mortgageProfileId,
    calculation.monthlyPayment,
    calculation.totalPayment,
    calculation.totalOverpaymentAmount,
    calculation.possibleTaxDeduction,
    calculation.savingsDueMotherCapital,
    calculation.recommendedIncome,
    calculation.mortgagePaymentSchedule,
  ];
  await executor.query(query, values);
};

const getCalculationByProfileId = async (mortgageProfileId) => {
  const query = `
    SELECT
      monthly_payment,
      total_payment,
      total_overpayment_amount,
      possible_tax_deduction,
      savings_due_mother_capital,
      recommended_income,
      payment_schedule
    FROM MortgageCalculation
    WHERE mortgage_profile_id = $1
    LIMIT 1
  `;
  const result = await pool.query(query, [mortgageProfileId]);
  return result.rows[0] || null;
};

module.exports = {
  createProfile,
  saveCalculation,
  getCalculationByProfileId,
};
