import { useState } from "react";
import type { ReactNode } from "react";

import {
  Brain,
  Sparkles,
  Send,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Check,
  CalendarDays,
  Tag,
  Flag,
  Plus,
  X,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

import { useTasks } from "../context/TaskContext";
import { useTaskModal } from "../context/TaskModalContext";

type Priority = "High" | "Medium" | "Low";

type GeneratedTask = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  dueDate: string;
  selected: boolean;
};

type AIResponse = {
  tasks: {
    title: string;
    description: string;
    category: string;
    priority: Priority;
    dueDate: string;
  }[];
};

const API_URL = "http://localhost:5000/api";

function BrainDumpPage() {
  const [brainDump, setBrainDump] = useState("");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [isAddingTasks, setIsAddingTasks] =
    useState(false);

  const [generatedTasks, setGeneratedTasks] =
    useState<GeneratedTask[]>([]);

  const [hasOrganized, setHasOrganized] =
    useState(false);

  const [error, setError] =
    useState("");

  const { addTask } = useTasks();

  const { openTaskModal } =
    useTaskModal();

  /* =========================
     ORGANIZE BRAIN DUMP WITH AI
  ========================= */

  async function handleOrganize() {
    const text = brainDump.trim();

    if (!text || isProcessing) {
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You must be logged in to use AI."
        );
      }

      const response = await fetch(
        `${API_URL}/ai/brain-dump`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text,
          }),
        }
      );

      let data: AIResponse | { message?: string };

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          "message" in data && data.message
            ? data.message
            : "Failed to organize your brain dump."
        );
      }

      if (
        !("tasks" in data) ||
        !Array.isArray(data.tasks)
      ) {
        throw new Error(
          "AI returned an invalid task response."
        );
      }

      const tasks: GeneratedTask[] =
        data.tasks.map(
          (task, index) => ({
            id: Date.now() + index,
            title: task.title,
            description:
              task.description || "",
            category:
              task.category || "Other",
            priority:
              task.priority || "Medium",
            dueDate:
              task.dueDate || "",
            selected: true,
          })
        );

      setGeneratedTasks(tasks);
      setHasOrganized(true);

      if (tasks.length === 0) {
        setError(
          "AI couldn't find any actionable tasks in your brain dump."
        );
      }
    } catch (err) {
      console.error(
        "Failed to organize brain dump:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while processing your brain dump."
      );

      setGeneratedTasks([]);
      setHasOrganized(false);
    } finally {
      setIsProcessing(false);
    }
  }

  /* =========================
     TOGGLE GENERATED TASK
  ========================= */

  function toggleGeneratedTask(
    id: number
  ) {
    setGeneratedTasks(
      (currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                selected:
                  !task.selected,
              }
            : task
        )
    );
  }

  /* =========================
     DELETE GENERATED TASK
  ========================= */

  function deleteGeneratedTask(
    id: number
  ) {
    setGeneratedTasks(
      (currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
    );
  }

  /* =========================
     ADD SELECTED TASKS
  ========================= */

  async function addSelectedTasks() {
    const selectedTasks =
      generatedTasks.filter(
        (task) => task.selected
      );

    if (
      selectedTasks.length === 0 ||
      isAddingTasks
    ) {
      return;
    }

    setError("");
    setIsAddingTasks(true);

    try {
      await Promise.all(
        selectedTasks.map((task) =>
          addTask({
            title: task.title,
            description:
              task.description || "",
            category: task.category,
            priority: task.priority,
            dueDate: task.dueDate,
          })
        )
      );

      setGeneratedTasks([]);
      setBrainDump("");
      setHasOrganized(false);
    } catch (err) {
      console.error(
        "Failed to add selected tasks:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to add selected tasks."
      );
    } finally {
      setIsAddingTasks(false);
    }
  }

  /* =========================
     CLEAR
  ========================= */

  function handleClear() {
    if (
      isProcessing ||
      isAddingTasks
    ) {
      return;
    }

    setBrainDump("");
    setGeneratedTasks([]);
    setHasOrganized(false);
    setError("");
  }

  const selectedCount =
    generatedTasks.filter(
      (task) => task.selected
    ).length;

  /* =========================
     UI
  ========================= */

  return (
    <div className="flex min-h-screen bg-[#f6f6fb] dark:bg-zinc-950">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header
          onNewTask={openTaskModal}
        />

        <div className="mx-auto max-w-7xl p-6 lg:p-10">

          {!hasOrganized ? (
            <>
              {/* =========================
                  HERO
              ========================= */}

              <section className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                  <Brain size={32} />
                </div>

                <p className="mt-6 text-sm font-semibold tracking-wide text-violet-600 dark:text-violet-400">
                  AI-POWERED ORGANIZATION
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                  Clear your mind.
                  <br />

                  <span className="text-violet-600 dark:text-violet-400">
                    Let AI organize it.
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  Write everything that's on
                  your mind. Tasks, ideas,
                  reminders, or random thoughts.
                  BrainDump AI will turn the chaos
                  into something organized.
                </p>

              </section>

              {/* =========================
                  INPUT
              ========================= */}

              <section className="mx-auto mt-12 max-w-4xl">

                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

                  {/* HEADER */}

                  <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                        <Sparkles size={20} />
                      </div>

                      <div>
                        <h2 className="font-semibold text-zinc-900 dark:text-white">
                          What's on your mind?
                        </h2>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Don't worry about
                          organizing it.
                        </p>
                      </div>

                    </div>

                    {brainDump && (
                      <button
                        type="button"
                        onClick={handleClear}
                        disabled={
                          isProcessing
                        }
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-white"
                      >
                        <RotateCcw
                          size={16}
                        />
                        Clear
                      </button>
                    )}

                  </div>

                  {/* TEXTAREA */}

                  <div className="p-6">

                    <textarea
                      value={brainDump}
                      onChange={(event) =>
                        setBrainDump(
                          event.target.value
                        )
                      }
                      disabled={
                        isProcessing
                      }
                      placeholder={`Example:

Tomorrow I need to finish my portfolio website.

Also remind me to buy groceries and call my friend.

I should probably start working on my Unity project this weekend.

Oh, and I need to reply to that important email.`}
                      className="min-h-[300px] w-full resize-none border-none bg-transparent text-base leading-8 text-zinc-800 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-70 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                    />

                  </div>

                  {/* ERROR */}

                  {error && (
                    <div className="mx-6 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {/* FOOTER */}

                  <div className="flex flex-col gap-4 border-t border-zinc-100 bg-zinc-50/70 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">

                      <Lightbulb
                        size={17}
                        className="text-amber-500"
                      />

                      <span>
                        Just write naturally.
                        AI handles the rest.
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleOrganize
                      }
                      disabled={
                        !brainDump.trim() ||
                        isProcessing
                      }
                      className="flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Sparkles
                            size={18}
                            className="animate-spin"
                          />

                          Thinking...
                        </>
                      ) : (
                        <>
                          <Send
                            size={18}
                          />

                          Organize with AI
                        </>
                      )}
                    </button>

                  </div>

                </div>

              </section>

              {/* =========================
                  HOW IT WORKS
              ========================= */}

              <section className="mt-16">

                <div className="text-center">

                  <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                    HOW IT WORKS
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                    From chaos to clarity
                  </h2>

                </div>

                <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">

                  <StepCard
                    number="01"
                    icon={
                      <Brain size={22} />
                    }
                    title="Brain Dump"
                    description="Write everything on your mind without worrying about structure."
                  />

                  <StepCard
                    number="02"
                    icon={
                      <Sparkles size={22} />
                    }
                    title="AI Organizes"
                    description="AI understands your thoughts and extracts actionable tasks."
                  />

                  <StepCard
                    number="03"
                    icon={
                      <CheckCircle2
                        size={22}
                      />
                    }
                    title="Get Things Done"
                    description="Review your tasks, set priorities, and start making progress."
                  />

                </div>

              </section>
            </>
          ) : (

            /* =========================
               RESULTS
            ========================= */

            <section className="mx-auto max-w-5xl">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                  <Sparkles size={30} />
                </div>

                <p className="mt-6 text-sm font-semibold tracking-wide text-violet-600 dark:text-violet-400">
                  AI ORGANIZATION COMPLETE
                </p>

                <h1 className="mt-3 text-4xl font-bold text-zinc-900 dark:text-white">
                  Your thoughts are now
                  <span className="block text-violet-600 dark:text-violet-400">
                    organized.
                  </span>
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
                  We found{" "}
                  {generatedTasks.length}{" "}
                  possible tasks. Review them
                  and choose what you want to
                  add.
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* GENERATED TASKS */}

              <div className="mt-12 space-y-4">

                {generatedTasks.map(
                  (task) => (
                    <GeneratedTaskCard
                      key={task.id}
                      task={task}
                      onToggle={() =>
                        toggleGeneratedTask(
                          task.id
                        )
                      }
                      onDelete={() =>
                        deleteGeneratedTask(
                          task.id
                        )
                      }
                    />
                  )
                )}

              </div>

              {generatedTasks.length === 0 && (
                <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">

                  <p className="text-zinc-500 dark:text-zinc-400">
                    No tasks remaining.
                  </p>

                </div>
              )}

              {/* ACTION BAR */}

              {generatedTasks.length > 0 && (
                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {selectedCount} of{" "}
                    {generatedTasks.length}{" "}
                    tasks selected
                  </p>

                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={
                        handleClear
                      }
                      disabled={
                        isAddingTasks
                      }
                      className="h-11 rounded-xl px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Start Over
                    </button>

                    <button
                      type="button"
                      onClick={
                        addSelectedTasks
                      }
                      disabled={
                        selectedCount === 0 ||
                        isAddingTasks
                      }
                      className="flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {isAddingTasks ? (
                        <>
                          <Sparkles
                            size={17}
                            className="animate-spin"
                          />

                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus
                            size={17}
                          />

                          Add Selected Tasks
                        </>
                      )}

                    </button>

                  </div>

                </div>
              )}

              {/* CREATE ANOTHER */}

              <button
                type="button"
                onClick={handleClear}
                disabled={
                  isAddingTasks
                }
                className="mx-auto mt-10 flex items-center gap-2 text-sm font-medium text-violet-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-violet-400"
              >
                <RotateCcw
                  size={17}
                />

                Create another Brain Dump
              </button>

            </section>
          )}

        </div>
      </main>
    </div>
  );
}

