import AppShell from "@/components/AppShell";
import {requireUser} from "@/lib/auth";
import BillingPlans from "@/components/BillingPlans";
export default async function Billing(){const {supabase,user}=await requireUser();const {data}=await supabase.from("subscriptions").select("*").eq("user_id",user.id).maybeSingle();return <AppShell title="Plan & billing" subtitle="Manage your Stayora subscription."><BillingPlans current={data}/></AppShell>}