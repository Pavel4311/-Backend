const pool = require("../db/pool");
const repository = require("../db/mortgageProfiles.repository");
const { calculateMortgage } = require("../services/mortgageCalculator");
const { validateMortgageProfile } = require("../validators/mortgageProfile.validator");

const toNumber = (value) =>
  typeof value === "string" ? Number(value) : value;

const formatMoney = (value) => toNumber(value).toFixed(2);

const createMortgageProfile = async (req, res, next) => {
  const { isValid, errors } = validateMortgageProfile(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const profileId = await repository.createProfile(client, req.body);
    const calculation = calculateMortgage(req.body);
    await repository.saveCalculation(client, profileId, calculation);
    await client.query("COMMIT");

    return res.status(201).json({ id: String(profileId) });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  } finally {
    client.release();
  }
};

const getMortgageProfile = async (req, res, next) => {
  const profileId = Number(req.params.id);
  if (!Number.isInteger(profileId) || profileId <= 0) {
    return res.status(400).json({ error: "Invalid profile id" });
  }

  try {
    const calculation = await repository.getCalculationByProfileId(profileId);
    if (!calculation) {
      return res.status(404).json({ error: "Mortgage profile not found" });
    }

    const schedule =
      typeof calculation.payment_schedule === "string"
        ? JSON.parse(calculation.payment_schedule)
        : calculation.payment_schedule;

    return res.json({
      monthlyPayment: formatMoney(calculation.monthly_payment),
      totalPayment: formatMoney(calculation.total_payment),
      totalOverpaymentAmount: formatMoney(
        calculation.total_overpayment_amount
      ),
      possibleTaxDeduction: formatMoney(
        calculation.possible_tax_deduction
      ),
      savingsDueMotherCapital: formatMoney(
        calculation.savings_due_mother_capital
      ),
      recommendedIncome: formatMoney(calculation.recommended_income),
      mortgagePaymentSchedule: schedule,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createMortgageProfile,
  getMortgageProfile,
};
