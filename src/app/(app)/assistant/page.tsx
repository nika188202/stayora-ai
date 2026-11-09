import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import Assistant from "@/components/Assistant";
export default async function AssistantPage(){const {supabase,user}=await requireUser();const {data}=await supabase.from("properties").select("id,name,location,language,check_in,check_out,wifi_name,house_rules,description").eq("user_id",user.id);return <AppShell title="AI guest assistant" subtitle="Generate drafts, then review and send them in your own channel."><Assistant properties={data||[]}/></AppShell>}