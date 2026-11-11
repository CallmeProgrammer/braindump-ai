import { useState } from "react";
import type { ReactNode } from "react";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  ListTodo,
  Sparkles,
  X,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import NewTaskModal from "../components/dashboard/NewTaskModal";

import {
  useTasks,
  type Priority,
} from "../context/TaskContext";

function DashboardPage() {
  /* =========================
     STATE
  ========================= */

  const [
    isTaskModalOpen,
    setIsTaskModalOpen,
  ] = useState(false);

  const [
    isPlanModalOpen,
    setIsPlanModalOpen,
  ] = useState(false);

  /* =========================
     TASK CONTEXT
  ========================= */

  const {
    tasks,
    addTask,
    toggleTask,
  } = useTasks();

  /* =========================
     TASK COUNTS
  ========================= */

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) => !task.completed
    ).length;

  const productivity =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            tasks.length) *
            100
        );

  /* =========================
     PRIORITY ORDER
  ========================= */

  const priorityOrder: Record<
    Priority,
    number
  > = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  /* =========================
     ACTIVE TASKS

     Completed tasks are removed
     from the Dashboard list.

     Active tasks are sorted:

     High
     Medium
     Low

     Then by due date.
  ========================= */

  const activeTasks = [...tasks]
    .filter(
      (task) => !task.completed
    )
    .sort((a, b) => {
      /* Priority first */

      const priorityDifference =
        priorityOrder[a.priority] -
        priorityOrder[b.priority];

      if (
        priorityDifference !== 0
      ) {
        return priorityDifference;
      }

      /* Tasks without dates go bottom */

      if (
        !a.dueDate &&
        !b.dueDate
      ) {
        return 0;
      }

      if (!a.dueDate) {
        return 1;
      }

      if (!b.dueDate) {
        return -1;
      }

      /* Earlier due date first */

      return (
        new Date(
          a.dueDate
        ).getTime() -
        new Date(
          b.dueDate
        ).getTime()
      );
    });

  /* =========================
     PLAN MY DAY
  ========================= */

  const dayPlan = [
    ...activeTasks,
  ];

  /* =========================
     GENERATE TIME
  ========================= */

  function getPlanTime(
    index: number
  ) {
    const startHour = 9;

    const minutes =
      index * 90;

    const hour =
      startHour +
      Math.floor(
        minutes / 60
      );

    const minute =
      minutes % 60;

    if (hour >= 24) {
      return "Later";
    }

    return `${String(
      hour
    ).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="flex min-h-screen bg-[#f6f6fb] transition-colors dark:bg-zinc-950">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar />

      {/* =========================
          MAIN
      ========================= */}

      <main className="min-w-0 flex-1">

        {/* HEADER */}

        <Header
          onNewTask={() =>
            setIsTaskModalOpen(true)
          }
        />

        {/* CONTENT */}

        <div className="mx-auto max-w-7xl p-6 lg:p-10">

          {/* =========================
              HERO
          ========================= */}

          <section className="mb-10">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

              {/* GREETING */}

              <div>

                <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                  TODAY
                </p>

                <h2 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                  Good morning, Hrithik 👋
                </h2>

                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  You have{" "}
                  {inProgressTasks}{" "}
                  tasks left to focus on.
                </p>

              </div>

              {/* PLAN MY DAY */}

              <button
                type="button"
                onClick={() =>
                  setIsPlanModalOpen(
                    true
                  )
                }
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98]"
              >
                <Sparkles
                  size={18}
                />

                Plan my day
              </button>

            </div>

          </section>

          {/* =========================
              STATISTICS
          ========================= */}

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={
                <ListTodo
                  size={21}
                />
              }
              title="Total Tasks"
              value={tasks.length.toString()}
              description="Across all projects"
            />

            <StatCard
              icon={
                <Clock
                  size={21}
                />
              }
              title="In Progress"
              value={inProgressTasks.toString()}
              description="Keep going!"
            />

            <StatCard
              icon={
                <CheckCircle2
                  size={21}
                />
              }
              title="Completed"
              value={completedTasks.toString()}
              description="Tasks completed"
            />

            <StatCard
              icon={
                <Sparkles
                  size={21}
                />
              }
              title="Productivity"
              value={`${productivity}%`}
              description="Based on completed tasks"
            />

          </section>

          {/* =========================
              LOWER CONTENT
          ========================= */}

          <section className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_1fr]">

            {/* =========================
                TODAY'S TASKS
            ========================= */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">

              {/* HEADER */}

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Today's Tasks
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Focus on what matters most.
                  </p>

                </div>

                <a
                  href="/tasks"
                  className="text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  View all
                </a>

              </div>

              {/* TASK LIST */}

              <div className="mt-6 space-y-3">

                {activeTasks.length ===
                0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center dark:border-zinc-700">

                    <CheckCircle2
                      size={32}
                      className="mx-auto text-violet-400"
                    />

                    <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      You're all caught up!
                    </p>

                    <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                      No active tasks remaining.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setIsTaskModalOpen(
                          true
                        )
                      }
                      className="mt-4 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
                    >
                      Create a new task
                    </button>

                  </div>
                ) : (
                  activeTasks
                    .slice(0, 6)
                    .map(
                      (task) => (
                        <TaskItem
                          key={
                            task._id
                          }
                          id={
                            task._id
                          }
                          title={
                            task.title
                          }
                          category={
                            task.category
                          }
                          time={
                            task.dueDate ||
                            "No due date"
                          }
                          priority={
                            task.priority
                          }
                          completed={
                            task.completed
                          }
                          onToggle={
                            toggleTask
                          }
                        />
                      )
                    )
                )}

              </div>

              {/* MORE TASKS */}

              {activeTasks.length >
                6 && (
                <div className="mt-4 text-center">

                  <a
                    href="/tasks"
                    className="text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
                  >
                    View{" "}
                    {activeTasks.length -
                      6}{" "}
                    more tasks
                  </a>

                </div>
              )}

            </div>

            {/* =========================
                AI INSIGHT
            ========================= */}

            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white shadow-lg">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Sparkles
                  size={22}
                />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                AI Insight
              </h3>

              <p className="mt-3 leading-7 text-violet-100">
                You have completed{" "}
                {completedTasks}{" "}
                out of{" "}
                {tasks.length}{" "}
                tasks.
              </p>

              <p className="mt-4 text-sm text-violet-200">
                {inProgressTasks >
                0
                  ? "Focus on your highest-priority task next."
                  : "Amazing! You completed everything."}
              </p>

              <a
                href="/brain-dump"
                className="mt-8 flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                Ask AI Assistant

                <ArrowRight
                  size={17}
                />
              </a>

            </div>

          </section>

        </div>

      </main>

      {/* =========================
          NEW TASK MODAL
      ========================= */}

      <NewTaskModal
        isOpen={
          isTaskModalOpen
        }
        onClose={() =>
          setIsTaskModalOpen(
            false
          )
        }
        onCreateTask={addTask}
      />

      {/* =========================
          PLAN MY DAY MODAL
      ========================= */}

      {isPlanModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsPlanModalOpen(
                false
              );
            }
          }}
        >

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                  <Sparkles
                    size={22}
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Your plan for today
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Prioritized from your active tasks.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsPlanModalOpen(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-label="Close plan"
              >
                <X
                  size={20}
                />
              </button>

            </div>

            {/* PLAN CONTENT */}

            <div className="max-h-[60vh] space-y-3 overflow-y-auto p-6">

              {dayPlan.length ===
              0 ? (
                <div className="py-10 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                    <CheckCircle2
                      size={30}
                    />
                  </div>

                  <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
                    You're all caught up!
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    There are no active tasks to plan today.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPlanModalOpen(
                        false
                      );

                      setIsTaskModalOpen(
                        true
                      );
                    }}
                    className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    Create a task
                  </button>

                </div>
              ) : (
                dayPlan.map(
                  (
                    task,
                    index
                  ) => (
                    <div
                      key={
                        task._id
                      }
                      className="flex gap-4 rounded-xl border border-zinc-200 p-4 transition hover:border-violet-200 hover:bg-violet-50/30 dark:border-zinc-700 dark:hover:border-violet-700 dark:hover:bg-violet-950/20"
                    >

                      {/* TIME */}

                      <div className="w-14 shrink-0 pt-1 text-sm font-bold text-violet-600 dark:text-violet-400">
                        {getPlanTime(
                          index
                        )}
                      </div>

                      {/* TASK */}

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {
                            task.title
                          }
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">

                          <span>
                            {
                              task.category
                            }
                          </span>

                          <span>
                            •
                          </span>

                          <span
                            className={
                              task.priority ===
                              "High"
                                ? "font-semibold text-red-500"
                                : task.priority ===
                                    "Medium"
                                  ? "font-semibold text-amber-500"
                                  : "font-semibold text-green-500"
                            }
                          >
                            {
                              task.priority
                            }
                          </span>

                          <span>
                            •
                          </span>

                          <span>
                            {
                              task.dueDate ||
                              "No due date"
                            }
                          </span>

                        </div>

                      </div>

                    </div>
                  )
                )
              )}

            </div>

            {/* MODAL FOOTER */}

            {dayPlan.length >
              0 && (
              <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">

                <div className="mb-3 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                  Tasks are arranged by priority and due date. The schedule will become smarter once the AI planner is connected.
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsPlanModalOpen(
                      false
                    )
                  }
                  className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  Close
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================
   STAT CARD
========================= */

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
};

function StatCard({
  icon,
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
        {icon}
      </div>

      <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
        {title}
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
   TASK ITEM
========================= */

type TaskItemProps = {
  id: string;
  title: string;
  category: string;
  time: string;
  priority: Priority;
  completed: boolean;
  onToggle: (
    id: string
  ) => Promise<void>;
};

function TaskItem({
  id,
  title,
  category,
  time,
  priority,
  completed,
  onToggle,
}: TaskItemProps) {
  const priorityStyles: Record<
    Priority,
    string
  > = {
    High:
      "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",

    Medium:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",

    Low:
      "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition ${
        completed
          ? "border-zinc-100 bg-zinc-50 opacity-70 dark:border-zinc-800 dark:bg-zinc-800"
          : "border-zinc-100 hover:border-violet-200 dark:border-zinc-800 dark:hover:border-violet-700"
      }`}
    >

      {/* CHECK BUTTON */}

      <button
        type="button"
        onClick={() =>
          onToggle(id)
        }
        aria-label={
          completed
            ? "Mark task as active"
            : "Complete task"
        }
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          completed
            ? "border-violet-600 bg-violet-600 text-white"
            : "border-zinc-300 hover:border-violet-500 dark:border-zinc-600"
        }`}
      >
        {completed && (
          <Check size={13} />
        )}
      </button>

      {/* TASK */}

      <div className="min-w-0 flex-1">

        <h4
          className={`truncate font-semibold ${
            completed
              ? "text-zinc-400 line-through"
              : "text-zinc-800 dark:text-zinc-100"
          }`}
        >
          {title}
        </h4>

        <div className="mt-1 flex gap-2 text-xs text-zinc-400 dark:text-zinc-500">

          <span>
            {category}
          </span>

          <span>
            •
          </span>

          <span>
            {time}
          </span>

        </div>

      </div>

      {/* PRIORITY */}

      <span
        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
          priorityStyles[
            priority
          ]
        }`}
      >
        {priority}
      </span>

    </div>
  );
}

export default DashboardPage;