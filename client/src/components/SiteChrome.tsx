/**
 * Monumental Athletics: quiet-luxury hospitality, architectural spacing, and restrained cobalt detail.
 */
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { href: "/programs", label: "Programs" },
  { href: "/coaches", label: "Coaching" },
  { href: "/membership", label: "Membership" },
  { href: "/journal", label: "Journal" },
];

export function Wordmark({ light = false }: { light?: boolean }) {
  return <span className={`atlas-wordmark ${light ? "atlas-wordmark-light" : ""}`}><i aria-hidden="true" /><span>PERFORMANCE</span><b>ATLAS</b></span>;
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return <header className={`site-header ${overlay ? "site-header-overlay" : ""}`}>
    <div className="site-header-inner">
      <Link href="/" className="brand-link" aria-label="Performance Atlas home"><Wordmark light={overlay} /></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => <Link key={item.href} href={item.href} className={location === item.href ? "nav-active" : ""}>{item.label}</Link>)}
      </nav>
      <Link href="/visit" className={`visit-link ${overlay ? "visit-link-light" : ""}`}>Plan a visit <span aria-hidden="true">↗</span></Link>
      <button className={`mobile-menu ${overlay ? "mobile-menu-light" : ""}`} onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
    {open && <div className="mobile-panel">{navItems.map((item, index) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</Link>)}<Link href="/visit" onClick={() => setOpen(false)}><span>05</span>Plan a visit</Link></div>}
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div><Wordmark light /><p>A considered room for the work that matters.</p></div><div className="footer-links"><Link href="/programs">Programs</Link><Link href="/membership">Membership</Link><Link href="/visit">Plan a visit</Link></div><small>© 2026 Performance Atlas. Built for repeatable work.</small></footer>;
}
