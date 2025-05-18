import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from './components/ui/column';
import { Button } from './components/ui/button';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

const columns = ['To Do', 'In Progress', 'Completed'];


export default function TaskBoardPage() {
  const [tasks, setTasks] = useState({
    'To Do': [],
    'In Progress' : [],
    'Completed':[]
  });
  const navigate = useNavigate();
useEffect(() => {
  fetch('http://127.0.0.1:5000/api/data')
    .then(res => res.json())
    .then(data => {

      const grouped = {
        'To Do': [],
        'In Progress': [],
        'Completed': [],
      };

      data.forEach(task => {
        const colName = columns[task.category];
        if (colName) grouped[colName].push(task);
      });

      setTasks(grouped);
    })
    .catch(err => console.error(err));
}, []);

  const findTaskLocation = (id) => {
    for (const col of columns) {
      const index = tasks[col].findIndex(t => t.id === id);
      if (index !== -1) return { col, index };
    }
    return null;
  };

const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over) return;
  if (active.id === over.id) return;

  let destinationCol = null;
  let destinationIndex = 0;

  if (over && typeof over.id === 'string' && over.id.startsWith('empty-')) {
    destinationCol = over.id.replace('empty-', '');
    destinationIndex = 0;
  } else {
    const overLocation = findTaskLocation(over.id);
    if (!overLocation) return;
    destinationCol = overLocation.col;
    destinationIndex = overLocation.index;
  }

  const activeLocation = findTaskLocation(active.id);
  if (!activeLocation) return;

  if (activeLocation.col === destinationCol) {
    
    // reorder in same column
    const newTasks = [...tasks[activeLocation.col]];
    const oldIndex = activeLocation.index;
    const reordered = arrayMove(newTasks, oldIndex, destinationIndex);
    const updatedTask = { ...tasks, [activeLocation.col]: reordered };
    setTasks(updatedTask);
    console.log(updatedTask)
    fetch(`http://127.0.0.1:5000/api/update-data`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask)
      
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update order');
      return res.json();
    })
    .then(data => console.log('Updated order:', data))
    .catch(err => console.error(err));
    
  } else {
    
    // move task to different column
    const sourceTasks = [...tasks[activeLocation.col]];
    const destTasks = [...tasks[destinationCol]];

    const [moved] = sourceTasks.splice(activeLocation.index, 1);
    destTasks.splice(destinationIndex, 0, moved);
    const updatedTask = {
      ...tasks,
      [activeLocation.col]: sourceTasks,
      [destinationCol]: destTasks,
    };
    setTasks(updatedTask);

    fetch(`http://127.0.0.1:5000/api/update-data`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask)
      
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update order');
      return res.json();
    })
    .then(data => console.log('Updated order:', data))
    .catch(err => console.error(err));
    

  }
};
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-6">
      <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Task Board</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl shadow-md" onClick={() => navigate('/add')}>
            Add Task
          </Button>
        </div>
        
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(col => (
              <SortableContext
                key={col}
                items={tasks[col].map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <Column columnName={col} tasks={tasks} />
              </SortableContext>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
