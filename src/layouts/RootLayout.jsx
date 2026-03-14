import { Link, useLocation } from 'react-router-dom';
import { ProfileIcon, LearnIcon, TypeIcon, PronounceIcon } from '../components/ui/Icons';

// Proper house-shaped home icon for the mobile nav
const NavHomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-6 0h8a2 2 0 002-2v-6" />
  </svg>
);

const NAV_ITEMS = [
  { path: '/learn',     label: 'Learn',     Icon: LearnIcon },
  { path: '/type',      label: 'Type',      Icon: TypeIcon },
  { path: '/pronounce', label: 'Pronounce', Icon: PronounceIcon },
];

const MOBILE_ITEMS = [
  { path: '/',          label: 'Home',      Icon: NavHomeIcon },
  ...NAV_ITEMS,
];

/**
 * App shell: header, main content slot, mobile bottom nav, and chatbot.
 * @param {{
 *   children: React.ReactNode;
 *   userName: string;
 *   onProfileOpen: () => void;
 * }} props
 */
const RootLayout = ({ children, userName, onProfileOpen }) => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 md:pb-0">
      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-30 border-b border-slate-200">
        <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-800 hover:text-brand-600 transition-colors"
            aria-label="Go to home"
            id="header-logo"
          >
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-extrabold tracking-tight">AI English Tutor</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full" aria-label="Main navigation">
            {NAV_ITEMS.map(({ path, label, Icon }) => {
              const active = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  id={`nav-${label.toLowerCase()}`}
                  className={`nav-pill ${active ? 'active' : ''}`}
                >
                  <Icon />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile button */}
          <button
            onClick={onProfileOpen}
            className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors"
            aria-label="Open my profile"
            id="header-profile-btn"
          >
            <span className="hidden sm:inline text-sm font-semibold">{userName || 'My Profile'}</span>
            <ProfileIcon />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="container mx-auto px-4 py-6" id="main-content">
        {children}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 backdrop-blur-lg border-t border-slate-200 z-30"
        aria-label="Mobile navigation"
      >
        <div className="flex justify-around">
          {MOBILE_ITEMS.map(({ path, label, Icon }) => {
            const active = pathname === path || (path !== '/' && pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                id={`mobile-nav-${label.toLowerCase()}`}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-colors ${
                  active ? 'text-brand-600' : 'text-slate-500 hover:text-brand-500'
                }`}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default RootLayout;
