import {NextResponse} from "next/server";
import {z} from "zod";
import {createClient} from "@/lib/supabase/server";
import {openai} from "@/lib/openai";
import {PLANS} from "@/lib/plans";
const schema=z.object({propertyId:z.string().uuid().optional().or(z.literal("")),task:z.enum(["guest_reply","translate","listing","review","local_guide"]),language:z.string().max(40),tone:z.string().max(80),input:z.string().min(2).max(6000)});
export async function POST(req:Request){
 try{
  const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Please log in."},{status:401});
  const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Please check the form and try again."},{status:400});
  const {propertyId,task,language,tone,input}=parsed.data;
  let property:any=null;
  if(propertyId){const q=await supabase.from("properties").select("*").eq("id",propertyId).eq("user_id",user.id).maybeSingle();property=q.data;if(!property)return NextResponse.json({error:"Property not found."},{status:404});}
  const {data:sub}=await supabase.from("subscriptions").select("plan,status").eq("user_id",user.id).maybeSingle();
  const plan=(sub?.status==="active"&&sub.plan in PLANS?sub.plan:"starter") as keyof typeof PLANS;
  const limit=PLANS[plan].monthlyMessages;
  const monthStart=new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString();
  const {count}=await supabase.from("ai_usage").select("*",{count:"exact",head:true}).eq("user_id",user.id).gte("created_at",monthStart);
  if((count||0)>=limit)return NextResponse.json({error:`Monthly draft limit reached (${limit}). Upgrade your plan to continue.`},{status:429});
  const taskText={guest_reply:"Write a helpful reply to a short-term rental guest.",translate:"Translate and naturally adapt the supplied message.",listing:"Rewrite the property listing to be clear, appealing and factual.",review:"Draft a gracious public response to the guest review.",local_guide:"Create a concise local guide based only on the information supplied. Do not invent opening hours or current details."}[task];
  const context=property?JSON.stringify({name:property.name,location:property.location,language:property.language,check_in:property.check_in,check_out:property.check_out,wifi_name:property.wifi_name,house_rules:property.house_rules,description:property.description}):"No property profile supplied.";
  const completion=await openai.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-4o-mini",temperature:0.5,messages:[
   {role:"system",content:`You are Stayora, a careful hospitality writing assistant. ${taskText} Write in ${language}. Tone: ${tone}. Use the property facts only as context. Never invent availability, prices, access codes, policies, addresses, amenities, opening hours or commitments. If information is missing, use a clear placeholder or ask the host to confirm. Do not claim to send messages. Keep output ready to review and copy. Avoid exposing private guest data.`},
   {role:"user",content:`PROPERTY CONTEXT:\n${context}\n\nHOST REQUEST / GUEST MESSAGE:\n${input}`}
  ]});
  const text=completion.choices[0]?.message?.content||"No draft generated.";
  const preview=text.slice(0,500);
  await supabase.from("ai_usage").insert({user_id:user.id,task,model:completion.model,input_preview:input.slice(0,300),output_preview:preview});
  return NextResponse.json({text});
 }catch(e:any){console.error("AI generation error",e);return NextResponse.json({error:"AI service is not configured or temporarily unavailable."},{status:500});}
}