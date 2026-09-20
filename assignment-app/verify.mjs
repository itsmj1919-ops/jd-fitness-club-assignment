import { readFile } from "node:fs/promises";

const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const css = await readFile(new URL("./style.css", import.meta.url), "utf8");
const js = await readFile(new URL("./script.js", import.meta.url), "utf8");

const requiredHtml = ["task-form", "task-list", "note-form", "JD Fitness Club"];
const requiredCss = ["prefers-reduced-motion", "@media", "--cobalt"];
const requiredJs = ["addEventListener", "TASKS_KEY", "NOTE_KEY", "localStorage", "renderTasks"];

for (const token of requiredHtml) if (!html.includes(token)) throw new Error(`Missing HTML token: ${token}`);
for (const token of requiredCss) if (!css.includes(token)) throw new Error(`Missing CSS token: ${token}`);
for (const token of requiredJs) if (!js.includes(token)) throw new Error(`Missing JavaScript token: ${token}`);

console.log("Assignment app verification passed: structure, responsive styles, motion fallback, and localStorage logic are present.");
