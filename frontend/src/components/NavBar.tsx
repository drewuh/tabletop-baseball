import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',    to: '/'        },
  { label: 'Stats',   to: '/stats'   },
  { label: 'History', to: '/history' },
] as const;

export function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-zinc-900 border-b border-zinc-700 h-14 px-6 flex items-center justify-between shrink-0">
      <Link to="/" className="text-zinc-100 font-bold text-lg tracking-wide">
        ⚾ Tabletop Baseball
      </Link>
      <div className="flex items-center gap-6">
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
    </nav>
  );
}
