import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { JournalEntry } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Plus, Image as ImageIcon, MapPin, X } from "lucide-react";

export default function Journal({ user }: { user: User | null }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "", location: "" });

  useEffect(() => {
    async function fetchEntries() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "journals"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedEntries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JournalEntry[];
        setEntries(fetchedEntries);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "journals");
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, "journals"), {
        ...newEntry,
        userId: user.uid,
        date: new Date().toISOString(),
        createdAt: serverTimestamp(),
        images: []
      });
      setIsAdding(false);
      setNewEntry({ title: "", content: "", location: "" });
      // Refresh entries
      window.location.reload();
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, "journals");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-dark pt-24 pb-20 px-4 relative overflow-hidden">
      <div className="ambient-glow-orange top-[-100px] left-[-100px]" />
      <div className="ambient-glow-blue bottom-[-50px] right-[-50px]" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
        {/* Left Side - Header & Stats */}
        <div className="w-full md:w-80 space-y-10 flex-shrink-0">
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">Data Ledger</span>
            <h1 className="font-serif text-5xl font-light tracking-tight italic leading-[0.9]">Travel <br /> Journal</h1>
          </div>
          <p className="text-white/30 text-sm leading-relaxed font-light">A curated digital repository of traversal experiences. Optimized for long-term memory persistence.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-5 sunset-gradient text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-3"
          >
            <Plus className="w-4 h-4" />
            <span>Designate Entry</span>
          </button>
        </div>

        {/* Right Side - Entries Grid */}
        <div className="flex-1">
          {loading ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {[1, 2, 3].map(i => <div key={i} className="h-64 glass rounded-[2.5rem] animate-pulse" />)}
             </div>
          ) : entries.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center glass rounded-[2.5rem] border-dashed">
              <BookOpen className="w-12 h-12 text-white/5 mb-6" />
              <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px] italic">No traversal logs detected in the current sector.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {entries.map((entry) => (
                <motion.div 
                  key={entry.id}
                  whileHover={{ y: -8 }}
                  className="glass rounded-[2.5rem] p-10 space-y-8 hover:border-primary/30 transition-all group duration-500"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-primary tracking-widest uppercase">{new Date(entry.date).toLocaleDateString()}</span>
                    {entry.location && (
                       <div className="px-3 py-1 glass border-white/5 rounded-full text-[9px] font-bold uppercase tracking-[0.25em] text-white/40">
                         <MapPin className="w-3 h-3 mr-1 inline" />
                         {entry.location}
                       </div>
                    )}
                  </div>
                  <h3 className="font-serif text-3xl font-light italic tracking-tight text-white group-hover:text-primary transition-colors">{entry.title}</h3>
                  <p className="text-white/40 text-sm line-clamp-3 font-light leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                     <div className="flex -space-x-2">
                       {[1, 2].map(i => (
                         <div key={i} className="w-8 h-8 rounded-lg glass bg-white/5 border-white/10" />
                       ))}
                     </div>
                     <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/10 italic"># JOURNAL_SEG_{entry.id.slice(0, 4)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-bg-dark/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass w-full max-w-2xl rounded-[2.5rem] p-12 border-primary/20 shadow-2xl shadow-black"
            >
              <button onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-3">
                   <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">Log Initialization</span>
                   <h2 className="font-serif text-4xl font-light italic tracking-tight">Record Journey</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Entry Designation</label>
                    <input
                      placeholder="e.g. Celestial Dawn over Ravello"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                      className="w-full glass rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-xl font-serif italic tracking-tight transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Coordinates (Optional)</label>
                    <input
                      placeholder="e.g. Amalfi Coast, ITA"
                      value={newEntry.location}
                      onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
                      className="w-full glass rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-xs font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Log Content</label>
                    <textarea
                      placeholder="Describe the traversal experience..."
                      rows={6}
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      className="w-full glass rounded-3xl px-6 py-5 focus:outline-none focus:border-primary/50 text-sm leading-relaxed font-light transition-all resize-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 sunset-gradient text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  Encrypt Discovery
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
