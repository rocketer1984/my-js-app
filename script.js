// Load todos from backend
async function preloadTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  todos.forEach(todo => addTodoItem(todo.task, todo.id));
}

// Add todo (send to backend)
async function addTodo() {
  const input = document.getElementById("todo-input");
  const task = input.value.trim();
  if (task === "") return;

  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });
  if (!res.ok) {
    alert('Failed to add todo');
    return;
  }
  const newTodo = await res.json();
  addTodoItem(newTodo.task, newTodo.id);
  input.value = "";
}

// Add todo item to the list, with id for deletion
function addTodoItem(task, id = null) {
  const list = document.getElementById("todo-list");
  const item = document.createElement("li");
  item.textContent = task;
  if (id) item.dataset.id = id;

  item.onclick = async () => {
    if (!id) return;
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      list.removeChild(item);
    } else {
      alert('Failed to delete todo');
    }
  };
  list.appendChild(item);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}

if (typeof window !== 'undefined') {
  window.onload = () => {
    preloadTodos();

    // Add this listener to the input
    document.getElementById("todo-input").addEventListener("keydown", handleKeyPress);
  };
}

// Needed to export information for unit testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    preloadTodos,
    addTodo,
    addTodoItem,
    handleKeyPress,
  };
}

