import { FadeInContainer, FadeInItem } from "@/components/animations/fade-in";
import Account from "./components/account";

export default function Page() {
  return (
    <div>
      <div className="mt-4">
        {/* Account */}
        <FadeInContainer>
          <FadeInItem>
            <Account />
          </FadeInItem>
        </FadeInContainer>
      </div>
    </div>
  );
}
