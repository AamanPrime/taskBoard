import { Card } from "./card";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EmptyPlaceholder } from './EmptyPlaceholder'; // import this new component

export const Column = ({ tasks, columnName }) => {
  const columnTasks = tasks[columnName] || [];

  const items = columnTasks.length > 0
    ? columnTasks.map(task => task.id)
    : [`empty-${columnName}`];

  return (
    <div key={columnName} className="bg-white rounded-2xl shadow-xl p-4 min-h-[300px]">
      <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">{columnName}</h2>

      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4 min-h-[100px]">
          {columnTasks.length > 0 ? (
            columnTasks.map(task => (
              <Card key={task.id} task={task} />
            ))
          ) : (
            <EmptyPlaceholder id={`empty-${columnName}`} />
          )}
        </div>
      </SortableContext>
    </div>
  );
};
