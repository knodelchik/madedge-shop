'use client';

import Link from "next/link";
import Image from "next/image";
import { Settings, User, Moon, Sun, Monitor } from "lucide-react";
import CartSheet from "./CartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Header() {
  const { setTheme } = useTheme();
  const [language, setLanguage] = useState("ua");
  const [currency, setCurrency] = useState("usd");

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white/70 backdrop-blur-lg px-6 py-4 flex items-center justify-between">
      {/* Лівий логотип */}
      <div className="text-2xl font-bold text-gray-800">MadEdge</div>

      {/* Навігація */}
      <nav className="flex items-center gap-10 text-gray-700 font-medium">
        <Link href="/">Головна</Link>
        <Link href="/shop">Магазин</Link>
        <div className="w-14 h-14 relative">
          <Image
            src="/logo.jpg"
            alt="Логотип"
            fill
            className="object-contain rounded-full"
          />
        </div>
        <Link href="/about">Про нас</Link>
        <Link href="/contact">Контакти</Link>
      </nav>

      {/* Правий блок */}
      <div className="flex items-center gap-4 text-gray-700">
        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Налаштування">
              <Settings className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Мова</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setLanguage("ua")}>
              🇺🇦 Українська {language === "ua" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("en")}>
              🇬🇧 English {language === "en" && "✓"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Валюта</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setCurrency("uah")}>
              ₴ Гривня {currency === "uah" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrency("usd")}>
              $ Долар {currency === "usd" && "✓"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Тема</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 w-4 h-4" /> Світла
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 w-4 h-4" /> Темна
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="mr-2 w-4 h-4" /> Системна
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button aria-label="Акаунт">
          <User className="w-6 h-6" />
        </button>

        <CartSheet />
      </div>
    </header>
  );
}
