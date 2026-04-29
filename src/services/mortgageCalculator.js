const PROPERTY_DEDUCTION_LIMIT = 2_000_000;
const INTEREST_DEDUCTION_LIMIT = 3_000_000;
const TAX_RATE = 0.13;
const RECOMMENDED_INCOME_SHARE = 0.4;

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const buildSchedule = (loanAmount, monthlyPayment, monthlyRate, months) => {
  const schedule = {};
  let balance = loanAmount;

  for (let index = 1; index <= months; index += 1) {
    const year = String(Math.ceil(index / 12));
    const month = String(((index - 1) % 12) + 1);
    const interestPayment = round2(balance * monthlyRate);
    let principalPayment = round2(monthlyPayment - interestPayment);
    let totalPayment = monthlyPayment;

    if (index === months) {
      principalPayment = round2(balance);
      totalPayment = round2(principalPayment + interestPayment);
      balance = 0;
    } else {
      balance = round2(balance - principalPayment);
      if (balance < 0) {
        balance = 0;
      }
    }

    if (!schedule[year]) {
      schedule[year] = {};
    }

    schedule[year][month] = {
      totalPayment,
      repaymentOfMortgageBody: principalPayment,
      repaymentOfMortgageInterest: interestPayment,
      mortgageBalance: balance,
    };
  }

  return schedule;
};

const calculateMortgage = (profile) => {
  const matCapital = profile.matCapitalIncluded
    ? profile.matCapitalAmount || 0
    : 0;
  const loanAmount = round2(
    profile.propertyPrice - profile.downPaymentAmount - matCapital
  );
  const months = profile.mortgageTermYears * 12;
  const monthlyRate = profile.interestRate / 12 / 100;

  let monthlyPayment;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / months;
  } else {
    const rateFactor = Math.pow(1 + monthlyRate, months);
    monthlyPayment =
      (loanAmount * monthlyRate * rateFactor) / (rateFactor - 1);
  }
  monthlyPayment = round2(monthlyPayment);

  const totalPayment = round2(monthlyPayment * months);
  const totalOverpaymentAmount = round2(totalPayment - loanAmount);

  const propertyDeduction = round2(
    Math.min(profile.propertyPrice, PROPERTY_DEDUCTION_LIMIT) * TAX_RATE
  );
  const interestDeduction = round2(
    Math.min(totalOverpaymentAmount, INTEREST_DEDUCTION_LIMIT) * TAX_RATE
  );
  const possibleTaxDeduction = round2(
    propertyDeduction + interestDeduction
  );

  const savingsDueMotherCapital = round2(matCapital);
  const recommendedIncome = round2(
    monthlyPayment / RECOMMENDED_INCOME_SHARE
  );

  const mortgagePaymentSchedule = buildSchedule(
    loanAmount,
    monthlyPayment,
    monthlyRate,
    months
  );

  return {
    monthlyPayment,
    totalPayment,
    totalOverpaymentAmount,
    possibleTaxDeduction,
    savingsDueMotherCapital,
    recommendedIncome,
    mortgagePaymentSchedule,
  };
};

module.exports = {
  calculateMortgage,
};
