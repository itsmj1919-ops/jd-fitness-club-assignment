import { describe, expect, it } from "vitest";

const projectTitle = process.env.VITE_APP_TITLE ?? "JD Fitness Club";

describe("JD Fitness Club project title", () => {
  it("is served by the active app shell", async () => {
    const response = await fetch("http://127.0.0.1:3000/", {
      headers: { "x-project-title": projectTitle },
    });

    expect(response.ok).toBe(true);
    expect(await response.text()).toContain(`<title>${projectTitle} —`);
  });
});
