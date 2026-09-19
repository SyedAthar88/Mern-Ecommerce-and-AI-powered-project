import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Spinner } from "../../components/ui/Spinner.jsx";

export default function Landing() {
  const { user } = useAuth();
  const [demoEmail, setDemoEmail] = useState("");
  const [demoPass, setDemoPass] = useState("");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ============ WELCOME ============ */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
          Welcome to <span className="text-primary-600">MERNS</span>hop 🛍️
        </h1>
        <p className="text-lg text-neutral-600">
          {user
            ? `Logged in as ${user.email} (${user.role})`
            : "Your future home for AI-powered shopping."}
        </p>
      </div>

      {/* ============ COMPONENT SHOWCASE ============ */}
      <Card
        title="Component Showcase"
        subtitle="Sub-step 2 — all UI primitives"
        padding="lg"
        className="mb-8"
      >
        {/* ---- Buttons ---- */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">
            Buttons
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* ---- Inputs ---- */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">
            Inputs
          </h3>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={demoPass}
              onChange={(e) => setDemoPass(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="With error"
              value="invalid-email"
              onChange={() => {}}
              error="Please provide a valid email"
            />
          </div>
        </section>

        {/* ---- Spinners ---- */}
        <section>
          <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">
            Spinners
          </h3>
          <div className="flex items-center gap-4">
            <Spinner size="sm" className="text-primary-600" />
            <Spinner size="md" className="text-primary-600" />
            <Spinner size="lg" className="text-primary-600" />
          </div>
        </section>
      </Card>

      {/* ============ FULL WIDTH BUTTON ============ */}
      <Card padding="lg">
        <Button fullWidth size="lg">Full Width Button</Button>
      </Card>
    </div>
  );
}