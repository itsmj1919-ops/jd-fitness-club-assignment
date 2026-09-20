/**
 * JD Fitness Club: adapted from a 21st.dev command-palette interaction pattern, restyled as architectural wayfinding.
 */
import { Command, CornerDownLeft, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";

const commands = [
  { label: "Enter the JD Fitness Club", hint: "The training world, rooms, and arrival hall", href: "/", keywords: "home world arrival JD Fitness Club" },
  { label: "Find a program", hint: "Foundation, strength, capacity, and restore", href: "/programs", keywords: "build strength conditioning training practice session" },
  { label: "Meet a coach", hint: "Find a guide for your starting point", href: "/coaches", keywords: "coaching help trainer introduction" },
  { label: "Understand membership", hint: "The house folio and membership rhythm", href: "/membership", keywords: "pricing plan membership club access" },
  { label: "Read the journal", hint: "Notes from the practice and recovery library", href: "/journal", keywords: "article notes recovery read library" },
  { label: "Plan a visit", hint: "Begin with a conversation and visit planner", href: "/visit", keywords: "book visit location schedule introduction" },
];

export function AtlasCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = commands.filter((item) => `${item.label} ${item.hint} ${item.keywords}`.toLowerCase().includes(term));
    if (term) return filtered;
    return [...filtered].sort((a, b) => recent.indexOf(a.href) - recent.indexOf(b.href));
  }, [query, recent]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen((value) => !value); }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);
  useEffect(() => { if (open) { setSelected(0); requestAnimationFrame(() => inputRef.current?.focus()); } }, [open, query]);
  useEffect(() => { try { const stored = window.localStorage.getItem("atlas-recent-routes"); if (stored) setRecent(JSON.parse(stored)); } catch { /* Local recents are optional. */ } }, []);
  const go = (href: string) => { const next = [href, ...recent.filter((item) => item !== href)].slice(0, 3); try { window.localStorage.setItem("atlas-recent-routes", JSON.stringify(next)); } catch { /* Persistence is optional. */ } setRecent(next); setLocation(href); setQuery(""); setOpen(false); };
  const handleKeys = (event: React.KeyboardEvent<HTMLInputElement>) => { if (!matches.length) return; if (event.key === "ArrowDown") { event.preventDefault(); setSelected((value) => (value + 1) % matches.length); } if (event.key === "ArrowUp") { event.preventDefault(); setSelected((value) => (value - 1 + matches.length) % matches.length); } if (event.key === "Enter") { event.preventDefault(); go(matches[selected]?.href ?? matches[0].href); } };
  return <>
    <button className="atlas-command-trigger" onClick={() => setOpen(true)} aria-label="Open JD Fitness Club navigation search"><Search size={15} /><span>Find your practice</span><kbd><Command size={12} />K</kbd></button>
    {open && <div className="atlas-command-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
      <section className="atlas-command" role="dialog" aria-modal="true" aria-label="JD Fitness Club navigation search" onMouseDown={(event) => event.stopPropagation()}>
        <div className="atlas-command-input"><Search size={17} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleKeys} placeholder="Programs, coaches, membership…" aria-label="Search the JD Fitness Club" aria-activedescendant={matches[selected] ? `atlas-command-${matches[selected].href.replace("/", "root")}` : undefined} /><kbd>ESC</kbd></div>
        <p className="atlas-command-label"><Sparkles size={13} /> {query ? "Matched rooms and routes" : recent.length ? "Recent paths" : "Navigate the house"}</p>
        <div className="atlas-command-results">{matches.length ? matches.map((item, index) => <button id={`atlas-command-${item.href.replace("/", "root")}`} className={selected === index ? "command-selected" : ""} key={item.href} onMouseEnter={() => setSelected(index)} onClick={() => go(item.href)}><span className="command-index">0{index + 1}</span><span><b>{item.label}</b><small>{item.hint}</small></span><CornerDownLeft size={15} /></button>) : <p className="atlas-command-empty">No route found. Try “programs” or “visit.”</p>}</div>
      </section>
    </div>}
  </>;
}
