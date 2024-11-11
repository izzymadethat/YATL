import { useEffect, useState } from "react";

// const fakeTodoData = [
//   {
//     id: 1,
//     text: "Walk the dog"
//   },
//   {
//     id: 2,
//     text: "Buy milk"
//   },
//   {
//     id: 3,
//     text: "Do the dishes"
//   }
// ];

function App() {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api");
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (todoInput.trim() === "") return;

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: todoInput })
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodos((prevTodos) => [newTodo, ...prevTodos]);
        setTodoInput("");
      }
    } catch (error) {
      sconsole.log(error);
    }
  };
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-md mx-auto  d-flex flex-column  gap-3 mt-4">
      <h1>YATL</h1>
      <div className="d-flex w-100">
        <input
          type="text"
          className="form-control"
          placeholder="I need to..."
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
        />
        <button className="btn btn-primary w-25" onClick={handleAddTodo}>
          Add
        </button>
      </div>
      <div className="w-100 mt-4">
        <h2>Todos</h2>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Todo</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td scope="row">{todo.id}</td>
                <td scope="row">{todo.text}</td>
                <td scope="row" className="d-flex gap-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
