"use client";
//import {useModal} from "@/app/_context/ModalContext";
import {useState} from "react";
import {Dialog, DialogPanel} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import ThemeSwitch from "@/app/_components/ThemeSwitch";
import {usePathname} from "next/navigation";
import navigation, {type NavigationItem} from "@/app/_lib/navMenu";
import {logout} from "@/lib/auth/actions";
import Logo from "./Logo";
import {LogOut, UserKey, UserLock, UserPen} from "lucide-react";

export default function Header({email}: {email: string}) {
  const pathname = usePathname();
  //const {isVisible, title} = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  //console.log("Current email:", email);
  return (
    <header
      className={
        "sticky top-0 z-50 flex h-15 w-full items-center justify-between border-b border-neutral-200 bg-white/80 px-6 backdrop-blur-md dark:border-emerald-800 dark:bg-emerald-800/80"
      }
    >
      <LogoLink />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center items-center space-x-8">
        {navigation.map((item: NavigationItem) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium uppercase transition-colors ${isActive ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:text-emerald-400 dark:hover:text-emerald-300"}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Rechter Bereich / User Theme Switch */}
      <div className="hidden md:flex items-center justify-center gap-2">
        <Link
          href="/user"
          aria-label="User Profile"
          title="User Profile"
          className={`flex flex-col items-center justify-center cursor-pointer hover:animate-pulse text-sm font-semibold transition-colors rounded-lg bg-emerald-900 hover:bg-emerald-700 px-2 py-1 ${pathname === "/user" ? "text-white" : "text-emerald-500 hover:dark:text-emerald-400"}`}
        >
          {email === "" ? <UserKey size={24} /> : <UserLock size={20} />}
        </Link>
        {email !== "" && (
          <form action={logout}>
            <button
              type="submit"
              aria-label="Logout"
              title="Logout"
              className={
                "flex flex-col items-center justify-center cursor-pointer hover:animate-pulse text-sm font-semibold transition-colors rounded-lg bg-emerald-900 hover:bg-emerald-700 px-2 py-1 text-emerald-500 hover:dark:text-emerald-400"
              }
            >
              <LogOut size={20} />
            </button>
          </form>
        )}

        <span className="text-xs hidden lg:inline-block">{email || ""}</span>
      </div>

      {/* Mobile Burger Button */}
      <div className="flex md:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-neutral-700 dark:text-neutral-200"
        >
          <span className="sr-only">Menü öffnen</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Menu (Headless UI Dialog) */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="relative z-50 md:hidden"
      >
        {/* Hintergrund-Overlay */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          aria-hidden="true"
        />

        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-2.5 sm:max-w-sm sm:ring-1 sm:ring-neutral-900/10 dark:bg-neutral-900">
          <div className="flex items-center justify-between h-10">
            <LogoLink />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-neutral-700 dark:text-neutral-200"
            >
              <span className="sr-only">Menü schließen</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-neutral-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item: NavigationItem) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold transition-colors ${isActive ? "text-neutral-900 dark:text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"}`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className="py-2">
                <Link
                  href="/user"
                  className="flex justify-start items-center w-full rounded-lg px-3 py-1 font-semibold dark:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {email === "" ? <UserKey /> : <UserLock />}
                </Link>
              </div>
              <div className="py-2">
                <ThemeSwitch />
              </div>
              <div className="py-2">
                <form action={logout} aria-label="Logout" title="Logout">
                  <button
                    type="submit"
                    className={
                      "flex flex-row items-center justify-center cursor-pointer hover:animate-pulse text-sm font-semibold transition-colors rounded-lg bg-emerald-900 hover:bg-emerald-700 px-2 py-1"
                    }
                  >
                    <LogOut /> Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

function LogoLink() {
  return (
    <Link href="/" className="block cursor-pointer">
      <Logo />
    </Link>
  );
}
