import React from 'react';
import { useSelector } from 'react-redux';
import LoginForm from './components/LoginForm';
import TaskList from './components/TaskList';

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="App">
      <h1>Task Manager</h1>
      {isAuthenticated ? <TaskList /> : <LoginForm />}
    </div>
  );
};

export default App;