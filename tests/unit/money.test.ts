import { describe, expect, it } from "vitest";
import { formatMoney } from "../../src/wix/money";

describe("formatMoney", () => {
  it("returns empty string for null or missing money", () => {
    expect(formatMoney(null, "EUR")).toBe("");
    expect(formatMoney(undefined, "EUR")).toBe("");
    expect(formatMoney({}, "EUR")).toBe("");
  });

  it("returns empty string for null, empty or whitespace amounts", () => {
    expect(formatMoney({ amount: null }, "EUR")).toBe("");
    expect(formatMoney({ amount: "" }, "EUR")).toBe("");
  });

  it("formats the amount when there is no convertedAmount", () => {
    expect(formatMoney({ amount: "12.5" }, "EUR")).toContain("12");
  });

  it("prefers convertedAmount over amount", () => {
    expect(formatMoney({ amount: "1", convertedAmount: "9" }, "EUR")).toContain("9");
  });

  it("falls back to USD when no currency is given", () => {
    expect(formatMoney({ amount: "3" }, null)).toContain("3");
  });

  it("falls back to a plain concatenation for an invalid currency", () => {
    expect(formatMoney({ amount: "3" }, "NOPE")).toBe("3 NOPE");
  });
});
