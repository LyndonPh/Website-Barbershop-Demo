import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import History from './pages/History';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

function NavBar() {
  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/history', label: 'History', icon: '📋' },
    { to: '/progress', label: 'Progress', icon: '📈' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
        <div className="max-w-lg mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout/:day" element={<Workout />} />
            <Route path="/history" element={<History />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
      <NavBar />
    </BrowserRouter>
  );
}
