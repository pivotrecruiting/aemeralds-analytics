import { FadeInContainer, FadeInItem } from "@/components/animations/fade-in";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      <div className="min-h-screen w-full overflow-auto bg-[#1F1D2B]/80 px-4 backdrop-blur-2xl sm:h-auto sm:max-h-[800px] sm:min-h-auto sm:max-w-[500px] sm:rounded-xl sm:px-8">
        <FadeInContainer>
          <div className="flex h-full w-full flex-col items-start justify-center py-4 pb-12 sm:items-start sm:justify-start">
            <FadeInItem>
              <Image
                // TODO: add logo path
                src="/company-logo.png"
                alt="Company Logo"
                width={339}
                height={142}
                priority
                className="w-[180px] pb-2"
              />
            </FadeInItem>
            <FadeInItem className="w-full">{children}</FadeInItem>
          </div>
        </FadeInContainer>
      </div>
    </div>
  );
}
