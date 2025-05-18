import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const EmptyPlaceholder = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });


  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      
    </div>
  );
};
