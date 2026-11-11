import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  Check,
  CheckCircle2,
  Circle,
  Filter,
  ListTodo,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import NewTaskModal from "../components/dashboard/NewTaskModal";

import {
  useTasks,
  type Task,
  type Priority,
} from "../context/TaskContext";

function TasksPage() {
  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<"All" | "Active" | "Completed">(
      "All"
    );

  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
  } = useTasks();

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
     FILTER + SEARCH + SORT
  ========================= */

  const filteredTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => {
        /* -------------------------
           SEARCH
        ------------------------- */

        const matchesSearch =
          task.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        /* -------------------------
           FILTER
        ------------------------- */

        if (
          filter === "Completed"
        ) {
          return (
            matchesSearch &&
            task.completed
          );
        }

        /*
          Both "All" and "Active"
          show ONLY unfinished tasks.

          This keeps completed tasks
          out of the main task list.
        */

        return (
          matchesSearch &&
          !task.completed
        );
      })

      /* =========================
         SORT
      ========================= */

      .sort((a, b) => {
        /*
          Completed tasks are only
          shown in Completed filter.
        */

        /* -------------------------
           1. PRIORITY
        ------------------------- */

        const priorityDifference =
          priorityOrder[a.priority] -
          priorityOrder[b.priority];

        if (
          priorityDifference !== 0
        ) {
          return priorityDifference;
        }

        /* -------------------------
           2. DUE DATE
        ------------------------- */

        /*
          Tasks with a due date
          come before tasks without
          a due date.
        */

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

        /*
          Earlier due date first.
        */

        return (
          new Date(
            a.dueDate
          ).getTime() -
          new Date(
            b.dueDate
          ).getTime()
        );
      });
  }, [
    tasks,
    search,
    filter,
  ]);

  /* =========================
     COUNTS
  ========================= */

  const activeCount =
    tasks.filter(
      (task) =>
        !task.completed
    ).length;

  const completedCount =
    tasks.filter(
      (task) =>
        task.completed
    ).length;

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="flex min-h-screen bg-[#f6f6fb] dark:bg-zinc-950">

      <Sidebar />

      <main className="min-w-0 flex-1">

        <Header
          onNewTask={() =>
            setIsTaskModalOpen(true)
          }
        />

        <div className="mx-auto max-w-6xl p-6 lg:p-10">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                TASK MANAGEMENT
              </p>

              <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                My Tasks
              </h1>

              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                Keep track of everything you need to do.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setIsTaskModalOpen(true)
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98]"
            >
              <Plus size={18} />
              New Task
            </button>

          </div>

          {/* =========================
              TASK STATISTICS
          ========================= */}

          <section className="mt-8 grid gap-5 sm:grid-cols-3">

            <TaskStat
              icon={
                <ListTodo size={20} />
              }
              label="Active Tasks"
              value={activeCount}
            />

            <TaskStat
              icon={
                <Circle size={20} />
              }
              label="Remaining"
              value={activeCount}
            />

            <TaskStat
              icon={
                <CheckCircle2
                  size={20}
                />
              }
              label="Completed"
              value={completedCount}
            />

          </section>

          {/* =========================
              SEARCH + FILTER
          ========================= */}

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

            <div className="flex flex-col gap-4 md:flex-row">

              {/* SEARCH */}

              <div className="relative flex-1">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search tasks..."
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:ring-violet-950"
                />

              </div>

              {/* FILTER */}

              <div className="flex items-center gap-2">

                <Filter
                  size={18}
                  className="text-zinc-400"
                />

                {(
                  [
                    "All",
                    "Active",
                    "Completed",
                  ] as const
                ).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFilter(
                          item
                        )
                      }
                      className={`h-10 rounded-lg px-4 text-sm font-medium transition ${
                        filter === item
                          ? "bg-violet-600 text-white"
                          : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              </div>

            </div>

          </section>

          {/* =========================
              TASK LIST
          ========================= */}

          <section className="mt-6 space-y-3">

            {filteredTasks.length ===
            0 ? (

              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">

                <ListTodo
                  size={36}
                  className="mx-auto text-zinc-300 dark:text-zinc-600"
                />

                <h3 className="mt-4 font-semibold text-zinc-800 dark:text-zinc-200">

                  {filter ===
                  "Completed"
                    ? "No completed tasks"
                    : search
                      ? "No tasks found"
                      : "No active tasks"}

                </h3>

                <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">

                  {filter ===
                  "Completed"
                    ? "Completed tasks will appear here."
                    : search
                      ? "Try a different search."
                      : "You're all caught up."}

                </p>

                {filter !==
                  "Completed" &&
                  !search && (
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
                  )}

              </div>

            ) : (

              filteredTasks.map(
                (task) => (
                  <FullTaskItem
                    key={task._id}
                    task={task}
                    onToggle={() =>
                      toggleTask(
                        task._id
                      )
                    }
                    onDelete={() =>
                      deleteTask(
                        task._id
                      )
                    }
                  />
                )
              )

            )}

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

    </div>
  );
}

/* =========================
   TASK STAT
========================= */

type TaskStatProps = {
  icon: ReactNode;
  label: string;
  value: number;
};

function TaskStat({
  icon,
  label,
  value,
}: TaskStatProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
        {icon}
      </div>

      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}

/* =========================
   FULL TASK ITEM
========================= */

type FullTaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

function FullTaskItem({
  task,
  onToggle,
  onDelete,
}: FullTaskItemProps) {

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
      className={`group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-zinc-900 ${
        task.completed
          ? "border-zinc-100 opacity-60 dark:border-zinc-800"
          : "border-zinc-200 hover:border-violet-200 hover:shadow-md dark:border-zinc-800 dark:hover:border-violet-900"
      }`}
    >

      {/* CHECK */}

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          task.completed
            ? "Mark task as active"
            : "Mark task as completed"
        }
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? "border-violet-600 bg-violet-600 text-white"
            : "border-zinc-300 hover:border-violet-500 dark:border-zinc-600"
        }`}
      >
        {task.completed && (
          <Check size={15} />
        )}
      </button>

      {/* TASK INFORMATION */}

      <div className="min-w-0 flex-1">

        <h3
          className={`font-semibold ${
            task.completed
              ? "text-zinc-400 line-through dark:text-zinc-600"
              : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {task.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">

          <span>
            {task.category}
          </span>

          <span>
            •
          </span>

          <span>
            {task.dueDate ||
              "No due date"}
          </span>

        </div>

      </div>

      {/* PRIORITY */}

      <span
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
          priorityStyles[
            task.priority
          ]
        }`}
      >
        {task.priority}
      </span>

      {/* DELETE */}

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/40"
      >
        <Trash2 size={17} />
      </button>

    </div>
  );
}

export default TasksPage;