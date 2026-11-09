import "./globals.css";
export const metadata = {
  title: "Stayora AI — Guest communication, made effortless",
  description: "The AI workspace for short-term rental hosts."
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}