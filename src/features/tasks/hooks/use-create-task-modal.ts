import { parseAsBoolean, useQueryState } from 'nuqs';


export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState<boolean>("create-task", parseAsBoolean);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return {
    isOpen,
    open,
    close,
    setIsOpen,
  }
}