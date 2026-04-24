'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Upload, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/candidates/upload', icon: Upload, label: 'Upload' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-gray-200 bg-gray-50 min-h-screen pt-6 pb-8 px-3">
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
