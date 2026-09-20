import { Captions, CaptionsOff, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const tourVideo = "/manus-storage/atlas-house-tour_7d57278d.mp4";
const tourAmbientAudio = "/manus-storage/atlas-house-tour-ambient_0a38e4a6.mp3";
const tourCaptions = "/manus-storage/atlas-house-tour-captions_955ae840.vtt";
const tourPoster = "/manus-storage/atlas-world-training-hall_62b4c288.jpg";
const captionsPreferenceKey = "atlas-house-tour-captions";
const ambientPreferenceKey = "atlas-house-tour-ambient";

const tourCaptionCues = [
  { start: 0, end: 1.5, text: "[Soft architectural room tone]\nJD FITNESS CLUB — HOUSE TOUR" },
  { start: 1.5, end: 3.2, text: "ENTER JD FITNESS CLUB" },
  { start: 3.2, end: 4.45, text: "01  TRAINING FLOOR\n[Distant, restrained equipment resonance]" },
  { start: 4.45, end: 5.65, text: "02  COACHING ROOM" },
  { start: 5.65, end: 6.75, text: "03  MEMBER HOUSE" },
  { start: 6.75, end: 8, text: "04  RECOVERY LIBRARY\n[Ambient room tone recedes]" },
] as const;

export function getAtlasTourMotionAllowed(prefersReducedMotion: boolean, motionOptIn: boolean) {
  return !prefersReducedMotion || motionOptIn;
}

export function getAtlasTourControlLabel(motionAllowed: boolean, isPlaying: boolean) {
  return motionAllowed && isPlaying ? "Pause house tour" : "Play house tour";
}

export function getAtlasTourCaptionLabel(captionsEnabled: boolean) {
  return captionsEnabled ? "Hide captions" : "Show captions";
}

export function getAtlasTourSoundLabel(ambientEnabled: boolean) {
  return ambientEnabled ? "Mute ambient sound" : "Play ambient sound";
}

export function getAtlasTourCaptionCue(currentTime: number) {
  return tourCaptionCues.find((cue) => currentTime >= cue.start && currentTime < cue.end)?.text ?? "";
}

export function shouldPlayAtlasTourAmbient({ motionAllowed, isPlaying, isVisible, ambientEnabled }: { motionAllowed: boolean; isPlaying: boolean; isVisible: boolean; ambientEnabled: boolean }) {
  return motionAllowed && isPlaying && isVisible && ambientEnabled;
}

export function getAtlasTourMediaStatus({ motionAllowed, isPlaying, captionsEnabled, ambientEnabled, ambientShouldPlay }: { motionAllowed: boolean; isPlaying: boolean; captionsEnabled: boolean; ambientEnabled: boolean; ambientShouldPlay: boolean }) {
  if (!motionAllowed) return "Still frame shown. Motion and ambient sound are off to respect your device preference.";
  if (ambientShouldPlay) return "Ambient sound is on. Captions describe the room tone and tour sequence.";
  if (ambientEnabled && !isPlaying) return "Ambient sound is enabled and will resume when the Tour plays.";
  if (captionsEnabled) return "Captions are on. Ambient sound remains off until you choose to play it.";
  return "Captions and ambient sound are off.";
}

export function AtlasHouseTour() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [motionOptIn, setMotionOptIn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [activeCaption, setActiveCaption] = useState<string>(tourCaptionCues[0].text);
  const motionAllowed = getAtlasTourMotionAllowed(prefersReducedMotion, motionOptIn);
  const controlLabel = getAtlasTourControlLabel(motionAllowed, isPlaying);
  const ambientShouldPlay = shouldPlayAtlasTourAmbient({ motionAllowed, isPlaying, isVisible, ambientEnabled });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(query.matches);
      if (query.matches) {
        setMotionOptIn(false);
        setAmbientEnabled(false);
      }
    };
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    try {
      setCaptionsEnabled(window.localStorage.getItem(captionsPreferenceKey) !== "false");
      setAmbientEnabled(window.localStorage.getItem(ambientPreferenceKey) === "true");
    } catch {
      // Local presentation preferences are optional; playback must work without storage access.
    } finally {
      setPreferencesReady(true);
    }
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      window.localStorage.setItem(captionsPreferenceKey, String(captionsEnabled));
      window.localStorage.setItem(ambientPreferenceKey, String(ambientEnabled));
    } catch {
      // Privacy settings or browser storage availability must not interrupt media controls.
    }
  }, [ambientEnabled, captionsEnabled, preferencesReady]);

  useEffect(() => {
    if (!motionAllowed) {
      videoRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [motionAllowed]);

  useEffect(() => {
    const track = videoRef.current?.textTracks[0];
    if (track) track.mode = "hidden";
    setActiveCaption(captionsEnabled ? getAtlasTourCaptionCue(videoRef.current?.currentTime ?? 0) : "");
  }, [captionsEnabled, motionAllowed]);

  useEffect(() => {
    const ambient = ambientRef.current;
    const video = videoRef.current;
    if (!ambient) return;
    if (!ambientShouldPlay) {
      ambient.pause();
      return;
    }
    if (video && Math.abs(ambient.currentTime - video.currentTime) > 0.15) ambient.currentTime = video.currentTime;
    ambient.play().catch((error: unknown) => {
      if (!(error instanceof DOMException) || error.name !== "AbortError") setAmbientEnabled(false);
    });
  }, [ambientShouldPlay]);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (!entry.isIntersecting) {
        videoRef.current?.pause();
        ambientRef.current?.pause();
        setIsPlaying(false);
      }
    }, { threshold: 0.18 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const syncTourTime = () => {
    const video = videoRef.current;
    const ambient = ambientRef.current;
    if (!video) return;
    setActiveCaption(captionsEnabled ? getAtlasTourCaptionCue(video.currentTime) : "");
    if (ambient && Math.abs(ambient.currentTime - video.currentTime) > 0.15) ambient.currentTime = video.currentTime;
  };

  const togglePlayback = () => {
    if (!motionAllowed) {
      setMotionOptIn(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleAmbient = () => {
    if (!motionAllowed) return;
    const next = !ambientEnabled;
    const ambient = ambientRef.current;
    const video = videoRef.current;
    if (!next) {
      ambient?.pause();
      setAmbientEnabled(false);
      return;
    }
    setAmbientEnabled(true);
    if (!ambient || !video || !isPlaying) return;
    if (Math.abs(ambient.currentTime - video.currentTime) > 0.15) ambient.currentTime = video.currentTime;
    ambient.play().catch((error: unknown) => {
      if (!(error instanceof DOMException) || error.name !== "AbortError") setAmbientEnabled(false);
    });
  };

  const mediaStatus = getAtlasTourMediaStatus({ motionAllowed, isPlaying, captionsEnabled, ambientEnabled, ambientShouldPlay });

  return <section id="atlas-house-tour" className="atlas-house-tour" ref={sectionRef} aria-labelledby="atlas-house-tour-title"><div className="atlas-tour-intro"><p className="eyebrow">JD Fitness Club / film 01</p><h2 id="atlas-house-tour-title">Move through the rooms.</h2><p>Eight seconds inside the house: the Training Floor, Coaching Room, Member House, and Recovery Library, arranged as one considered rhythm.</p><div className="atlas-tour-controls" aria-label="JD Fitness Club Tour media controls"><button type="button" onClick={togglePlayback} aria-pressed={motionAllowed && isPlaying}>{motionAllowed && isPlaying ? <Pause size={16} /> : <Play size={16} />}{controlLabel}</button><button type="button" onClick={() => setCaptionsEnabled((value) => !value)} aria-pressed={captionsEnabled} disabled={!motionAllowed}>{captionsEnabled ? <Captions size={16} /> : <CaptionsOff size={16} />}{getAtlasTourCaptionLabel(captionsEnabled)}</button><button type="button" onClick={toggleAmbient} aria-pressed={ambientEnabled} disabled={!motionAllowed}>{ambientEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}{getAtlasTourSoundLabel(ambientEnabled)}</button></div><p className="atlas-tour-note" role="status" aria-live="polite">{mediaStatus}</p></div><figure className="atlas-tour-frame">{motionAllowed ? <><video ref={videoRef} muted playsInline loop preload="metadata" poster={tourPoster} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={syncTourTime} onSeeking={syncTourTime}><source src={tourVideo} type="video/mp4" /><track kind="captions" src={tourCaptions} srcLang="en" label="English captions" /></video><audio ref={ambientRef} preload="metadata" loop><source src={tourAmbientAudio} type="audio/mpeg" /></audio>{captionsEnabled && activeCaption ? <p className="atlas-tour-caption" aria-live="polite">{activeCaption}</p> : null}</> : <img src={tourPoster} alt="The calm central aisle of the JD Fitness Club training floor" />}<div className="atlas-tour-film" aria-hidden="true" /><figcaption><span>40° 44′ N — 73° 59′ W</span><span>JD Fitness Club / House Tour</span></figcaption></figure></section>;
}
