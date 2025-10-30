import { renderHook, act } from "@testing-library/react";
import { useValidatedForm } from "@/hooks/use-validated-form";

type ValuesT = {
  email: string;
  agree: boolean;
};

describe("useValidatedForm", () => {
  test("sets values and validates fields, error merges with serverErrors", () => {
    const { result } = renderHook(() =>
      useValidatedForm<ValuesT>({
        initialValues: { email: "", agree: false },
        validators: {
          email: (value) =>
            typeof value === "string" && value.includes("@")
              ? undefined
              : ["Invalid email"],
          agree: (value) => (value ? undefined : "Must agree"),
        },
        serverErrors: { email: "Server error" },
      })
    );

    // Initially has server error for email
    expect(result.current.getFieldProps("email").error).toEqual([
      "Server error",
    ]);

    // Change email to valid
    act(() => {
      result.current.getFieldProps("email").onChange({
        // @ts-expect-error testing event shape
        target: { value: "user@example.com" },
      });
    });

    // Now only server error remains merged (no client error)
    expect(result.current.getFieldProps("email").error).toEqual([
      "Server error",
    ]);

    // Set agree to true
    act(() => {
      result.current.getFieldProps("agree", { type: "checkbox" }).onChange({
        // @ts-expect-error testing event shape
        target: { checked: true },
      });
    });

    expect(result.current.values.agree).toBe(true);

    // Update server errors
    act(() => {
      result.current.setServerErrors({ email: undefined });
    });
    expect(result.current.getFieldProps("email").error).toBeUndefined();
  });
});
