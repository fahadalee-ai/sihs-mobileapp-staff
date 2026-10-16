import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CallHook } from "@/components/Chrome";
import { markSplashSeen } from "@/lib/intro";
import splashPhoto from "@/img/bg-onboard-tow.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIH&S" },
      {
        name: "description",
        content:
          "SIH&S — structured incident response, Delaware intrastate towing, collections, DNA services, PIM-VEE™, and notary.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const router = useRouter();

  const openOnboarding = () => {
    markSplashSeen();
    void router.navigate({ to: "/onboarding", replace: true });
  };

  useEffect(() => {
    const t = window.setTimeout(openOnboarding, 2800);
    return () => window.clearTimeout(t);
  }, [router]);

  return (
    <div className="theme-dark relative flex min-h-dvh flex-col overflow-hidden bg-brand text-white">
      <img src={splashPhoto} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#001e16]/80 via-[#001e16]/72 to-[#001e16]/92" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <BrandLogo size="lg" animate />
        <p className="mt-2 text-center font-serif text-lg italic text-[#f4f7f5]">Standing in the Gap</p>
        <button
          type="button"
          onClick={openOnboarding}
          className="mt-8 min-h-11 rounded-[12px] bg-[#5fbb3f] px-6 text-[17px] font-semibold text-[#001e16]"
        >
          Continue
        </button>
        <div className="mt-4">
          <CallHook dark />
        </div>
      </div>
    </div>
  );
}
