import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, Globe, Trophy } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", key: "nav.home", id: "nav-home" },
  { to: "/matches", key: "nav.matches", id: "nav-matches" },
  { to: "/teams", key: "nav.teams", id: "nav-teams" },
  { to: "/stats", key: "nav.stats", id: "nav-stats" },
  { to: "/stadiums", key: "nav.stadiums", id: "nav-stadiums" },
  { to: "/timeline", key: "nav.timeline", id: "nav-timeline" },
  { to: "/simulator", key: "nav.simulator", id: "nav-simulator" },
  { to: "/rivality", key: "nav.rivality", id: "nav-rivality" },
];

const Header = () => {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10" data-testid="site-header">
      <div className="section-pad h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2" data-testid="brand-link">
          <div className="w-8 h-8 bg-neon flex items-center justify-center">
            <Trophy size={18} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            WORLDCUP <span className="text-neon">NEXUS</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={n.id}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.18em] px-3 py-2 transition-colors ${
                  isActive ? "text-neon" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {t(n.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest" data-testid="lang-toggle">
                <Globe size={14} className="mr-1" /> {lang.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="lang-es" onClick={() => setLang("es")}>Español</DropdownMenuItem>
              <DropdownMenuItem data-testid="lang-en" onClick={() => setLang("en")}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggle} data-testid="theme-toggle" aria-label={t("theme")}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
