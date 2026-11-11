import { useState } from "react";
import type { FormEvent } from "react";

import {
  CalendarDays,
  Flag,
  Tag,
  X,
} from "lucide-react";

import type {
  Priority,
  Task,
} from "../../context/TaskContext";

type NewTaskData = Omit<
  Task,
  "_id" | "completed"
>;

type NewTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: NewTaskData) => void;
};

function NewTaskModal({
  isOpen,
  onClose,
  onCreateTask,
}: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] =
    useState<Priority>("Medium");

  const [category, setCategory] =
    useState("Personal");

  const [dueDate, setDueDate] =
    useState("");

  if (!isOpen) {
    return null;
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreateTask({
      title: title.trim(),
      description,
      priority,
      category,
      dueDate,
    });

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Personal");
    setDueDate("");

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              Create New Task
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add something you want to get done.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Task title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="What do you need to do?"
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Add more details..."
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-200 p-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
                <Flag size={16} />
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as Priority
                  )
                }
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-violet-500"
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
                <Tag size={16} />
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-violet-500"
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Development</option>
                <option>Study</option>
                <option>Career</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
              <CalendarDays size={16} />
              Due date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-700 outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl px-5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskModal;