import { useMemo, useState } from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ListTodo,
  Plus,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import NewTaskModal from "../components/dashboard/NewTaskModal";

import {
  useTasks,
  type Task,
} from "../context/TaskContext";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function CalendarPage() {
  const {
    tasks,
    addTask,
    toggleTask,
  } = useTasks();

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(new Date());

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const firstDayOfMonth =
    new Date(
      year,
      month,
      1
    ).getDay();

  /* =========================
     MONTH NAVIGATION
  ========================= */

  function goToPreviousMonth() {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  }

  function goToNextMonth() {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  }

  function goToToday() {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  }

  /* =========================
     DATE HELPERS
  ========================= */

  function formatDate(date: Date) {
    const localYear =
      date.getFullYear();

    const localMonth =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const localDay =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${localYear}-${localMonth}-${localDay}`;
  }

  function isSameDay(
    first: Date,
    second: Date
  ) {
    return (
      first.getFullYear() ===
        second.getFullYear() &&
      first.getMonth() ===
        second.getMonth() &&
      first.getDate() ===
        second.getDate()
    );
  }

  /* =========================
     GET TASKS FOR DATE
  ========================= */

  function getTasksForDate(
    date: Date
  ) {
    const dateString =
      formatDate(date);

    return tasks.filter(
      (task) =>
        task.dueDate === dateString
    );
  }

  const selectedDateTasks =
    useMemo(() => {
      if (!selectedDate) {
        return [];
      }

      return getTasksForDate(
        selectedDate
      );
    }, [selectedDate, tasks]);

  /* =========================
     CALENDAR DAYS
  ========================= */

  const calendarDays: (
    Date | null
  )[] = [];

  for (
    let emptyDay = 0;
    emptyDay < firstDayOfMonth;
    emptyDay++
  ) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(
      new Date(
        year,
        month,
        day
      )
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="flex min-h-screen bg-[#f6f6fb] transition-colors dark:bg-zinc-950">
      <Sidebar />

      <main className="min-w-0 flex-1">

        <Header
          onNewTask={() =>
            setIsTaskModalOpen(true)
          }
        />

        <div className="mx-auto max-w-7xl p-6 lg:p-10">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                SCHEDULE
              </p>

              <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                Calendar
              </h1>

              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                Plan your work and stay on top
                of your deadlines.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setIsTaskModalOpen(true)
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <Plus size={18} />
              New Task
            </button>

          </div>

          {/* =========================
              CALENDAR + SELECTED DAY
          ========================= */}

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_320px]">

            {/* =========================
                CALENDAR
            ========================= */}

            <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">

              {/* Calendar Header */}

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                    <CalendarDays
                      size={21}
                    />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {monthNames[month]}{" "}
                      {year}
                    </h2>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Your task schedule
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={
                      goToPreviousMonth
                    }
                    aria-label="Previous month"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <ChevronLeft
                      size={19}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      goToToday
                    }
                    className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    Today
                  </button>

                  <button
                    type="button"
                    onClick={
                      goToNextMonth
                    }
                    aria-label="Next month"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <ChevronRight
                      size={19}
                    />
                  </button>

                </div>

              </div>

              {/* Week Days */}

              <div className="mt-8 grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800">

                {weekDays.map(
                  (day) => (
                    <div
                      key={day}
                      className="pb-3 text-center text-xs font-semibold uppercase text-zinc-400 dark:text-zinc-500"
                    >
                      {day}
                    </div>
                  )
                )}

              </div>

              {/* Calendar Days */}

              <div className="grid grid-cols-7">

                {calendarDays.map(
                  (date, index) => {

                    if (!date) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="min-h-24 border-b border-r border-zinc-100 dark:border-zinc-800"
                        />
                      );
                    }

                    const dayTasks =
                      getTasksForDate(
                        date
                      );

                    const isToday =
                      isSameDay(
                        date,
                        new Date()
                      );

                    const isSelected =
                      selectedDate &&
                      isSameDay(
                        date,
                        selectedDate
                      );

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() =>
                          setSelectedDate(
                            date
                          )
                        }
                        className={`min-h-24 border-b border-r border-zinc-100 p-2 text-left transition dark:border-zinc-800 ${
                          isSelected
                            ? "bg-violet-50 dark:bg-violet-950/30"
                            : "hover:bg-violet-50 dark:hover:bg-zinc-800"
                        }`}
                      >

                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                            isToday
                              ? "bg-violet-600 text-white"
                              : "text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {date.getDate()}
                        </div>

                        <div className="mt-2 space-y-1">

                          {dayTasks
                            .slice(0, 2)
                            .map(
                              (task) => (
                                <div
                                  key={
                                    task._id
                                  }
                                  className={`truncate rounded-md px-2 py-1 text-[10px] font-medium ${
                                    task.completed
                                      ? "bg-zinc-100 text-zinc-400 line-through dark:bg-zinc-800 dark:text-zinc-500"
                                      : task.priority ===
                                          "High"
                                        ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                        : task.priority ===
                                            "Medium"
                                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                          : "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                  }`}
                                >
                                  {
                                    task.title
                                  }
                                </div>
                              )
                            )}

                          {dayTasks.length >
                            2 && (
                            <p className="px-1 text-[10px] font-medium text-violet-600 dark:text-violet-400">
                              +
                              {dayTasks.length -
                                2}{" "}
                              more
                            </p>
                          )}

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            </section>

            {/* =========================
                SELECTED DAY
            ========================= */}

            <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">

              <div>

                <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                  SELECTED DAY
                </p>

                <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                  {selectedDate
                    ? selectedDate.toLocaleDateString(
                        "en-US",
                        {
                          month:
                            "long",
                          day: "numeric",
                          year:
                            "numeric",
                        }
                      )
                    : "Select a date"}
                </h2>

              </div>

              <div className="mt-6 space-y-3">

                {selectedDateTasks.length ===
                0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center dark:border-zinc-700">

                    <ListTodo
                      size={30}
                      className="mx-auto text-zinc-300 dark:text-zinc-600"
                    />

                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      No tasks scheduled.
                    </p>

                  </div>
                ) : (
                  selectedDateTasks.map(
                    (task) => (
                      <CalendarTaskItem
                        key={task._id}
                        task={task}
                        onToggle={() =>
                          toggleTask(
                            task._id
                          )
                        }
                      />
                    )
                  )
                )}

              </div>

            </aside>

          </div>

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
          setIsTaskModalOpen(false)
        }
        onCreateTask={addTask}
      />

    </div>
  );
}

