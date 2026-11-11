import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import type { ReactNode } from "react";

import {
  getTasks,
  createTask as createTaskAPI,
  toggleTaskAPI,
  deleteTaskAPI,
} from "../services/api";

/* =========================
   TYPES
========================= */

export type Priority =
  | "High"
  | "Medium"
  | "Low";

export type Task = {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
};

type NewTask = {
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  dueDate?: string;
};

type TaskContextType = {
  tasks: Task[];

  loading: boolean;

  addTask: (
    taskData: NewTask
  ) => Promise<void>;

  toggleTask: (
    id: string
  ) => Promise<void>;

  deleteTask: (
    id: string
  ) => Promise<void>;

  refreshTasks: () => Promise<void>;
};

/* =========================
   CONTEXT
========================= */

const TaskContext =
  createContext<
    TaskContextType | undefined
  >(undefined);

/* =========================
   PROVIDER PROPS
========================= */

type TaskProviderProps = {
  children: ReactNode;
};

/* =========================
   API TASK NORMALIZER
========================= */

/*
  api.ts returns:

  {
    _id: "...",
    user: "...",
    title: "...",
    description: "...",
    category: "...",
    priority: "...",
    dueDate: "...",
    completed: false
  }

  The React app also uses _id.
*/

function normalizeTask(
  task: {
    _id: string;
    title: string;
    description: string;
    category: string;
    priority: Priority;
    dueDate: string;
    completed: boolean;
  }
): Task {
  return {
    _id: task._id,

    title:
      task.title || "",

    description:
      task.description || "",

    category:
      task.category || "",

    priority:
      task.priority || "Medium",

    dueDate:
      task.dueDate || "",

    completed:
      Boolean(task.completed),
  };
}

/* =========================
   TASK PROVIDER
========================= */

export function TaskProvider({
  children,
}: TaskProviderProps) {
  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH TASKS
  ========================= */

  const refreshTasks =
    useCallback(
      async (): Promise<void> => {
        const token =
          localStorage.getItem(
            "token"
          );

        /*
          No token means the user
          isn't logged in.
        */

        if (!token) {
          setTasks([]);
          setLoading(false);
          return;
        }

        try {
          setLoading(true);

          const data =
            await getTasks();

          const normalizedTasks =
            data.map(
              (task) =>
                normalizeTask(task)
            );

          setTasks(
            normalizedTasks
          );
        } catch (error) {
          console.error(
            "Failed to fetch tasks:",
            error
          );

          /*
            Don't leave old tasks
            visible if authentication
            has failed.
          */

          setTasks([]);
        } finally {
          setLoading(false);
        }
      },
      []
    );

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  /* =========================
     AUTH CHANGE LISTENER
  ========================= */

  useEffect(() => {
    /*
      Login/logout happens in the
      same browser tab.

      The normal "storage" event
      does NOT fire in the same tab
      that changed localStorage.

      Therefore we use a custom
      browser event called:

        auth-changed
    */

    function handleAuthChanged() {
      refreshTasks();
    }

    window.addEventListener(
      "auth-changed",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "auth-changed",
        handleAuthChanged
      );
    };
  }, [refreshTasks]);

  /* =========================
     CREATE TASK
  ========================= */

  async function addTask(
    taskData: NewTask
  ): Promise<void> {
    try {
      const newTask =
        await createTaskAPI({
          title:
            taskData.title,

          description:
            taskData.description ||
            "",

          category:
            taskData.category,

          priority:
            taskData.priority,

          dueDate:
            taskData.dueDate || "",
        });

      const normalizedTask =
        normalizeTask(
          newTask
        );

      setTasks(
        (currentTasks) => [
          normalizedTask,
          ...currentTasks,
        ]
      );
    } catch (error) {
      console.error(
        "Failed to create task:",
        error
      );

      throw error;
    }
  }

  /* =========================
     TOGGLE TASK
  ========================= */

  async function toggleTask(
    id: string
  ): Promise<void> {
    if (!id) {
      console.error(
        "toggleTask called without a task ID."
      );

      return;
    }

    try {
      const updatedTask =
        await toggleTaskAPI(id);

      const normalizedTask =
        normalizeTask(
          updatedTask
        );

      setTasks(
        (currentTasks) =>
          currentTasks.map(
            (task) =>
              task._id === id
                ? normalizedTask
                : task
          )
      );
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      throw error;
    }
  }

  /* =========================
     DELETE TASK
  ========================= */

  async function deleteTask(
    id: string
  ): Promise<void> {
    if (!id) {
      console.error(
        "deleteTask called without a task ID."
      );

      return;
    }

    try {
      await deleteTaskAPI(id);

      setTasks(
        (currentTasks) =>
          currentTasks.filter(
            (task) =>
              task._id !== id
          )
      );
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      throw error;
    }
  }

  /* =========================
     PROVIDER
  ========================= */

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        toggleTask,
        deleteTask,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

/* =========================
   CUSTOM HOOK
========================= */

export function useTasks() {
  const context =
    useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTasks must be used inside TaskProvider"
    );
  }

  return context;
}