import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TabBar, Toasts } from "@/components/Chrome";
import { hasSeenSplash } from "@/lib/intro";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const TAB_PATHS = ["/home", "/bookings", "/location", "/profile"];

function AppLayout() {
  const { user, guest, onboarded } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!hasSeenSplash()) return;
    if (user?.accountStatus === "revoked") {
      navigate({ to: "/revoked" });
      return;
    }
    if (user?.accountStatus === "pending") {
      navigate({ to: "/pending" });
      return;
    }
    if (!onboarded) navigate({ to: "/onboarding" });
    else if (!user && !guest) navigate({ to: "/login" });
  }, [onboarded, user, guest, navigate]);

  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const showTabs = TAB_PATHS.includes(pathname);

  return (
    <div className="theme-dark mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-[#001e16] text-[#f4f7f5]">
      {offline && (
        <p className="bg-[#5fbb3f] px-4 py-2 text-center text-sm font-semibold text-[#001e16]" role="status">
          You are offline. Drafts stay on this device and submit when the connection returns. Call SIH&S if this is urgent.
        </p>
      )}
      <div className="flex-1">
        <Outlet />
      </div>
      {showTabs && <TabBar />}
      <Toasts />
    </div>
  );
}
