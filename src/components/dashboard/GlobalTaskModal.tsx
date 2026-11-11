import NewTaskModal from "./NewTaskModal";
import { useTasks } from "../../context/TaskContext";
import { useTaskModal } from "../../context/TaskModalContext";

function GlobalTaskModal() {
  const { addTask } = useTasks();

  const {
    isTaskModalOpen,
    closeTaskModal,
  } = useTaskModal();

  return (
    <NewTaskModal
      isOpen={isTaskModalOpen}
      onClose={closeTaskModal}
      onCreateTask={addTask}
    />
  );
}

export default GlobalTaskModal;