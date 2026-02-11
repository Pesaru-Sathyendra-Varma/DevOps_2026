import { calculateIncome, calculateExpenses } from "../../services/finance.js";

describe("finance calculations", () => {
  const transactions = [
    { type: "income", amount: 1000 },
    { type: "income", amount: 500 },
    { type: "expense", amount: 120 },
    { type: "expense", amount: 80 }
  ];

  it("calculates income correctly", () => {
    expect(calculateIncome(transactions)).toBe(1500);
  });

  it("calculates expenses correctly", () => {
    expect(calculateExpenses(transactions)).toBe(200);
  });
});
