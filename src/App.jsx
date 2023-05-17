import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/todos'
    );
    setTodos(response.data);
  };

  const addTodo = async (e) => {
    e.preventDefault();

    const newTodo = {
      title: title,
      completed: false,
      userId: 1,
    };

    const response = await axios.post(
      'https://jsonplaceholder.typicode.com/todos',
      newTodo
    );

    setTodos([{ ...response.data, id: getRandomNumber() }, ...todos]);
    setTitle('');
  };

  function getRandomNumber(min = 201, max = 500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const deleteTodo = async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = async (data, index) => {
    await axios.patch(`https://jsonplaceholder.typicode.com/todos/${data.id}`, {
      completed: !data.completed,
    });

    let newArray = todos.map((todo) => {
      if (todo.id === data.id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });

    setTodos([...newArray]);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed' && !todo.completed) {
      return false;
    }

    if (filter === 'not-completed' && todo.completed) {
      return false;
    }

    const searchTermLower = searchTerm.toLowerCase();
    return todo.title?.toLowerCase().includes(searchTermLower);
  });

  return (
    <div className='container'>
      <h1>Todo Maker App</h1>

      <div className='todo'>
        <form onSubmit={addTodo}>
          <input
            type='text'
            placeholder='Add New Todo'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type='submit'>Add Todo</button>
        </form>

        <div className='filters'>
          <div>
            <label htmlFor='filter-select'>Filter by status:</label>
            <select
              id='filter-select'
              value={filter}
              onChange={handleFilterChange}
            >
              <option value='all'>All Todos</option>
              <option value='completed'>Completed Todos</option>
              <option value='not-completed'>Not Completed Todos</option>
            </select>
          </div>
          <input
            type='text'
            placeholder='Search by title'
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <ol className='todoList'>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => (
              <li key={todo.id}>
                <div className='todo'>
                  <div>
                    <span>{todo.title}</span>
                    <span>
                      {todo.completed ? '(Completed)' : '(Not Completed)'}
                    </span>
                  </div>
                  <div className='actions'>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    <button onClick={() => editTodo(todo, index)}>Edit</button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No Result Found</p>
          )}
        </ol>
      </div>
    </div>
  );
}

export default App;
