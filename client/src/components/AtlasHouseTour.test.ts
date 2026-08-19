import { describe, expect, it } from "vitest";
import { getAtlasTourControlLabel, getAtlasTourMotionAllowed } from "./AtlasHouseTour";

describe("Atlas House Tour motion preferences", () => {
  it("uses the still frame when reduced motion is preferred without an explicit opt-in", () => {
    expect(getAtlasTourMotionAllowed(true, false)).toBe(false);
  });

  it("allows a visitor to explicitly opt into motion and exposes accurate controls", () => {
    expect(getAtlasTourMotionAllowed(true, true)).toBe(true);
    expect(getAtlasTourControlLabel(true, true)).toBe("Pause house tour");
    expect(getAtlasTourControlLabel(true, false)).toBe("Play house tour");
  });
});
