import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function EditTaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    
    const fetchTask = async () => {

        fetch('http://127.0.0.1:5000/api/data')
        .then(res => res.json())
        .then(data => {
            let task;
            data.forEach(t => {
                if (t.id == taskId) {
                    task = t;
                }
            })
            console.log(task);
            setTitle(task.title);
            setDescription(task.description)
        })
        .catch(err => console.error(err));
        
    };

    fetchTask();
  }, [taskId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedTask = { id: taskId, title, description };
    console.log('Updated Task:', updatedTask);

    fetch(`http://127.0.0.1:5000/api/edit`, {
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
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Task</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter task title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter task description"
              rows={4}
            ></textarea>
          </div>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="rounded-2xl"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-2xl shadow-md">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
