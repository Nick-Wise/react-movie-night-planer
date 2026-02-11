// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

const linkBase =
  "px-3 py-2 rounded-md text-lg font-medium transition-colors";

const linkInactive =
  "text-text-secondary hover:text-text-primary hover:bg-bg-surface";

const linkActive =
  "text-text-primary bg-bg-surface ring-2 ring-accent-muted";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-bg-main">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <NavLink
          to="/"
          className="text-lg font-bold tracking-tight text-text-primary hover:opacity-90"
        >
          Movie Night
        </NavLink>

        {/* Links */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Browse
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Watchlist
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
