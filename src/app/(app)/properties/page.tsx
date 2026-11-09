import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import PropertyManager from "@/components/PropertyManager";
export default async function Properties(){const {supabase,user}=await requireUser();const {data}=await supabase.from("properties").select("*").eq("user_id",user.id).order("created_at",{ascending:false});return <AppShell title="My properties" subtitle="Save property details so your AI drafts are more relevant."><PropertyManager initial={data||[]}/></AppShell>}