'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/jobs', label: 'Jobs' },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-gray-900">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg">Umurava<span className="text-brand-600">AI</span></span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">
            R
          </div>
        </div>
      </div>
    </header>
  );
}
