import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/app/_components/Header";
import Modal from "@/app/_components/Modal";
import {ThemeProvider} from "next-themes";
import {ModalProvider} from "@/app/_context/ModalContext";
import BgGradient from "@/app/_components/BgGradient";
import {getCurrentUser} from "@/lib/auth/session";
import Footer from "@/app/_components/Footer";
import ScrollTop from "@/app/_components/ScrollTop";
import Toast from "./_components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Einfaches Meal Planning",
};

export default async function RootLayout({children}: LayoutProps<"/">) {
  const user = await getCurrentUser();
  //console.log("Current user:", user);
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-white dark:bg-black min-h-full flex flex-col text-black dark:text-zinc-50 overflow-x-hidden relative">
        <BgGradient />
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ModalProvider>
            <Header email={user?.email ?? ""} />
            <div className="container flex flex-col flex-1 items-center justify-start font-sans mx-auto">
              {children}
              <Modal />
              <Toast />
            </div>
            <div className="fixed bottom-6 w-10 h-10 left-auto right-5 z-50">
              <ScrollTop />
            </div>
            <Footer />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
