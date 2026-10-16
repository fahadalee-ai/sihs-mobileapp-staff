import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input } from "@/components/kit";
import { formatPhone } from "@/lib/content";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/profile-edit")({
  head: () => ({ meta: [{ title: "SIH&S — Edit profile" }] }),
  component: EditProfile,
});

function EditProfile() {
  const { user, updateUser } = useApp();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div>
        <ScreenHeader title="Edit Profile" />
        <p className="px-4 text-sm">Sign in to edit your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Edit Profile" backTo="/profile" />
      <form
        className="px-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!fullName.trim() || !email.includes("@") || phone.replace(/\D/g, "").length !== 10) {
            setError("Enter your name, a valid email, and a 10-digit phone number.");
            return;
          }
          updateUser({ fullName: fullName.trim(), email: email.trim(), phone, address: address.trim() });
          setError("");
        }}
      >
        <Field label="Full Name" error={error || undefined}>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Phone Number">
          <Input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
        </Field>
        <Field label="Address">
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address in Delaware" />
        </Field>
        <Button type="submit" full>
          Save
        </Button>
      </form>
    </div>
  );
}
