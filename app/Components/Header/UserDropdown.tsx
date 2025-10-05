'use client';

import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '../../context/LanguageContext';
import Link from 'next/link';
import { User as UserType } from '../../types/users';

interface UserDropdownProps {
  user: UserType | null;
  onSignOut: () => void;
}

export default function UserDropdown({ user, onSignOut }: UserDropdownProps) {
  const { language } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
          <User className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <AuthenticatedMenu onSignOut={onSignOut} language={language} />
        ) : (
          <UnauthenticatedMenu language={language} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthenticatedMenu({ onSignOut, language }: { onSignOut: () => void; language: string }) {
  return (
    <>
      <DropdownMenuLabel>
        {language === 'ua' ? 'Мій акаунт' : 'My Account'}
      </DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link href="/profile" className="cursor-pointer">
          {language === 'ua' ? 'Профіль' : 'Profile'}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onSignOut}
        className="text-red-600 cursor-pointer"
      >
        <LogOut className="mr-2 w-4 h-4" />
        {language === 'ua' ? 'Вийти' : 'Sign Out'}
      </DropdownMenuItem>
    </>
  );
}

function UnauthenticatedMenu({ language }: { language: string }) {
  return (
    <>
      <DropdownMenuLabel>
        {language === 'ua' ? 'Акаунт' : 'Account'}
      </DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link href="/auth" className="cursor-pointer">
          {language === 'ua' ? 'Увійти' : 'Sign In'}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/auth" className="cursor-pointer">
          {language === 'ua' ? 'Зареєструватися' : 'Sign Up'}
        </Link>
      </DropdownMenuItem>
    </>
  );
}