import "./App.css";
import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";
import { HiOutlinePlusSm } from "react-icons/hi";
import { FcOk } from "react-icons/fc";

const API = "http://localhost:5000/";
function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await fetch(API + "todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);

      setTodos(res);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);
    console.log("teste", todo);
    setTitle("");
    setTime("");
  };
  const handleDelete = async (id) => {
    await fetch(API + "todos/" + id, {
      method: "DELETE",
    });
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };

  if (loading) {
    return <h2>Carregando...</h2>;
  }
  return (
    <div className="containerApp">
      <div className="App">
        <div className="todo-header">
          <h1>TodoApp</h1>
        </div>
        <div className="form-todo">
          <h2>Criar tarefa</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="title">O que você vai fazer?</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Título da tarefa"
                onChange={(e) => setTitle(e.target.value)}
                value={title || ""}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="time">Duração:</label>
              <input
                id="time"
                type="number"
                name="time"
                placeholder="Tempo estimado(em horas)"
                onChange={(e) => setTime(e.target.value)}
                value={time || ""}
                required
              />
            </div>
            <button id="button" type="submit">
              Adicionar
              <HiOutlinePlusSm id="button-icon" />
            </button>
          </form>
        </div>
        <div className="list-todo">
          <h2>Lista de tarefas</h2>
          {todos.length === 0 && (
            <div className="list-empty">
              {" "}
              <p id="empty-text">Nenhuma tarefa pendente </p>{" "}
              <FcOk id="check" />{" "}
            </div>
          )}
          {todos.map((todo) => (
            <div className="todo" key={todo.id}>
              <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
              <p>Duração: {todo.time}</p>
              <div className="actions">
                <span onClick={() => handleEdit(todo)}>
                  {!todo.done ? (
                    <BsBookmarkCheck id="undone" />
                  ) : (
                    <BsBookmarkCheckFill id="done" />
                  )}
                </span>
                <BsTrash id="trash" onClick={() => handleDelete(todo.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
