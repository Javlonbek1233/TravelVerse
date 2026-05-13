import { Link, useLocation } from "react-router-dom";
import { User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Compass, Calendar, Map, BookOpen, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface NavbarProps {
  user: User | null;
  onAuthClick: () => void;
}

export default function Navbar({ user, onAuthClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Explore", path: "/", icon: Compass },
    ...(user ? [
      { name: "My Trips", path: "/dashboard", icon: Calendar },
      { name: "Journal", path: "/journal", icon: BookOpen },
    ] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <h1 className="font-serif text-3xl font-light tracking-tight">
              Travel<span className="italic font-medium text-primary">Verse</span>
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-[10px] font-bold tracking-[0.3em] uppercase transition-colors hover:text-primary",
                  location.pathname === item.path ? "text-primary" : "text-white/40"
                )}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                  <UserIcon className="w-4 h-4 text-white/60" />
                </Link>
                <button
                  onClick={() => signOut(auth)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-6 py-2.5 sunset-gradient text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                Join the Verse
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-white/70 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-orange-500"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
