import { addTransaction } from "../../services/finance.js";

describe("addTransaction", () => {
  it("adds a new transaction to the list", () => {
    const existing = [
      { id: "tx-1", title: "Rent", amount: 400, type: "expense" }
    ];
    const next = addTransaction(existing, {
      title: "Salary",
      amount: 1200,
      type: "income",
      category: "Income",
      date: "2026-02-10"
    });

    expect(next).toHaveLength(2);
    expect(next[0].title).toBe("Salary");
  });
});
