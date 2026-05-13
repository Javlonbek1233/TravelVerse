import { User } from "firebase/auth";
import { useState } from "react";
import { motion } from "motion/react";
import { User as UserIcon, Globe, MapPin, Heart, Shield, Settings } from "lucide-react";

export default function Profile({ user }: { user: User | null }) {
  const [preferences, setPreferences] = useState({
    budgetType: "standard",
    travelStyle: ["Adventure", "Culture"],
    newsletter: true
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-dark pt-24 pb-20 px-4 relative overflow-hidden">
      <div className="ambient-glow-orange top-[-100px] left-[-100px]" />
      <div className="ambient-glow-blue bottom-[-50px] right-[-50px]" />

      <div className="max-w-6xl mx-auto relative z-10 px-4">
        <div className="flex flex-col md:flex-row items-start gap-16">
          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-10 flex-shrink-0">
            <div className="space-y-6">
              <div className="relative group inline-block">
                <div className="w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center overflow-hidden border-white/10 group-hover:border-primary/50 transition-all duration-500">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-white/10" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 sunset-gradient rounded-2xl text-white shadow-2xl shadow-primary/30 hover:scale-110 transition-transform">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <h2 className="font-serif text-4xl font-light italic leading-none tracking-tight">{user.displayName || "Traveler"}</h2>
                <p className="text-white/20 text-[10px] font-mono tracking-widest uppercase">ID_SEG_{user.uid.slice(0, 8)}</p>
              </div>
            </div>

            <nav className="space-y-3">
              {[
                { name: "Expedition Feed", icon: UserIcon, active: true },
                { name: "Neural Preferences", icon: Heart, active: false },
                { name: "Encrypted Protocol", icon: Shield, active: false },
                { name: "Traversal Support", icon: Globe, active: false },
              ].map(item => (
                <button
                  key={item.name}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                    item.active ? "sunset-gradient text-white shadow-lg shadow-primary/20" : "glass text-white/30 hover:text-white border-transparent hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-16">
            <section className="space-y-8">
               <div className="space-y-2">
                 <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">Neural Profile</span>
                 <h3 className="font-serif text-3xl font-light tracking-tight italic">Travel Parameters</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="glass rounded-[2rem] p-10 space-y-6">
                   <div className="flex items-center space-x-4 text-white/20">
                     <Globe className="w-5 h-5 text-primary/40" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Interest Vectors</span>
                   </div>
                   <div className="flex flex-wrap gap-3">
                     {preferences.travelStyle.map(style => (
                        <span key={style} className="px-4 py-1.5 glass bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 border-white/5">
                          {style}
                        </span>
                     ))}
                   </div>
                 </div>

                 <div className="glass rounded-[2rem] p-10 space-y-6">
                   <div className="flex items-center space-x-4 text-white/20">
                     <MapPin className="w-5 h-5 text-primary/40" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Budget Allocation</span>
                   </div>
                   <p className="font-serif text-3xl italic tracking-tight text-white/60 capitalize leading-none">{preferences.budgetType}</p>
                 </div>
               </div>
            </section>

            <section className="space-y-8">
               <div className="space-y-2">
                 <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">Expedition Milestones</span>
                 <h3 className="font-serif text-3xl font-light tracking-tight italic">Achievement Archive</h3>
               </div>
               <div className="glass rounded-[2.5rem] p-12 text-center space-y-6 group hover:border-primary/20 transition-all duration-500">
                 <div className="w-20 h-20 sunset-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 transform group-hover:rotate-12 transition-transform duration-500">
                   <Globe className="w-10 h-10 text-white" />
                 </div>
                 <h4 className="font-serif text-3xl italic tracking-tight">Planetary Explorer <span className="text-primary">Lvl 1</span></h4>
                 <p className="text-white/30 text-sm max-w-sm mx-auto font-light leading-relaxed px-4">Generate 5 distinct itineraries to synchronize your experience with the global verse.</p>
                 <div className="max-w-xs mx-auto space-y-3 pt-6">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                      <span>Sync Progress</span>
                      <span className="text-primary">20%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary shadow-[0_0_15px_rgba(255,107,53,0.6)]" style={{ width: '20%' }} />
                    </div>
                 </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
