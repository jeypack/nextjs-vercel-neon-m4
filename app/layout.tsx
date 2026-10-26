import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/app/_components/Header";
import Modal from "@/app/_components/Modal";
import {ThemeProvider} from "next-themes";
import {ModalProvider} from "@/app/_context/ModalContext";
import BgGradient from "@/app/_components/BgGradient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meal Planner App",
  description: "A meal planning application",
};

export default function RootLayout({children}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-white dark:bg-black min-h-full flex flex-col text-black dark:text-zinc-50 overflow-x-hidden relative">
        <BgGradient />
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header />
          <ModalProvider>
            <div className="container flex flex-col flex-1 items-center justify-center font-sans mx-auto">
              {children}
              <Modal />
            </div>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