/* =========================
   GENERATED TASK CARD
========================= */

type GeneratedTaskCardProps = {
  task: GeneratedTask;
  onToggle: () => void;
  onDelete: () => void;
};

function GeneratedTaskCard({
  task,
  onToggle,
  onDelete,
}: GeneratedTaskCardProps) {
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
      className={`flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-zinc-900 ${
        task.selected
          ? "border-violet-200 dark:border-violet-800"
          : "border-zinc-200 opacity-60 dark:border-zinc-800"
      }`}
    >

      {/* SELECT */}

      <button
        type="button"
        onClick={onToggle}
        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          task.selected
            ? "border-violet-600 bg-violet-600 text-white"
            : "border-zinc-300 dark:border-zinc-600"
        }`}
      >
        {task.selected && (
          <Check size={15} />
        )}
      </button>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">

        <h3 className="font-semibold text-zinc-900 dark:text-white">
          {task.title}
        </h3>

        {task.description && (
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">

          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}
          >
            <Flag
              size={12}
              className="mr-1 inline"
            />

            {task.priority}
          </span>

          <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <Tag
              size={12}
              className="mr-1 inline"
            />

            {task.category}
          </span>

          {task.dueDate && (
            <span className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
              <CalendarDays
                size={12}
                className="mr-1 inline"
              />

              {task.dueDate}
            </span>
          )}

        </div>

      </div>

      {/* DELETE */}

      <button
        type="button"
        onClick={onDelete}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
      >
        <X size={18} />
      </button>

    </div>
  );
}

/* =========================
   STEP CARD
========================= */

type StepCardProps = {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
};

function StepCard({
  number,
  icon,
  title,
  description,
}: StepCardProps) {
  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <span className="absolute right-5 top-5 text-sm font-bold text-zinc-200 dark:text-zinc-700">
        {number}
      </span>

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
        {icon}
      </div>

      <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>

    </div>
  );
}

export default BrainDumpPage;