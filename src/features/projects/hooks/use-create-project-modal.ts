import { parseAsBoolean, useQueryState } from 'nuqs';


export const useCreateProjectModal = () => {
  const [isOpen, setIsOpen] = useQueryState<boolean>("create-project", parseAsBoolean);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return {
    isOpen,
    open,
    close,
    setIsOpen,
  }
}