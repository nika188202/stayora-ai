export const PLANS = {
  starter: { name: "Starter", price: "€9", properties: 1, monthlyMessages: 100 },
  pro: { name: "Pro", price: "€19", properties: 5, monthlyMessages: 600 },
  business: { name: "Business", price: "€49", properties: 20, monthlyMessages: 3000 }
} as const;
export type PlanKey = keyof typeof PLANS;
export function priceIdFor(plan: PlanKey) {
  return ({ starter: process.env.STRIPE_PRICE_STARTER, pro: process.env.STRIPE_PRICE_PRO, business: process.env.STRIPE_PRICE_BUSINESS } as const)[plan];
}