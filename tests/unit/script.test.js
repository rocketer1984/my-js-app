/**
 * @jest-environment jsdom
 */

const script = require('../../script');

describe('Unit tests for todo app', () => {
  beforeEach(() => {
    // Setup a clean DOM before each test
    document.body.innerHTML = `
      <input id="todo-input" type="text" />
      <ul id="todo-list"></ul>
    `;
  });

  test('preloadTodos adds initial tasks', () => {
    script.preloadTodos();
    const items = document.querySelectorAll('#todo-list li');
    expect(items.length).toBe(script.initialTasks.length);
    expect(items[0].textContent).toBe(script.initialTasks[0]);
  });

  test('addTodoItem adds a new item to the list', () => {
    script.addTodoItem('Test Task');
    const items = document.querySelectorAll('#todo-list li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('Test Task');
  });

  test('addTodo adds trimmed task from input and clears input', () => {
    const input = document.getElementById('todo-input');
    input.value = '  New Task  ';
    script.addTodo();
    const items = document.querySelectorAll('#todo-list li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('New Task');
    expect(input.value).toBe('');
  });

  test('addTodo does not add empty or whitespace-only tasks', () => {
    const input = document.getElementById('todo-input');
    input.value = '    ';
    script.addTodo();
    const items = document.querySelectorAll('#todo-list li');
    expect(items.length).toBe(0);
  });

  /*test('handleKeyPress calls addTodo when Enter is pressed', () => {
    // Spy on addTodo
    const addTodoSpy = jest.spyOn(script, 'addTodo');

    const input = document.getElementById('todo-input');
    input.value = 'Task from Enter';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    document.addEventListener('addTodoCalled', () => {
      // This is just an example if you want to listen for a custom event
    });
        
    window.addTodo = script.addTodo;
    script.handleKeyPress(event);
    expect(addTodoSpy).toHaveBeenCalled();
    addTodoSpy.mockRestore();
  });*/
});
