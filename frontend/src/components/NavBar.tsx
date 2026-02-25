import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',    to: '/'        },
  { label: 'Stats',   to: '/stats'   },
  { label: 'History', to: '/history' },
  { label: 'Editor',  to: '/editor'  },
] as const;

export function NavBar() {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function closeDrawer() { setDrawerOpen(false); }

  return (
    <>
      <nav className="bg-zinc-900 border-b border-zinc-700 h-14 px-6 flex items-center justify-between shrink-0 relative z-30">
        <Link to="/" className="text-zinc-100 font-bold text-lg tracking-wide">
          ⚾ Tabletop Baseball
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map(({ label, to }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`text-sm transition-colors pb-0.5 ${
                  isActive
                    ? 'text-zinc-100 border-b-2 border-amber-300'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setDrawerOpen(o => !o)}
          className="sm:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 text-zinc-400 hover:text-zinc-100"
          aria-label="Menu"
        >
          <span className="w-5 h-0.5 bg-current" />
          <span className="w-5 h-0.5 bg-current" />
          <span className="w-5 h-0.5 bg-current" />
        </button>
      </nav>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-64 bg-zinc-900 border-l border-zinc-700 z-50 flex flex-col py-6 px-6 gap-2 transition-transform duration-200 sm:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {NAV_LINKS.map(({ label, to }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={closeDrawer}
              className={`py-3 text-base font-medium transition-colors ${
                isActive
                  ? 'text-zinc-100 border-l-2 border-amber-300 pl-3'
                  : 'text-zinc-400 hover:text-zinc-100 pl-3.5'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
