import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"; // I will create a simple custom Dialog
import { motion, AnimatePresence } from "motion/react";
import { X, Search } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-dark/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative glass w-full max-w-md rounded-[2.5rem] p-12 overflow-hidden shadow-2xl shadow-black border-primary/20"
      >
        <div className="absolute top-8 right-8">
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h1 className="font-serif text-5xl font-light tracking-tight italic">Travel<span className="text-primary">Verse</span></h1>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">Initialize Traversal OS v2.4</p>
          </div>
          
          <div className="space-y-8">
            <p className="text-white/40 text-sm font-light leading-relaxed px-4">Authenticate your identity to synchronization with the planetary exploration network.</p>
            
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-4 px-8 py-5 sunset-gradient text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-black text-[12px] font-black">G</span>
                  </div>
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-8 border-t border-white/5">
             <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/10 italic">Protocol: Neural-Link Established</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
