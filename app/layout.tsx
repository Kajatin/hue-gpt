import './globals.css'
import { Space_Mono } from "next/font/google";

const googleFont = Space_Mono({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Hue GPT",
  description: "Generate Hue color settings from text prompts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={googleFont.className}>{children}</body>
    </html>
  );
}
