import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"余白 — 部屋を見つめる、片付けの一歩",description:"写真から片付き具合と、まず5分でできることを見つけます。",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="ja"><body>{children}</body></html>}
