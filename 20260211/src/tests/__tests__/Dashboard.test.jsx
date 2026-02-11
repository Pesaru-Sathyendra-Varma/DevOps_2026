import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../../pages/DashboardPage.jsx";

jest.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="spending-chart" />
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders dashboard sections", () => {
    render(<DashboardPage username="alex" />);

    expect(screen.getByText(/total balance/i)).toBeInTheDocument();
    expect(screen.getByText(/spending trends/i)).toBeInTheDocument();
    expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
    expect(screen.getByTestId("spending-chart")).toBeInTheDocument();
  });
});
