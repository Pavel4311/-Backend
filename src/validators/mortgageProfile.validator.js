const PROPERTY_TYPES = new Set([
  "apartment_in_new_building",
  "apartment_in_secondary_building",
  "house",
  "house_with_land_plot",
  "land_plot",
  "other",
]);

const isNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);

const validateMortgageProfile = (body) => {
  const errors = [];

  if (!isNumber(body.propertyPrice) || body.propertyPrice <= 0) {
    errors.push("propertyPrice must be a positive number");
  }

  if (!PROPERTY_TYPES.has(body.propertyType)) {
    errors.push("propertyType is invalid");
  }

  if (!isNumber(body.downPaymentAmount) || body.downPaymentAmount < 0) {
    errors.push("downPaymentAmount must be a non-negative number");
  }

  if (
    body.matCapitalAmount !== null &&
    body.matCapitalAmount !== undefined &&
    (!isNumber(body.matCapitalAmount) || body.matCapitalAmount < 0)
  ) {
    errors.push("matCapitalAmount must be null or a non-negative number");
  }

  if (typeof body.matCapitalIncluded !== "boolean") {
    errors.push("matCapitalIncluded must be a boolean");
  }

  if (
    !Number.isInteger(body.mortgageTermYears) ||
    body.mortgageTermYears <= 0
  ) {
    errors.push("mortgageTermYears must be a positive integer");
  }

  if (!isNumber(body.interestRate) || body.interestRate < 0) {
    errors.push("interestRate must be a non-negative number");
  }

  const matCapital = body.matCapitalIncluded
    ? body.matCapitalAmount || 0
    : 0;
  if (
    isNumber(body.propertyPrice) &&
    isNumber(body.downPaymentAmount) &&
    body.propertyPrice - body.downPaymentAmount - matCapital <= 0
  ) {
    errors.push("loan amount must be greater than zero");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateMortgageProfile,
  PROPERTY_TYPES,
};
