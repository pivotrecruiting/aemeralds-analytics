import { registrationValidators } from "@/validation/registration-form-validators";
import type { FormDataT } from "@/types/registration-form";

describe("registrationValidators", () => {
  test("gender: valid values return undefined, invalid returns messages", () => {
    expect(
      registrationValidators.gender?.(null, {} as FormDataT)
    ).toBeUndefined();
    expect(
      registrationValidators.gender?.("male", {} as FormDataT)
    ).toBeUndefined();

    const invalid = registrationValidators.gender?.(
      "invalid" as unknown as string,
      {} as FormDataT
    );
    expect(Array.isArray(invalid)).toBe(true);
    expect((invalid as unknown[]).length).toBeGreaterThan(0);
  });

  test("email: valid returns undefined, invalid returns message array", () => {
    expect(
      registrationValidators.email?.("user@example.com", {} as FormDataT)
    ).toBeUndefined();
    const invalid = registrationValidators.email?.(
      "not-an-email",
      {} as FormDataT
    );
    expect(Array.isArray(invalid)).toBe(true);
    expect((invalid as unknown[]).length).toBeGreaterThan(0);
  });

  test("password: returns checklist with proper isValidated flags", () => {
    const weak = registrationValidators.password?.("abc", {} as FormDataT);
    expect(Array.isArray(weak)).toBe(true);
    // At least one rule should fail
    const weakList = weak as { message: string; isValidated: boolean }[];
    expect(weakList.some((e) => e.isValidated === false)).toBe(true);

    const strong = registrationValidators.password?.(
      "Abcdef12",
      {} as FormDataT
    );
    const strongList = strong as { message: string; isValidated: boolean }[];
    expect(strongList.every((e) => e.isValidated === true)).toBe(true);
  });

  test("confirm_password: mismatch returns string, match undefined", () => {
    const values = { password: "Abcdef12" } as unknown as FormDataT;
    const mismatch = registrationValidators.confirm_password?.(
      "Abcdef13",
      values
    );
    expect(typeof mismatch === "string").toBe(true);

    const match = registrationValidators.confirm_password?.("Abcdef12", values);
    expect(match).toBeUndefined();
  });

  test("terms: must be accepted", () => {
    const agb = registrationValidators.terms_agb?.(false, {} as FormDataT);
    expect(typeof agb === "string").toBe(true);
    const agbOk = registrationValidators.terms_agb?.(true, {} as FormDataT);
    expect(agbOk).toBeUndefined();
  });
});
