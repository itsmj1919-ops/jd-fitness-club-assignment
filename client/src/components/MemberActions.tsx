import { LogOut, UserRound } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

export function MemberActions({ light = false }: { light?: boolean }) {
  const { user, loading, logout } = useAuth();
  if (loading) return <span className={`member-access member-access-loading ${light ? "member-access-light" : ""}`}>Member</span>;
  if (!user) return <button className={`member-access ${light ? "member-access-light" : ""}`} onClick={() => startLogin()}><UserRound size={14} /><span>Member sign in</span></button>;
  const name = user.name?.split(" ")[0] || "My practice";
  return <div className={`member-access member-access-user ${light ? "member-access-light" : ""}`}><Link href="/member"><UserRound size={14} /><span>{name}</span></Link><button onClick={() => void logout()} aria-label="Sign out"><LogOut size={13} /></button></div>;
}
