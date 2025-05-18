// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskBoardPage from './Home';
import AddTaskPage from './add';
import EditTaskPage from './edit'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskBoardPage />} />
        <Route path="/add" element={<AddTaskPage />} />
        <Route path="/edit/:taskId" element={<EditTaskPage />} />

      </Routes>
    </BrowserRouter>
  );
}
