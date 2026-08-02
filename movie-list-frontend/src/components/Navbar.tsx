import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-th-border/20 bg-th-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl tracking-wide text-th-accent">
          MovieDex
        </h1>

        <div className="flex items-center gap-4 text-sm text-th-descrip">
          <span className="text-th-owhite/90">Hi, {user?.name}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-sm border border-th-border/30 text-th-owhite bg-th-black hover:border-th-accent hover:text-th-black hover:bg-th-accent transition-colors duration-300"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}