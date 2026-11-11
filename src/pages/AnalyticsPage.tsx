import {
  BarChart3,
  CheckCircle2,
  Circle,
  ListTodo,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

import { useTasks } from "../context/TaskContext";

function AnalyticsPage() {
  const { tasks } = useTasks();

  /* =========================
     BASIC STATS
  ========================= */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const activeTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  /* =========================
     PRIORITY
  ========================= */

  const highPriority = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const mediumPriority = tasks.filter(
    (task) => task.priority === "Medium"
  ).length;

  const lowPriority = tasks.filter(
    (task) => task.priority === "Low"
  ).length;

  const maxPriority = Math.max(
    highPriority,
    mediumPriority,
    lowPriority,
    1
  );

  /* =========================
     CATEGORY
  ========================= */

  const categoryData = Object.entries(
    tasks.reduce<Record<string, number>>(
      (accumulator, task) => {
        accumulator[task.category] =
          (accumulator[task.category] || 0) + 1;

        return accumulator;
      },
      {}
    )
  );

  return (
    <div className="flex min-h-screen bg-[#f6f6fb] transition-colors dark:bg-zinc-950">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header onNewTask={() => {}} />

        <div className="mx-auto max-w-7xl p-6 lg:p-10">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <div>
            <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
              PRODUCTIVITY INSIGHTS
            </p>

            <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
              Analytics
            </h1>

            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Track your progress and understand
              how you work.
            </p>
          </div>

          {/* =========================
              MAIN STATS
          ========================= */}

          <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <AnalyticsStat
              icon={<ListTodo size={21} />}
              label="Total Tasks"
              value={totalTasks}
              description="All your tasks"
            />

            <AnalyticsStat
              icon={<Circle size={21} />}
              label="Active Tasks"
              value={activeTasks}
              description="Still in progress"
            />

            <AnalyticsStat
              icon={<CheckCircle2 size={21} />}
              label="Completed"
              value={completedTasks}
              description="Tasks finished"
            />

            <AnalyticsStat
              icon={<TrendingUp size={21} />}
              label="Completion Rate"
              value={`${completionRate}%`}
              description="Overall productivity"
            />

          </section>

          {/* =========================
              PROGRESS + SCORE
          ========================= */}

          <section className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">

            {/* OVERALL PROGRESS */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">

              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Overall Progress
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Your task completion progress.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                  <BarChart3 size={21} />
                </div>

              </div>

              <div className="mt-10 flex flex-col items-center justify-center">

                {/* CIRCLE */}

                <div className="relative flex h-48 w-48 items-center justify-center rounded-full">

                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(
                        #7c3aed ${completionRate * 3.6}deg,
                        #27272a 0deg
                      )`,
                    }}
                  />

                  <div className="absolute h-36 w-36 rounded-full bg-white dark:bg-zinc-900" />

                  <div className="relative text-center">

                    <p className="text-4xl font-bold text-zinc-900 dark:text-white">
                      {completionRate}%
                    </p>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Completed
                    </p>

                  </div>

                </div>

                {/* SMALL STATS */}

                <div className="mt-8 grid w-full grid-cols-2 gap-4">

                  <div className="rounded-xl bg-violet-50 p-4 dark:bg-violet-950/40">

                    <p className="text-sm text-violet-600 dark:text-violet-400">
                      Completed
                    </p>

                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      {completedTasks}
                    </p>

                  </div>

                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">

                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Remaining
                    </p>

                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      {activeTasks}
                    </p>

                  </div>

                </div>

              </div>
            </div>

            {/* PRODUCTIVITY SCORE */}

            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white shadow-lg">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <TrendingUp size={22} />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                Productivity Score
              </h2>

              <p className="mt-3 text-violet-100">
                Your score is based on the percentage
                of tasks you've completed.
              </p>

              <div className="mt-10">

                <p className="text-6xl font-bold">
                  {completionRate}
                </p>

                <p className="mt-1 text-violet-200">
                  out of 100
                </p>

              </div>

              <div className="mt-10 rounded-xl bg-white/10 p-4">

                <p className="text-sm font-medium">
                  {completionRate >= 80
                    ? "Excellent work! Keep it going."
                    : completionRate >= 50
                      ? "You're making solid progress."
                      : "Complete a few tasks to improve your score."}
                </p>

              </div>

            </div>

          </section>

          {/* =========================
              PRIORITY BREAKDOWN
          ========================= */}

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">

            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Priority Breakdown
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                See how your tasks are distributed.
              </p>
            </div>

            <div className="mt-8 space-y-6">

              <PriorityBar
                label="High Priority"
                count={highPriority}
                percentage={
                  (highPriority / maxPriority) *
                  100
                }
                color="bg-red-500"
              />

              <PriorityBar
                label="Medium Priority"
                count={mediumPriority}
                percentage={
                  (mediumPriority / maxPriority) *
                  100
                }
                color="bg-amber-500"
              />

              <PriorityBar
                label="Low Priority"
                count={lowPriority}
                percentage={
                  (lowPriority / maxPriority) *
                  100
                }
                color="bg-green-500"
              />

            </div>

          </section>

          {/* =========================
              CATEGORIES
          ========================= */}

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">

            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Tasks by Category
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Where you're spending your time.
              </p>
            </div>

            {categoryData.length === 0 ? (
              <div className="py-12 text-center">

                <ListTodo
                  size={36}
                  className="mx-auto text-zinc-300 dark:text-zinc-600"
                />

                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                  Create tasks to see your analytics.
                </p>

              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {categoryData.map(
                  ([category, count]) => (
                    <div
                      key={category}
                      className="rounded-xl bg-zinc-50 p-5 transition-colors dark:bg-zinc-800"
                    >

                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {category}
                      </p>

                      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                        {count}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                        {count === 1
                          ? "task"
                          : "tasks"}
                      </p>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}

/* =========================
   ANALYTICS STAT
========================= */

type AnalyticsStatProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  description: string;
};

function AnalyticsStat({
  icon,
  label,
  value,
  description,
}: AnalyticsStatProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
        {icon}
      </div>

      <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <h3 className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
        {description}
      </p>

    </div>
  );
}

/* =========================
   PRIORITY BAR
========================= */

type PriorityBarProps = {
  label: string;
  count: number;
  percentage: number;
  color: string;
};

function PriorityBar({
  label,
  count,
  percentage,
  color,
}: PriorityBarProps) {
  return (
    <div>

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </p>

        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
          {count}
        </p>

      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

export default AnalyticsPage;