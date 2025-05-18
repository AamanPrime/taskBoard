import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { useNavigate } from 'react-router-dom';


export const Card = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id: task.id });
  const navigate = useNavigate();
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
    transition: 'transform 0.1s ease',
  };

  const handleDelete = (taskId) => {
    fetch(`http://127.0.0.1:5000/api/delete${taskId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        console.log(`Deleted task ${taskId}`);
        window.location.reload();
      })
      .catch(err => console.error(err));
  };


  return (
    <div
      className="rounded-xl border border-gray-200 bg-slate-50 p-4 shadow-sm hover:shadow-md transition"
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='cursor-grab'
      >
        <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
        <p className="text-sm text-gray-600 mt-2 mb-4">{task.description}</p>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" className="rounded-lg" onClick={() => navigate(`/edit/${task.id}`)}>Edit</Button>
        <Button variant="destructive" className="rounded-lg" onClick={() => {
          handleDelete(task.id)
        }}>Delete</Button>
      </div>
    </div>
  );
};
