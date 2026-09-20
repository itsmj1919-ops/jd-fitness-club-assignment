import { describe, expect, it } from "vitest";
import { getAtlasTourCaptionCue, getAtlasTourCaptionLabel, getAtlasTourControlLabel, getAtlasTourMediaStatus, getAtlasTourMotionAllowed, getAtlasTourSoundLabel, shouldPlayAtlasTourAmbient } from "./AtlasHouseTour";

describe("JD Fitness Club Tour motion preferences", () => {
  it("uses the still frame when reduced motion is preferred without an explicit opt-in", () => {
    expect(getAtlasTourMotionAllowed(true, false)).toBe(false);
  });

  it("allows a visitor to explicitly opt into motion and exposes accurate controls", () => {
    expect(getAtlasTourMotionAllowed(true, true)).toBe(true);
    expect(getAtlasTourControlLabel(true, true)).toBe("Pause house tour");
    expect(getAtlasTourControlLabel(true, false)).toBe("Play house tour");
  });
});

describe("JD Fitness Club Tour captions and ambient sound", () => {
  it("uses explicit labels for caption and sound states", () => {
    expect(getAtlasTourCaptionLabel(true)).toBe("Hide captions");
    expect(getAtlasTourCaptionLabel(false)).toBe("Show captions");
    expect(getAtlasTourSoundLabel(true)).toBe("Mute ambient sound");
    expect(getAtlasTourSoundLabel(false)).toBe("Play ambient sound");
  });

  it("maps the Tour timeline to meaningful caption cues", () => {
    expect(getAtlasTourCaptionCue(0)).toContain("Soft architectural room tone");
    expect(getAtlasTourCaptionCue(1.6)).toBe("ENTER JD FITNESS CLUB");
    expect(getAtlasTourCaptionCue(3.5)).toContain("TRAINING FLOOR");
    expect(getAtlasTourCaptionCue(7.4)).toContain("RECOVERY LIBRARY");
    expect(getAtlasTourCaptionCue(8)).toBe("");
  });

  it("plays ambient sound only during visible, opted-in Tour playback", () => {
    expect(shouldPlayAtlasTourAmbient({ motionAllowed: true, isPlaying: true, isVisible: true, ambientEnabled: true })).toBe(true);
    expect(shouldPlayAtlasTourAmbient({ motionAllowed: false, isPlaying: true, isVisible: true, ambientEnabled: true })).toBe(false);
    expect(shouldPlayAtlasTourAmbient({ motionAllowed: true, isPlaying: false, isVisible: true, ambientEnabled: true })).toBe(false);
    expect(shouldPlayAtlasTourAmbient({ motionAllowed: true, isPlaying: true, isVisible: false, ambientEnabled: true })).toBe(false);
    expect(shouldPlayAtlasTourAmbient({ motionAllowed: true, isPlaying: true, isVisible: true, ambientEnabled: false })).toBe(false);
  });

  it("distinguishes active sound from a sound preference waiting for Tour playback", () => {
    expect(getAtlasTourMediaStatus({ motionAllowed: true, isPlaying: false, captionsEnabled: true, ambientEnabled: true, ambientShouldPlay: false })).toBe("Ambient sound is enabled and will resume when the Tour plays.");
    expect(getAtlasTourMediaStatus({ motionAllowed: true, isPlaying: true, captionsEnabled: true, ambientEnabled: true, ambientShouldPlay: true })).toBe("Ambient sound is on. Captions describe the room tone and tour sequence.");
    expect(getAtlasTourMediaStatus({ motionAllowed: false, isPlaying: false, captionsEnabled: true, ambientEnabled: false, ambientShouldPlay: false })).toBe("Still frame shown. Motion and ambient sound are off to respect your device preference.");
  });
});
