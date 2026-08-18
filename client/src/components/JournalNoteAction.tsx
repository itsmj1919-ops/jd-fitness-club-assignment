import { Bookmark, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export function JournalNoteAction({ articleSlug, articleTitle }: { articleSlug: string; articleTitle: string }) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const utils = trpc.useUtils();
  const notes = trpc.member.notes.list.useQuery(undefined, { enabled: isAuthenticated });
  const existing = notes.data?.find((note) => note.articleSlug === articleSlug);
  const save = trpc.member.notes.save.useMutation({ onSuccess: () => { void utils.member.notes.invalidate(); setOpen(false); } });
  useEffect(() => { if (open) setBody(existing?.body ?? ""); }, [existing?.body, open]);
  if (!isAuthenticated) return <button className="reader-save" onClick={() => startLogin()}><Bookmark size={15} /> Sign in to save</button>;
  return <><button className="reader-save" onClick={() => setOpen(true)}><Bookmark size={15} /> {existing ? "Edit saved note" : "Save to My Practice"}</button>{open && <div className="member-dialog-backdrop" onMouseDown={() => setOpen(false)}><section className="member-note-dialog" role="dialog" aria-modal="true" aria-labelledby="note-dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className="member-dialog-close" onClick={() => setOpen(false)} aria-label="Close note editor"><X size={18} /></button><p className="eyebrow">My Practice / Journal note</p><h3 id="note-dialog-title">{articleTitle}</h3><label htmlFor="member-note-body">Your note</label><textarea id="member-note-body" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Keep the useful part of this note for later." maxLength={10000} autoFocus /><div className="member-dialog-actions"><button onClick={() => setOpen(false)}>Cancel</button><button className="dark-button" disabled={!body.trim() || save.isPending} onClick={() => save.mutate({ articleSlug, articleTitle, body })}>{save.isPending ? "Saving…" : <><Check size={15} /> Save note</>}</button></div>{save.error && <p className="member-form-error">Your note could not be saved. Please try again.</p>}</section></div>}</>;
}
