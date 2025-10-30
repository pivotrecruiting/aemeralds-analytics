import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClientAccountForm from "./client-account-form";

// Mock the server actions
jest.mock("@/services/server/actions/update-user-auth-email", () => ({
  updateUserAuthEmail: jest.fn(),
}));

jest.mock("@/services/server/actions/update-user-profile", () => ({
  updateUserProfile: jest.fn(),
}));

describe("ClientAccountForm", () => {
  const mockInitialData = {
    firstName: "Max",
    lastName: "Mustermann",
    email: "max.mustermann@example.com",
    gender: "male" as const,
    role: "student" as const,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should display user data correctly in input fields", () => {
    render(<ClientAccountForm initialData={mockInitialData} />);

    // Check if all input fields display the correct initial values
    expect(screen.getByDisplayValue("Max")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Mustermann")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("max.mustermann@example.com")
    ).toBeInTheDocument();
  });

  it("should display form labels correctly", () => {
    render(<ClientAccountForm initialData={mockInitialData} />);

    // Check if all labels are present
    expect(screen.getByText("Geschlecht")).toBeInTheDocument();
    expect(screen.getByText("Vorname")).toBeInTheDocument();
    expect(screen.getByText("Nachname")).toBeInTheDocument();
    expect(screen.getByText("E-Mail Adresse")).toBeInTheDocument();
  });

  it("should have correct input field names", () => {
    render(<ClientAccountForm initialData={mockInitialData} />);

    // Check if input fields have correct name attributes
    const firstNameInput = screen.getByDisplayValue("Max");
    const lastNameInput = screen.getByDisplayValue("Mustermann");
    const emailInput = screen.getByDisplayValue("max.mustermann@example.com");

    expect(firstNameInput).toHaveAttribute("name", "firstName");
    expect(lastNameInput).toHaveAttribute("name", "lastName");
    expect(emailInput).toHaveAttribute("name", "email");
  });

  it("should render submit button with correct initial state", () => {
    render(<ClientAccountForm initialData={mockInitialData} />);

    const submitButton = screen.getByRole("button", { name: "Speichern" });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled(); // Should be disabled initially since no changes
  });
});
