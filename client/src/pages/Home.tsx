/**
 * Design philosophy: Brutalist Field Console — make design intelligence observable through
 * asymmetry, sharp contrast, instrument labels, and responsive evidence-rich interactions.
 */
import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  ChevronRight,
  Command,
  CommandIcon,
  Compass,
  Copy,
  Crosshair,
  Gauge,
  Layers3,
  Menu,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Type,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

const heroImage = "/manus-storage/uupm-hero-lab_537e6f02.jpg";
const archiveImage = "/manus-storage/uupm-component-archive_bef0f205.jpg";
const geometryImage = "/manus-storage/uupm-signal-geometry_e0cab89a.jpg";
const brandMark = "/manus-storage/uupm-mark_ddd4fee9.png";

type SignalKey = "all" | "style" | "a11y" | "stack" | "mcp";

const sections = [
  { id: "brief", label: "Brief", index: "01" },
  { id: "signals", label: "Signals", index: "02" },
  { id: "workbench", label: "Workbench", index: "03" },
  { id: "mcp", label: "MCP bench", index: "04" },
];

const intelligenceCards = [
  { value: "79", label: "searchable styles", note: "50 active families", color: "bg-[var(--signal)]" },
  { value: "192", label: "product palettes", note: "with reasoning profiles", color: "bg-[var(--cyan)]" },
  { value: "74", label: "font pairings", note: "mood + product fit", color: "bg-[var(--ink)]" },
  { value: "119", label: "UX guidelines", note: "prioritized checks", color: "bg-[var(--orange)]" },
];

const recommendations = [
  {
    type: "style" as SignalKey,
    tag: "STYLE",
    title: "Brutalism, disciplined",
    description: "Use visible rules, sharp corners, and oversized type—but preserve a clear focus state and readable density.",
    action: "Visual system",
    icon: Palette,
    accent: "var(--signal)",
  },
  {
    type: "a11y" as SignalKey,
    tag: "A11Y",
    title: "Focus cannot be incidental",
    description: "Every control needs a visible keyboard indicator, including the command layer and the compact mobile rail.",
    action: "Interaction audit",
    icon: ShieldCheck,
    accent: "var(--cyan)",
  },
  {
    type: "stack" as SignalKey,
    tag: "REACT",
    title: "Stabilize input references",
    description: "Keep interactive lookup inputs memoized or state-backed so UI search does not loop or recreate work on render.",
    action: "Stack guidance",
    icon: Braces,
    accent: "var(--ink)",
  },
  {
    type: "mcp" as SignalKey,
    tag: "MCP",
    title: "Compare before committing",
    description: "Use component discovery to inspect patterns, then adapt the interaction to your existing tokens and conventions.",
    action: "Component research",
    icon: Layers3,
    accent: "var(--orange)",
  },
];

const components = [
  { name: "Command Palette", id: "#2075", author: "rafa-porto", detail: "Keyboard-led search and action layer", tone: "violet" },
  { name: "Command Menu", id: "#4430", author: "preetsuthar17", detail: "Fast navigation and shortcut patterns", tone: "cyan" },
  { name: "BeUI Command Palette", id: "#16253", author: "saurabh10102", detail: "A refined command interaction variant", tone: "ink" },
];

