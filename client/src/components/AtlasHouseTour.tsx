import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const tourVideo = "/manus-storage/atlas-house-tour_7d57278d.mp4";
const tourPoster = "/manus-storage/atlas-world-training-hall_62b4c288.jpg";

export function getAtlasTourMotionAllowed(prefersReducedMotion: boolean, motionOptIn: boolean) {
  return !prefersReducedMotion || motionOptIn;
}

export function getAtlasTourControlLabel(motionAllowed: boolean, isPlaying: boolean) {
  return motionAllowed && isPlaying ? "Pause house tour" : "Play house tour";
}

export function AtlasHouseTour() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [motionOptIn, setMotionOptIn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const motionAllowed = getAtlasTourMotionAllowed(prefersReducedMotion, motionOptIn);
  const controlLabel = getAtlasTourControlLabel(motionAllowed, isPlaying);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(query.matches);
      if (query.matches) setMotionOptIn(false);
    };
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!motionAllowed) {
      setIsPlaying(false);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [motionAllowed]);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }, { threshold: 0.18 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const togglePlayback = () => {
    if (!motionAllowed) {
      setMotionOptIn(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return <section className="atlas-house-tour" ref={sectionRef} aria-labelledby="atlas-house-tour-title"><div className="atlas-tour-intro"><p className="eyebrow">Atlas House / film 01</p><h2 id="atlas-house-tour-title">Move through the rooms.</h2><p>Eight seconds inside the house: the Training Floor, Coaching Room, Member House, and Recovery Library, arranged as one considered rhythm.</p><button type="button" onClick={togglePlayback} aria-pressed={motionAllowed && isPlaying}>{motionAllowed && isPlaying ? <Pause size={15} /> : <Play size={15} />}{controlLabel}</button><p className="atlas-tour-note" aria-live="polite">{prefersReducedMotion && !motionOptIn ? "Still frame shown. Motion is off to respect your device preference." : "Muted motion study. Playback pauses when this section leaves view."}</p></div><figure className="atlas-tour-frame">{motionAllowed ? <video ref={videoRef} muted playsInline loop preload="metadata" poster={tourPoster} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}><source src={tourVideo} type="video/mp4" /></video> : <img src={tourPoster} alt="The calm central aisle of the Performance Atlas training floor" />}<div className="atlas-tour-film" aria-hidden="true" /><figcaption><span>40° 44′ N — 73° 59′ W</span><span>Performance Atlas / House Tour</span></figcaption></figure></section>;
}
