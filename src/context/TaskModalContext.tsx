import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

type TaskModalContextType = {
  isTaskModalOpen: boolean;
  openTaskModal: () => void;
  closeTaskModal: () => void;
};

const TaskModalContext =
  createContext<TaskModalContextType | undefined>(
    undefined
  );

type TaskModalProviderProps = {
  children: ReactNode;
};

export function TaskModalProvider({
  children,
}: TaskModalProviderProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  function openTaskModal() {
    setIsTaskModalOpen(true);
  }

  function closeTaskModal() {
    setIsTaskModalOpen(false);
  }

  return (
    <TaskModalContext.Provider
      value={{
        isTaskModalOpen,
        openTaskModal,
        closeTaskModal,
      }}
    >
      {children}
    </TaskModalContext.Provider>
  );
}

export function useTaskModal() {
  const context = useContext(TaskModalContext);

  if (!context) {
    throw new Error(
      "useTaskModal must be used inside TaskModalProvider"
    );
  }

  return context;
}