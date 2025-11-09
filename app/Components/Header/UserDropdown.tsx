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
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { User as UserType } from '../../types/users';

interface UserDropdownProps {
  user: UserType | null;
  onSignOut: () => void;
}

export default function UserDropdown({ user, onSignOut }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <User className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <AuthenticatedMenu onSignOut={onSignOut} />
        ) : (
          <UnauthenticatedMenu />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthenticatedMenu({ onSignOut }: { onSignOut: () => void }) {
  const t = useTranslations('UserDropdown');

  return (
    <>
      <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link href="/profile" className="cursor-pointer">
          {t('profile')}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onSignOut}
        className="text-red-600 cursor-pointer"
      >
        <LogOut className="mr-2 w-4 h-4" />
        {t('signOut')}
      </DropdownMenuItem>
    </>
  );
}

function UnauthenticatedMenu() {
  const t = useTranslations('UserDropdown');

  return (
    <>
      <DropdownMenuLabel>{t('account')}</DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link href="/auth" className="cursor-pointer">
          {t('signIn')}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/auth" className="cursor-pointer">
          {t('signUp')}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
