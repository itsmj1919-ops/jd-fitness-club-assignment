const TASKS_KEY = "jd-fitness-club-training-tasks";
const NOTE_KEY = "jd-fitness-club-practice-note";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector("#empty-state");
const filterButtons = document.querySelectorAll("[data-filter]");
const noteForm = document.querySelector("#note-form");
const noteTitle = document.querySelector("#note-title");
const noteBody = document.querySelector("#note-body");
const characterCount = document.querySelector("#character-count");
const saveStatus = document.querySelector("#save-status");

let tasks = readJson(TASKS_KEY, []);
let activeFilter = "all";

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function visibleTasks() {
  if (activeFilter === "open") return tasks.filter((task) => !task.done);
  if (activeFilter === "done") return tasks.filter((task) => task.done);
  return tasks;
}

function renderTasks() {
  const visible = visibleTasks();
  const openCount = tasks.filter((task) => !task.done).length;
  taskCount.textContent = `${openCount} open`;
  emptyState.classList.toggle("is-hidden", visible.length > 0);
  taskList.innerHTML = visible.map((task) => `
    <li class="task-item ${task.done ? "is-done" : ""}">
      <label>
        <input type="checkbox" data-toggle="${task.id}" ${task.done ? "checked" : ""} aria-label="Mark ${escapeHtml(task.text)} complete" />
        <span>${escapeHtml(task.text)}</span>
      </label>
      <button class="delete-task" type="button" data-delete="${task.id}" aria-label="Delete ${escapeHtml(task.text)}">×</button>
    </li>
  `).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.unshift({ id: makeId(), text, done: false });
  writeJson(TASKS_KEY, tasks);
  taskInput.value = "";
  taskInput.focus();
  renderTasks();
});

taskList.addEventListener("change", (event) => {
  const id = event.target.dataset.toggle;
  if (!id) return;
  tasks = tasks.map((task) => task.id === id ? { ...task, done: event.target.checked } : task);
  writeJson(TASKS_KEY, tasks);
  renderTasks();
});

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  tasks = tasks.filter((task) => task.id !== button.dataset.delete);
  writeJson(TASKS_KEY, tasks);
  renderTasks();
});

filterButtons.forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.filter)));

const savedNote = readJson(NOTE_KEY, { title: "", body: "" });
noteTitle.value = savedNote.title;
noteBody.value = savedNote.body;

function updateCharacterCount() {
  characterCount.textContent = `${noteBody.value.length} / 600`;
}

noteBody.addEventListener("input", updateCharacterCount);
noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  writeJson(NOTE_KEY, { title: noteTitle.value.trim(), body: noteBody.value.trim() });
  saveStatus.textContent = "Saved locally";
  window.setTimeout(() => { saveStatus.textContent = "Local only"; }, 1800);
});

updateCharacterCount();
renderTasks();
