const state = {
  todos: [],
  important: [],
  search: "",
};

const mainTb = document.querySelector("#todoMain");
const importantTb = document.querySelector("#todoImp");
const searchInput = document.querySelector("#searchInput");
const formTb = document.querySelector("#searchForm");

function render() {
  const term = state.search.toLowerCase();

  const activity = state.todos.filter((todo) =>
    todo.todo.toLowerCase().includes(term),
  );

  mainTb.innerHTML = activity
    .map((todo) => createCard(todo))
    .join("");

  importantTb.innerHTML = state.important
    .map((todo) => createCard(todo))
    .join("");
}

function createCard(todo) {
  const saved = state.important.some(
    (important) => important.id === todo.id,
  );

  return `
    <div class="card">

      <p class="description">
        ${todo.todo}
      </p>

      <p class="status">
        Status: ${todo.completed ? "Completed" : "Not completed"}
      </p>

      <p class="userId">
        User ID: ${todo.userId}
      </p>

      <button
        class="${saved ? "removeImportant" : "addImportant"}"
        onclick="addOrRemove(${todo.id})"
      >
        ${saved ? "Remove Important" : "Add Important"}
      </button>

    </div>
  `;
}

async function loadTodos() {
  try {
    const response = await fetch("https://dummyjson.com/todos");

    if (!response.ok) {
      throw new Error("Failed to load todos");
    }

    const data = await response.json();

    state.todos = data.todos;

    render();
  } catch (error) {
    console.log(error);

    mainTb.innerHTML = `
      <p>Could not load todos.</p>
    `;
  }
}

function addOrRemove(id) {
  const exists = state.important.find(
    (important) => important.id === id,
  );

  if (exists) {
    state.important = state.important.filter(
      (important) => important.id !== id,
    );
  } else {
    const todo = state.todos.find(
      (todo) => todo.id === id,
    );

    if (todo) {
      state.important.push(todo);
    }
  }

  saveImportant();

  render();
}

function saveImportant() {
  localStorage.setItem(
    "todoImportant",
    JSON.stringify(state.important),
  );
}

function loadImportant() {
  const savedImportant = localStorage.getItem("todoImportant");

  if (savedImportant) {
    state.important = JSON.parse(savedImportant);
  }
}

formTb.addEventListener("submit", function (event) {
  event.preventDefault();

  const query = searchInput.value.trim().toLowerCase();

  state.search = query;

  render();
});

function init() {
  loadImportant();
  loadTodos();
}

init();