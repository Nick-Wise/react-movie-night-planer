import { NavLink } from "react-router-dom";

const baseLinkClasses =
  "rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition";
const inactiveLinkClasses =
  "text-text-secondary hover:bg-bg-surface hover:text-text-primary";
const activeLinkClasses =
  "bg-accent-primary text-white shadow-[0_10px_30px_rgba(168,85,247,0.3)]";

function Navbar() {
  return (
    <header className="border-b border-border/80 bg-bg-main/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="text-xl font-black uppercase tracking-[0.2em]">
          Movie Night
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
            }
          >
            Watchlist
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