/* =========================
   CALENDAR TASK ITEM
========================= */

type CalendarTaskItemProps = {
  task: Task;
  onToggle: () => void;
};

function CalendarTaskItem({
  task,
  onToggle,
}: CalendarTaskItemProps) {

  const priorityStyles = {
    High:
      "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",

    Medium:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",

    Low:
      "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
  };

  return (
    <div className="rounded-xl border border-zinc-100 p-4 transition-colors dark:border-zinc-800">

      <div className="flex items-start gap-3">

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            task.completed
              ? "Mark task as active"
              : "Mark task as completed"
          }
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            task.completed
              ? "border-violet-600 bg-violet-600"
              : "border-zinc-300 hover:border-violet-500 dark:border-zinc-600"
          }`}
        >
          {task.completed && (
            <span className="h-2 w-2 rounded-full bg-white" />
          )}
        </button>

        <div className="min-w-0 flex-1">

          <h3
            className={`font-semibold ${
              task.completed
                ? "text-zinc-400 line-through dark:text-zinc-600"
                : "text-zinc-800 dark:text-zinc-100"
            }`}
          >
            {task.title}
          </h3>

          <div className="mt-2 flex items-center gap-2">

            <span
              className={`rounded-md px-2 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
            >
              {task.priority}
            </span>

            <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
              <Clock size={12} />
              {task.category}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CalendarPage;