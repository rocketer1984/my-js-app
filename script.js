const initialTasks = ["Clean the yard", "Buy groceries", "Call Mom"];

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

  window.onload = preloadTodos;
  
