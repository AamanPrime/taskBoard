import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from './components/ui/column';

const columns = ['To Do', 'In Progress', 'Completed'];

const initialTasks = {
  'To Do': [
    { id: '1', title: 'Task Name', description: 'Description for task 1.' },
    { id: '2', title: 'Task Name', description: 'Another task description.' },
  ],
  'In Progress': [
    { id: '3', title: 'Task Name', description: 'Currently being worked on.' },
  ],
  'Completed': [
    { id: '4', title: 'Task Name', description: 'Finished task description.' },
  ],
};

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState({
  'To Do': [],
  'In Progress': [],
  'Completed': [],
});
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

  let overId = over.id;
  let destinationCol = null;
  let destinationIndex = 0;

  // Check if dropped on an empty placeholder
  if (overId.startsWith('empty-')) {
    destinationCol = overId.replace('empty-', '');
    destinationIndex = 0; // add at start
  } else {
    const overLocation = findTaskLocation(overId);
    if (!overLocation) return;
    destinationCol = overLocation.col;
    destinationIndex = overLocation.index;
  }

  const activeLocation = findTaskLocation(active.id);
  if (!activeLocation) return;

  if (activeLocation.col === destinationCol) {
    // Reorder in same column
    const newTasks = [...tasks[activeLocation.col]];
    const oldIndex = activeLocation.index;
    const reordered = arrayMove(newTasks, oldIndex, destinationIndex);
    setTasks({ ...tasks, [activeLocation.col]: reordered });
  } else {
    // Move task to different column
    const sourceTasks = [...tasks[activeLocation.col]];
    const destTasks = [...tasks[destinationCol]];

    const [moved] = sourceTasks.splice(activeLocation.index, 1);
    destTasks.splice(destinationIndex, 0, moved);

    setTasks({
      ...tasks,
      [activeLocation.col]: sourceTasks,
      [destinationCol]: destTasks,
    });
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Task Board</h1>

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
