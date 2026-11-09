import {NextResponse} from "next/server";
import Stripe from "stripe";
import {createClient} from "@/lib/supabase/server";
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(){const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});const {data}=await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id",user.id).maybeSingle();if(!data?.stripe_customer_id)return NextResponse.json({error:"No billing customer found."},{status:404});const session=await stripe.billingPortal.sessions.create({customer:data.stripe_customer_id,return_url:`${process.env.NEXT_PUBLIC_APP_URL}/billing`});return NextResponse.json({url:session.url});}