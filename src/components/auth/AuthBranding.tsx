import type { ReactNode } from "react";
import {
  Brain,
  Check,
  CalendarDays,
  BarChart3,
} from "lucide-react";

function AuthBranding() {
  return (
   <section className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-violet-100 via-violet-50 to-indigo-100 p-10 lg:p-16">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
          <Brain size={24} />
        </div>

        <span className="text-xl font-bold text-zinc-900">
          BrainDump AI
        </span>
      </div>

      {/* Main Content */}
      <div className="my-auto max-w-lg">
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-zinc-900 lg:text-6xl">
          Organize your{" "}
          <span className="text-violet-600">
            thoughts.
          </span>
        </h1>

        <p className="mt-6 max-w-md text-lg leading-8 text-zinc-600">
          Turn everything on your mind into organized tasks
          and build a smarter plan for your day.
        </p>

        {/* Features */}
        <div className="mt-12 space-y-7">
          <Feature
            icon={<Check size={20} />}
            title="AI-Powered Organization"
            description="Turn your thoughts into clear and actionable tasks."
          />

          <Feature
            icon={<CalendarDays size={20} />}
            title="Smart Daily Planning"
            description="Get a personalized plan based on your priorities."
          />

          <Feature
            icon={<BarChart3 size={20} />}
            title="Track Your Progress"
            description="Build better habits and see how far you've come."
          />
        </div>
      </div>

      {/* Decorative Cards */}
      <div className="absolute bottom-16 right-16 h-32 w-32 rotate-12 rounded-3xl bg-white/40 shadow-xl backdrop-blur-sm" />

      <div className="absolute bottom-24 right-24 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
        <Check className="text-violet-600" size={28} />
      </div>

      <div className="absolute bottom-12 left-12 text-5xl text-violet-300">
        ✦
      </div>
    </section>
  );
}

type FeatureProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function Feature({
  icon,
  title,
  description,
}: FeatureProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-zinc-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-zinc-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default AuthBranding;
