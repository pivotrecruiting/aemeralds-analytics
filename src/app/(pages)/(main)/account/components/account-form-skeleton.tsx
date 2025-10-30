import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input";

export default function AccountFormSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[160px_1fr_1fr] sm:grid-rows-2 sm:gap-5">
        <InputWithLabel
          className="animate-pulse"
          label="Geschlecht"
          name="gender"
          value=""
          disabled
        />
        <InputWithLabel
          className="animate-pulse"
          label="Vorname"
          name="firstName"
          value=""
          disabled
        />
        <InputWithLabel
          className="animate-pulse"
          label="Nachname"
          name="lastName"
          value=""
          disabled
        />
        <div className="col-span-3">
          <InputWithLabel
            className="animate-pulse"
            label="E-Mail Adresse"
            name="email"
            value=""
            disabled
          />
        </div>

        <div className="col-span-1 col-start-3 mt-6 flex justify-end">
          <Button className="flex-0" type="button" disabled={true}>
            Speichern
          </Button>
        </div>
      </div>
    </>
  );
}