const prompts = [
  "AI design intelligence interactive product dashboard",
  "Developer tool with accessible data density",
  "Editorial portfolio with a decisive visual system",
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [signal, setSignal] = useState<SignalKey>("all");
  const [promptIndex, setPromptIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [synthesized, setSynthesized] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredCards = useMemo(() => {
    const filteredBySignal = signal === "all" ? recommendations : recommendations.filter((card) => card.type === signal);
    if (!query.trim()) return filteredBySignal;
    const term = query.toLowerCase();
    return filteredBySignal.filter((card) => `${card.title} ${card.description} ${card.tag}`.toLowerCase().includes(term));
  }, [query, signal]);

  const runSynthesis = () => {
    setSynthesized(true);
    toast.success("Design system synthesized", {
      description: "Pattern, palette, typography, and guardrails have been refreshed for this brief.",
    });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompts[promptIndex]);
      toast.success("Prompt copied", { description: "Paste it into a UI/UX Pro Max design-system query." });
    } catch {
      toast.message("Copy unavailable", { description: "Select the prompt text manually in this demo." });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--paper)] text-[var(--ink)]">
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Jump to a field station…" />
        <CommandList>
          <CommandEmpty>No field station found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {sections.map((section) => (
              <CommandItem
                key={section.id}
                value={section.label}
                onSelect={() => {
                  scrollToSection(section.id);
                  setCommandOpen(false);
                }}
              >
                <Crosshair className="mr-2 size-4 text-[var(--signal)]" />
                <span>{section.label}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">{section.index}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { runSynthesis(); setCommandOpen(false); }}>
              <WandSparkles className="mr-2 size-4 text-[var(--cyan)]" />
              Synthesize a design system
            </CommandItem>
            <CommandItem onSelect={() => { setSignal("a11y"); scrollToSection("workbench"); setCommandOpen(false); }}>
              <Accessibility className="mr-2 size-4 text-[var(--orange)]" />
              Inspect accessibility signals
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="grain-pointer fixed inset-0 z-50 pointer-events-none" />

      <header className="sticky top-0 z-40 border-b-2 border-[var(--ink)] bg-[var(--paper)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#brief" className="flex items-center gap-3" aria-label="UI/UX Pro Max field console home">
            <img src={brandMark} alt="" className="size-9 object-contain" />
            <div className="leading-[0.82] tracking-[-0.06em]">
              <div className="font-display text-[17px] font-bold">UI/UX</div>
              <div className="font-display text-[17px] font-bold text-[var(--signal)]">PRO MAX</div>
            </div>
          </a>
          <div className="hidden items-center gap-5 md:flex">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">FIELD CONSOLE / V2.13</span>
            <button onClick={() => setCommandOpen(true)} className="command-trigger" aria-label="Open command palette">
              <Search className="size-4" />
              <span>Navigate</span>
              <kbd>⌘ K</kbd>
            </button>
          </div>
          <button className="grid size-10 place-items-center border-2 border-[var(--ink)] md:hidden" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation">
            {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {mobileNavOpen && (
          <nav className="border-t-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-4 md:hidden">
            <div className="grid gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => { scrollToSection(section.id); setMobileNavOpen(false); }}
                  className="flex items-center justify-between border-2 border-[var(--ink)] bg-white px-3 py-3 text-left font-display font-semibold"
                >
                  {section.label}<span className="font-mono text-xs text-[var(--signal)]">{section.index}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[178px_minmax(0,1fr)]">
        <aside className="hidden border-r-2 border-[var(--ink)] lg:block">
          <nav className="sticky top-16 min-h-[calc(100vh-4rem)] px-4 py-7">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">Field stations</p>
            <div className="space-y-1">
              {sections.map((section) => (
                <a className="rail-link" key={section.id} href={`#${section.id}`}>
                  <span className="font-mono text-[10px] text-[var(--signal)]">{section.index}</span>
                  <span>{section.label}</span>
                </a>
              ))}
            </div>
            <div className="absolute bottom-8 left-4 right-4 border-t-2 border-[var(--ink)] pt-4">
              <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-muted)]"><span className="status-dot" /> System verified</div>
              <p className="text-xs leading-relaxed text-[var(--ink-muted)]">Build-time evidence, live interface exploration.</p>
            </div>
          </nav>
        </aside>

        <main>
          <section id="brief" className="relative border-b-2 border-[var(--ink)] px-4 py-9 sm:px-6 lg:px-10 lg:py-12">
            <div className="absolute right-6 top-5 hidden font-mono text-[10px] tracking-[0.18em] text-[var(--ink-muted)] xl:block">COORD / 37.77° N, 122.41° W</div>
            <div className="mb-7 flex items-center gap-3">
              <Badge className="rounded-none border-0 bg-[var(--ink)] px-2 py-1 font-mono text-[10px] font-medium tracking-[0.14em] text-white">DESIGN INTELLIGENCE</Badge>
              <span className="h-px w-12 bg-[var(--ink)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">Query → evidence → interface</span>
            </div>
            <div className="grid items-end gap-8 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="max-w-3xl">
                <h1 className="font-display text-[clamp(3.2rem,7.7vw,7.6rem)] font-bold leading-[0.82] tracking-[-0.085em]">
                  Scan the<br />evidence.<br /><span className="text-[var(--signal)]">Keep the taste.</span>
                </h1>
                <p className="mt-7 max-w-xl text-base leading-7 text-[var(--ink-muted)] sm:text-lg">
                  UI/UX Pro Max turns an unformed product brief into a considered visual direction, then pressure-tests the result against usability, accessibility, and stack-specific implementation guidance.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button onClick={() => scrollToSection("workbench")} className="field-button bg-[var(--signal)] text-white hover:bg-[var(--ink)]">
                    Open the workbench <ArrowRight className="size-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setCommandOpen(true)} className="field-button border-2 border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--cyan)]">
                    <Command className="size-4" /> Command layer
                  </Button>
                </div>
              </div>
              <div className="hero-frame group relative overflow-hidden border-2 border-[var(--ink)] bg-[var(--ink)] shadow-[8px_8px_0_var(--cyan)]">
                <img src={heroImage} alt="Abstract UI design research tabletop with modular interface artifacts" className="h-[320px] w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03] sm:h-[390px]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,27,75,0.7),transparent_62%)]" />
                <div className="absolute left-5 top-5 grid size-14 place-items-center border-2 border-white bg-[var(--signal)] font-display text-xl font-bold text-white">PX</div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-white/70 pt-3 text-white">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.16em] text-white/70">FIELD IMAGE / 001</p>
                    <p className="font-display text-lg font-semibold">A working interface, not a mood board.</p>
                  </div>
                  <ArrowUpRight className="size-5" />
                </div>
              </div>
            </div>
          </section>

          <section id="signals" className="border-b-2 border-[var(--ink)]">
            <div className="section-heading px-4 py-5 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3"><span className="station-index">02</span><h2>Signal inventory</h2></div>
              <p>Local design evidence, made searchable.</p>
            </div>
            <div className="grid divide-y-2 divide-[var(--ink)] border-t-2 border-[var(--ink)] sm:grid-cols-2 sm:divide-x-2 sm:divide-y-0 xl:grid-cols-4">
              {intelligenceCards.map((item) => (
                <article key={item.label} className="relative min-h-48 overflow-hidden bg-white px-5 py-5 transition hover:bg-[var(--paper-deep)] sm:px-6">
                  <span className={`absolute right-0 top-0 h-3 w-16 ${item.color}`} />
                  <p className="font-display text-5xl font-bold tracking-[-0.07em]">{item.value}</p>
                  <p className="mt-2 font-display text-lg font-semibold leading-none">{item.label}</p>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">{item.note}</p>
                </article>
              ))}
            </div>
            <div className="grid gap-0 border-t-2 border-[var(--ink)] xl:grid-cols-[1fr_0.9fr]">
              <div className="relative min-h-[320px] overflow-hidden border-b-2 border-[var(--ink)] xl:border-b-0 xl:border-r-2">
                <img src={geometryImage} alt="Abstract violet and cyan research grid geometry" className="absolute inset-0 h-full w-full object-cover opacity-95" />
                <div className="absolute inset-0 bg-[rgba(250,245,255,0.17)]" />
                <div className="relative flex min-h-[320px] max-w-md flex-col justify-end p-6 sm:p-8">
                  <Badge className="mb-3 w-fit rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] font-mono text-[10px] tracking-[0.15em] text-[var(--ink)]">PRIORITY STACK</Badge>
                  <p className="font-display text-3xl font-bold leading-[0.94] tracking-[-0.06em]">Accessibility first. Then touch, performance, layout, and color.</p>
                </div>
              </div>
              <div className="bg-[var(--ink)] p-6 text-white sm:p-8">
                <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[0.16em] text-white/60">QUALITY GATE / A11Y</p><h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.05em]">The non-negotiables</h3></div><ShieldCheck className="size-8 text-[var(--cyan)]" /></div>
                <div className="mt-8 space-y-4">
                  {["Visible focus rings", "44 × 44px touch targets", "4.5:1 text contrast", "Reduced-motion fallbacks"].map((check, index) => (
                    <div className="flex items-center gap-3 border-b border-white/20 pb-3" key={check}><span className="grid size-6 place-items-center bg-[var(--cyan)] font-mono text-[10px] text-[var(--ink)]">0{index + 1}</span><span className="font-medium">{check}</span><Check className="ml-auto size-4 text-[var(--cyan)]" /></div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="workbench" className="border-b-2 border-[var(--ink)] px-4 py-9 sm:px-6 lg:px-10 lg:py-12">
            <div className="section-heading mb-8">
              <div className="flex items-center gap-3"><span className="station-index">03</span><h2>Design-system workbench</h2></div>
              <p>Prompt a direction. Test its edges.</p>
            </div>
            <div className="grid gap-7 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
              <div className="border-2 border-[var(--ink)] bg-white p-5 shadow-[6px_6px_0_var(--ink)] sm:p-7">
                <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">01 / DEFINE</p><h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.06em]">A useful query is brief, specific, and constrained.</h3></div><SquareTerminal className="size-6 text-[var(--signal)]" /></div>
                <div className="mt-7">
                  <label htmlFor="design-brief" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">Product brief</label>
                  <div className="relative"><Input id="design-brief" value={prompts[promptIndex]} readOnly className="h-auto min-h-24 rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-4 pr-14 font-mono text-xs leading-5 text-[var(--ink)] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]" /><button onClick={copyPrompt} className="absolute right-3 top-3 grid size-8 place-items-center border border-[var(--ink)] bg-white hover:bg-[var(--cyan)]" aria-label="Copy product brief"><Copy className="size-4" /></button></div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {prompts.map((prompt, index) => (
                    <button key={prompt} onClick={() => { setPromptIndex(index); setSynthesized(false); }} className={`brief-chip ${promptIndex === index ? "brief-chip-active" : ""}`}>Brief 0{index + 1}</button>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button onClick={runSynthesis} className="field-button bg-[var(--ink)] text-white hover:bg-[var(--signal)]"><WandSparkles className="size-4" /> Synthesize system</Button>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-muted)]">variance 8 / motion 4 / density 7</span>
                </div>
              </div>

              <div className={`relative overflow-hidden border-2 border-[var(--ink)] p-5 transition-colors sm:p-7 ${synthesized ? "bg-[var(--cyan)]" : "bg-[var(--paper-deep)]"}`}>
                <div className="relative z-10"><div className="flex items-start justify-between"><div><p className="eyebrow">02 / SYNTHESIZE</p><h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.06em]">{synthesized ? "Direction locked" : "Resolved direction"}</h3></div><Gauge className="size-6" /></div>
                <div className="mt-7 grid gap-3 text-sm">
                  <div className="result-line"><span>Pattern</span><strong>Product demo + features</strong></div>
                  <div className="result-line"><span>Visual family</span><strong>Disciplined brutalism</strong></div>
                  <div className="result-line"><span>Type system</span><strong>Space Grotesk / DM Sans</strong></div>
                  <div className="result-line"><span>Signal colors</span><strong>Ultraviolet / cyan</strong></div>
                </div>
                <div className="mt-6 flex gap-1" aria-label="Palette preview"><span className="h-7 flex-1 bg-[var(--signal)]" /><span className="h-7 flex-1 bg-[var(--cyan)]" /><span className="h-7 flex-1 bg-[var(--ink)]" /><span className="h-7 flex-1 border border-[var(--ink)] bg-[var(--paper)]" /></div>
                </div><div className="absolute -bottom-14 -right-8 size-48 border-[20px] border-[var(--signal)] opacity-25" /></div>
            </div>

            <div className="mt-12 grid gap-7 xl:grid-cols-[0.78fr_1.22fr]">
              <div>
                <p className="eyebrow">03 / PRESSURE-TEST</p>
                <h3 className="mt-3 font-display text-4xl font-bold leading-[0.9] tracking-[-0.07em]">A recommendation should explain <em className="not-italic text-[var(--signal)]">why</em> it belongs.</h3>
                <div className="mt-7 border-l-4 border-[var(--cyan)] pl-4 text-sm leading-6 text-[var(--ink-muted)]">Use a focused domain query for a specific concern; do not let a broad style match pretend it solved an accessibility defect.</div>
              </div>
              <div className="border-2 border-[var(--ink)] bg-white p-4 sm:p-5">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-muted)]" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter the evidence…" className="h-10 rounded-none border-2 border-[var(--ink)] pl-9 font-mono text-xs shadow-none" /></div><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">{filteredCards.length} match{filteredCards.length === 1 ? "" : "es"}</span></div>
                <div className="mb-5 flex flex-wrap gap-2">{(["all", "style", "a11y", "stack", "mcp"] as SignalKey[]).map((item) => <button key={item} onClick={() => setSignal(item)} className={`signal-filter ${signal === item ? "signal-filter-active" : ""}`}>{item === "all" ? "ALL" : item.toUpperCase()}</button>)}</div>
                <div className="grid gap-3 md:grid-cols-2">{filteredCards.map((card) => { const Icon = card.icon; return <article key={card.tag} className="evidence-card"><div className="flex items-start justify-between gap-4"><span className="signal-tag" style={{ backgroundColor: card.accent }}>{card.tag}</span><Icon className="size-5" style={{ color: card.accent }} /></div><h4>{card.title}</h4><p>{card.description}</p><button onClick={() => toast.message(card.action, { description: `${card.tag} guidance selected in this interactive showcase.` })} className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] hover:text-[var(--signal)]">{card.action}<ChevronRight className="size-3" /></button></article>; })}</div>
              </div>
            </div>
          </section>

          <section id="mcp" className="relative overflow-hidden px-4 py-9 sm:px-6 lg:px-10 lg:py-12">
            <div className="absolute right-0 top-0 hidden h-full w-[36%] border-l-2 border-[var(--ink)] bg-[var(--paper-deep)] xl:block" />
            <div className="relative grid gap-10 xl:grid-cols-[1fr_0.78fr]">
              <div>
                <div className="section-heading"><div className="flex items-center gap-3"><span className="station-index">04</span><h2>21st.dev MCP bench</h2></div><p>Research components. Keep control.</p></div>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--ink-muted)]">The connected catalog was used during build to discover command-layer patterns and retrieve one implementation for review. This site translates the interaction model into its own design system instead of copying a generic component unchanged.</p>
                <div className="mt-8 grid gap-3">{components.map((component, index) => <article key={component.id} className="component-row"><div className={`component-count tone-${component.tone}`}>0{index + 1}</div><div><h3>{component.name}<span>{component.id}</span></h3><p>{component.detail}</p><small>Catalog discovery / {component.author}</small></div><button onClick={() => toast.message("Component reference selected", { description: `${component.name} is a build-time research reference in this showcase.` })} aria-label={`Inspect ${component.name}`}><ArrowUpRight className="size-5" /></button></article>)}</div>
                <div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => setCommandOpen(true)} className="field-button bg-[var(--ink)] text-white hover:bg-[var(--signal)]"><CommandIcon className="size-4" /> Try the command layer</Button><a className="inline-flex items-center gap-2 border-2 border-[var(--ink)] bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] hover:bg-[var(--cyan)]" href="https://21st.dev/" target="_blank" rel="noreferrer">Explore catalog <ArrowUpRight className="size-3" /></a></div>
              </div>
              <div className="relative border-2 border-[var(--ink)] bg-[var(--ink)] p-5 text-white shadow-[8px_8px_0_var(--signal)] sm:p-7">
                <img src={archiveImage} alt="Abstract modular component archive" className="mb-7 h-52 w-full border-2 border-white/40 object-cover sm:h-60" />
                <Badge className="rounded-none border-0 bg-[var(--cyan)] font-mono text-[10px] tracking-[0.14em] text-[var(--ink)]">MCP / VERIFIED</Badge>
                <h3 className="mt-4 font-display text-3xl font-bold leading-[0.92] tracking-[-0.07em]">Discover, inspect, adapt.</h3>
                <p className="mt-4 text-sm leading-6 text-white/70">A component catalog can accelerate exploration. The design system determines whether it feels like it belongs.</p>
                <div className="mt-7 border-t border-white/20 pt-4 font-mono text-[10px] uppercase tracking-[0.13em] text-white/60"><span className="mr-2 inline-block size-2 bg-[var(--cyan)]" /> HTTP connection confirmed during build</div>
              </div>
            </div>
          </section>

          <footer className="border-t-2 border-[var(--ink)] bg-[var(--ink)] px-4 py-7 text-white sm:px-6 lg:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="flex items-center gap-3"><img src={brandMark} alt="" className="size-9" /><p className="font-display text-xl font-bold tracking-[-0.05em]">Built to make the next interface decision sharper.</p></div><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">UI/UX PRO MAX · FIELD CONSOLE</div></div>
          </footer>
        </main>
      </div>
    </div>
  );
}
