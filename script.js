const initialTasks = ["Clip bushes", "Tighten garage door", "Seal driveway"];

function preloadTodos() {
  initialTasks.forEach(task => {
    addTodoItem(task);
  });
}

function addTodo() {
  const input = document.getElementById("todo-input");
  const task = input.value.trim();
  if (task === "") return;

  addTodoItem(task);
  input.value = "";
}

function addTodoItem(task) {
  const list = document.getElementById("todo-list");
  const item = document.createElement("li");
  item.textContent = task;

  item.onclick = () => list.removeChild(item);
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
    initialTasks,
  };
}

