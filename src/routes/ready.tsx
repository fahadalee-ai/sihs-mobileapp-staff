import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/kit";

export const Route = createFileRoute("/ready")({
  head: () => ({ meta: [{ title: "SIH&S — You're all set" }] }),
  component: Ready,
});

function Ready() {
  const navigate = useNavigate();
  return (
    <div className="theme-dark flex min-h-dvh flex-col items-center justify-center bg-brand px-6 text-center text-white">
      <BrandLogo size="md" />
      <h1 className="mt-6 text-3xl font-semibold">You&apos;re all set!</h1>
      <p className="mt-2 text-sm text-[#c5d4cc]">Your SIH&S account is ready.</p>
      <Button type="button" className="mt-8" onClick={() => navigate({ to: "/home" })}>
        Start Exploring
      </Button>
    </div>
  );
}
