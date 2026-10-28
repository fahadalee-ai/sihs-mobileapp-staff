import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TabBar, Toasts } from "@/components/Chrome";
import { hasSeenSplash } from "@/lib/intro";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const TAB_PATHS = ["/home", "/jobs", "/log", "/report", "/profile"];

function AppLayout() {
  const { user } = useStaff();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!hasSeenSplash()) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.status === "pending") {
      navigate({ to: "/pending" });
      return;
    }
    if (user.status === "more-info") {
      navigate({ to: "/more-info" });
      return;
    }
    if (user.status === "rejected") {
      navigate({ to: "/rejected" });
      return;
    }
    if (user.status === "suspended") {
      navigate({ to: "/revoked" });
      return;
    }
    if (!user.setupDone) navigate({ to: "/setup" });
  }, [user, navigate]);

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

  const showTabs = TAB_PATHS.includes(pathname) || pathname === "/notifications" || pathname.startsWith("/jobs/") || pathname.startsWith("/field/") || pathname.startsWith("/service/") || pathname.startsWith("/pim/");

  return (
    <div className="theme-dark mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-[#001e16] text-[#f4f7f5]">
      {offline && (
        <p className="bg-[#5fbb3f] px-4 py-2 text-center text-sm font-semibold text-[#001e16]" role="status">
          You are offline. Items stay saved locally until they are received. Call SIH&S if this is urgent.
        </p>
      )}
      {user?.status === "approved" && (
        <p className="sr-only">Signed in as {user.fullName}. Approved roles come from SIH&S.</p>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
      {showTabs && <TabBar />}
      <Toasts />
    </div>
  );
}
