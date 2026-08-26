'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { LogOut, User, FileText, Loader2 } from 'lucide-react';

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-gray-600 hover:text-gray-900 font-medium text-sm"
        >
          Войти
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Регистрация
        </Link>
      </div>
    );
  }

  const email = user.email || '';
  const initials = email.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setOpen(false);
    router.push('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm hover:bg-blue-200 transition-colors"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-gray-400" />
            Мои документы
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            {signingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
