import { useEffect, useState } from "react";
import PlusSvg from "./assets/Plus.svg";
import DeleteSvg from "./assets/Group 2.svg";
import CheckedSvg from "./assets/Group 1.svg";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [fetching, setFetching] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch(`${base_url}/todos`);

        if (!response.ok) {
          throw new Error("Response was not ok");
        }

        const fetchedTodos = await response.json();
        setTodos(fetchedTodos);
      } catch (error) {
        console.error(error.message);
      } finally {
        setFetching(false);
      }
    }

    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    const newTodoItem = {
      id: todos.length ? todos[todos.length - 1].id + 1 : 1,
      title,
      checked: false,
    };

    try {
      const response = await fetch(`${base_url}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoItem),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setTodos([...todos, result]);
      setTitle("");
    } catch (error) {
      console.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleCheck = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    );

    try {
      const response = await fetch(`${base_url}/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checked: !todos.find((todo) => todo.id === id).checked,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setTodos(updatedTodos);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);

    try {
      const response = await fetch(`${base_url}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const filteredTodos = todos.filter((todo) => todo.id !== id);
      setTodos(filteredTodos);
    } catch (error) {
      console.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#0D0714] h-screen">
      <div className="bg-[#1D1825] py-14 px-20 w-[600px] rounded-3xl">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 mb-14">
            <input
              className="bg-inherit text-[#9E78CF] py-2.5 pl-4 border border-[#9E78CF] focus:outline-none rounded-lg w-full"
              type="text"
              value={title} // Bind value to state
              onChange={(e) => setTitle(e.target.value)} // Update state on change
              placeholder="Add a new task"
            />
            <button className="bg-[#9E78CF] p-2 rounded-lg" type="submit">
              {creating ? (
                <p className="text-2xl text-white">Creating...</p>
              ) : (
                <img src={PlusSvg} alt="plus svg" />
              )}
            </button>
          </div>
        </form>
        {fetching ? (
          <p className="text-2xl text-white">Loading . . .</p>
        ) : (
          <ul>
            <h2 className="text-2xl text-white">Tasks to do</h2>
            {todos.map((todo) => (
              <li
                className="text-white px-5 py-5 bg-[#15101C] flex items-center justify-between mt-4 mb-4"
                key={todo.id}
                style={
                  todo.checked
                    ? { textDecoration: "line-through" }
                    : { textDecoration: "none" }
                }
              >
                {todo.title}
                <div className="flex items-center gap-2">
                  <input
                    className="w-7 h-7 bg-inherit"
                    type="checkbox"
                    onChange={() => handleCheck(todo.id)}
                  />
                  <button onClick={() => handleDelete(todo.id)}>
                    <img src={DeleteSvg} alt="delete icon" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
