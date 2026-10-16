import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CallHook } from "@/components/Chrome";
import { Button, Field, Input } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "SIH&S — Sign in" }] }),
  component: Login,
});

function Login() {
  const { login, continueAsGuest } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gamil.com");
  const [password, setPassword] = useState("123456");
  const [show, setShow] = useState(false);

  return (
    <div className="theme-dark flex min-h-dvh flex-col bg-brand px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-white">
      <BrandLogo size="md" />
      <h1 className="mt-6 text-2xl font-semibold">Welcome Back</h1>
      <p className="mt-1 text-sm text-[#c5d4cc]">Sign in to access your services.</p>
      <form
        className="mt-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const result = login(email, password);
          if (!result.ok) continueAsGuest();
          navigate({ to: "/home" });
        }}
      >
        <Field label="Email">
          <Input
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="admin@gamil.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password">
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-20"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 min-h-11 -translate-y-1/2 px-2 text-xs font-semibold text-[#8fd86f]"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
        <Link to="/forgot" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#8fd86f]">
          Forgot Password?
        </Link>
        <Button type="submit" full className="mt-2">
          Login
        </Button>
        <Button
          type="button"
          variant="light"
          full
          className="mt-3"
          onClick={() => {
            continueAsGuest();
            navigate({ to: "/home" });
          }}
        >
          Continue as Guest
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-[#c5d4cc]">
        New to SIH&S?{" "}
        <Link to="/signup" className="font-semibold text-[#8fd86f] underline">
          Sign Up
        </Link>
      </p>
      <div className="mt-auto pt-6">
        <CallHook dark />
      </div>
    </div>
  );
}
