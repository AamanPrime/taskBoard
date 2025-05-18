import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


export const Card = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (taskId) => {
    fetch(`http://127.0.0.1:5000/api/delete${taskId}`, {
      method: 'DELETE',
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to delete');
      console.log(`Deleted task ${taskId}`);
    })
    .catch(err => console.error(err));
  };
  

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl border border-gray-200 bg-slate-50 p-4 shadow-sm hover:shadow-md transition cursor-grab"
    >
      <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
      <p className="text-sm text-gray-600 mt-2 mb-4">{task.description}</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" className="rounded-lg">Edit</Button>
        <Button variant="destructive" className="rounded-lg" onClick={(e) => {
            e.stopPropagation();
            handleDelete(task.id)
        }}>Delete</Button>
      </div>
    </motion.div>
  );
};
