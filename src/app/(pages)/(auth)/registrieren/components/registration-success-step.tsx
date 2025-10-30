import { FadeInContainer, FadeInItem } from "@/components/animations/fade-in";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function RegistrationSuccessStep() {
  return (
    <FadeInContainer>
      <FadeInItem>
        <div className="flex flex-col">
          <div className="flex items-center justify-center pb-4">
            <div className="w-[250px] flex-col items-end lg:flex">
              <Image src="/success-page.png" alt="" width={431} height={431} />
            </div>
          </div>
          <div className="flex flex-col items-start justify-center">
            <div className="subheader">Vielen Dank!</div>

            <h2 className="header">
              Deine Registrierung wurde erfolgreich abgeschlossen.
            </h2>
            <div className="my-4 max-w-md">
              Du kannst dich jetzt mit deinen Zugangsdaten anmelden und direkt
              loslegen.
            </div>
          </div>
        </div>
        <Link className="flex items-center justify-end" href="/dashboard">
          <Button className="mt-2">
            Jetzt anmelden
            <ArrowRight />
          </Button>
        </Link>
      </FadeInItem>
    </FadeInContainer>
  );
}
