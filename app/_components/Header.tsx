"use client"

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'

const navigation = [
  { name: 'Startseite', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Kontakt', href: '/kontakt' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Logo
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {item.name}
          </a>
        ))}
      </nav>

      {/* Rechter Bereich / CTA (Optional) */}
      <div className="hidden md:flex items-center">
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          Sign In
        </button>
      </div>

      {/* Mobile Burger Button */}
      <div className="flex md:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
        >
          <span className="sr-only">Menü öffnen</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Menu (Headless UI Dialog) */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="relative z-50 md:hidden">
        {/* Hintergrund-Overlay */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />

        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-3 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900">
          <div className="flex items-center justify-between h-10">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Logo
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            >
              <span className="sr-only">Menü schließen</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          {/* Mobile Links */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <button className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
