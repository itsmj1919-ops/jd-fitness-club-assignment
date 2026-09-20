import { describe, expect, it } from "vitest";

const baseUrl = "http://127.0.0.1:3000";

describe("JD Fitness Club launch metadata", () => {
  it("serves branded SEO and social metadata from the app shell", async () => {
    const response = await fetch(`${baseUrl}/`);
    const html = await response.text();

    expect(response.ok).toBe(true);
    expect(html).toContain("<title>JD Fitness Club — A Better Room for the Work That Matters</title>");
    expect(html).toContain('name="description"');
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('property="og:image" content="/manus-storage/jd-fitness-club-og_04d06c07.png"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('/manus-storage/jd-fitness-club-favicon_bcbb1615.png');
  });

  it("serves the manifest and crawler policy", async () => {
    const [manifest, robots] = await Promise.all([
      fetch(`${baseUrl}/site.webmanifest`),
      fetch(`${baseUrl}/robots.txt`),
    ]);

    const manifestText = await manifest.text();
    const robotsText = await robots.text();

    expect(manifest.ok).toBe(true);
    expect(manifestText).toContain('"name": "JD Fitness Club"');
    expect(robots.ok).toBe(true);
    expect(robotsText).toContain("User-agent: *");
    expect(robotsText).toContain("Allow: /");
  });
});
