import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputWithLabel } from "@/components/ui/input";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { emailSchema } from "@/schemas/zod/email-schema";
import { ZodError } from "zod";

function LoginFormStub() {
  const { getFieldProps } = useValidatedForm({
    initialValues: { email: "" },
    validators: {
      email: (value) => {
        try {
          emailSchema.parse(value);
          return undefined;
        } catch (e) {
          if (e instanceof ZodError) {
            const message = e.errors?.[0]?.message;
            return [
              typeof message === "string"
                ? message
                : "Ungültige E-Mail-Adresse",
            ];
          }
          return ["Ungültige E-Mail-Adresse"];
        }
      },
    },
  });

  return (
    <div>
      <InputWithLabel
        label="E-Mail-Adresse"
        aria-label="E-Mail-Adresse"
        {...getFieldProps("email", { type: "email" })}
      />
    </div>
  );
}

describe("Login-like Validierung", () => {
  test("zeigt Email-Validierungsfehler via ValidationPopover an", () => {
    render(<LoginFormStub />);
    const emailInput = screen.getByLabelText("E-Mail-Adresse");
    fireEvent.change(emailInput, { target: { value: "invalid" } });
    fireEvent.focus(emailInput);
    expect(screen.getByText(/Ungültige E-Mail-Adresse/i)).toBeInTheDocument();
  });
});
