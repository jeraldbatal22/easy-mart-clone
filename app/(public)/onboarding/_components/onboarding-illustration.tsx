import Image from "next/image";
import { OnboardingStep } from "./types";

interface OnboardingIllustrationProps {
  step: OnboardingStep;
  imagePath?: string;
}

export const OnboardingIllustration = ({ step, imagePath }: OnboardingIllustrationProps) => {
  // if (step === "loading") {
  //   return (
  //     <div className="relative h-[500px] w-full flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <span className="text-4xl" role="img" aria-label="Shopping cart">
  //             🛒
  //           </span>
  //         </div>
  //         <p className="text-gray-600">Setting up your personalized experience...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!imagePath) {
    return null;
  }

  return (
    <div className="relative h-[500px] w-full">
      <Image
        alt="Onboarding illustration"
        src={imagePath}
        fill
        className="object-contain"
        priority={step === "q1"}
      />
    </div>
  );
};
