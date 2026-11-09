import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export async function requireUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}
export function isAdmin(userId: string) {
  return (process.env.ADMIN_USER_IDS || "").split(",").map(x => x.trim()).includes(userId);
}