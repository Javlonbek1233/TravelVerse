import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { Trip } from "../types";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, DollarSign, Cloud, ArrowLeft, MoreVertical, Sparkles } from "lucide-react";
import MapView from "../components/MapView";
import { formatCurrency, formatDate } from "../lib/utils";

export default function TripDetails({ user }: { user: User | null }) {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    async function fetchTrip() {
      if (!id) return;
      try {
        const docRef = doc(db, "trips", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTrip({ id: docSnap.id, ...docSnap.data() } as Trip);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `trips/${id}`);
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
  </div>;

  if (!trip) return <div>Trip not found</div>;

  const currentDay = trip.itinerary.find(d => d.day === activeDay);

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-bg-dark">
      <div className="ambient-glow-orange top-[-100px] left-[-100px]" />
      <div className="ambient-glow-blue bottom-[-50px] right-[-50px]" />

      <div className="flex h-full relative z-10">
        {/* Left Sidebar - Itinerary */}
        <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col glass border-y-0 border-l-0 overflow-hidden">
          {/* Header */}
          <div className="p-10 border-b border-white/5 space-y-8">
            <Link to="/dashboard" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vault
            </Link>
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">Expedition Segment</span>
                <Sparkles className="w-4 h-4 text-white/10" />
               </div>
               <h1 className="font-serif text-5xl font-light tracking-tight italic">{trip.destination}</h1>
            </div>

            <div className="flex items-center space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {trip.days} Days</span>
              <span className="flex items-center"><DollarSign className="w-4 h-4 mr-2" /> {formatCurrency(trip.budget)}</span>
            </div>
          </div>

          {/* Days Selector */}
          <div className="flex overflow-x-auto p-5 bg-white/[0.02] border-b border-white/5 no-scrollbar">
            {trip.itinerary.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mr-3 transition-all ${
                  activeDay === day.day 
                    ? "sunset-gradient text-white shadow-lg shadow-primary/20" 
                    : "glass text-white/20 hover:text-white border-white/5"
                }`}
              >
                Day 0{day.day}
              </button>
            ))}
          </div>

          {/* Activity List */}
          <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12 pb-10"
              >
                {currentDay?.activities.map((activity, idx) => (
                  <div key={idx} className="group relative pl-10">
                    <div className="itinerary-line absolute left-[15px] top-6 bottom-[-24px] group-last:bottom-0" />
                    <div className="absolute left-0 top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-bg-dark shadow-[0_0_15px_rgba(255,107,53,0.5)] group-hover:scale-125 transition-transform" />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-primary font-mono text-[10px] tracking-widest">{activity.time}</span>
                         <span className="text-white/10 hover:text-white transition-colors cursor-pointer"><MoreVertical className="w-4 h-4" /></span>
                      </div>
                      <h3 className="font-serif text-2xl italic tracking-tight text-white group-hover:text-primary transition-colors">{activity.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed font-light">{activity.description}</p>
                      <div className="flex items-center space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 pt-4">
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {activity.location}</span>
                        <span className="flex items-center"><DollarSign className="w-4 h-4 mr-2" /> {formatCurrency(activity.cost)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section - Map & Context */}
        <div className="hidden md:flex flex-1 flex-col bg-bg-dark/50 p-10 space-y-10">
           {/* Widgets Row */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-32 flex-shrink-0">
             <div className="glass rounded-3xl p-8 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Weather Today</span>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-serif italic tracking-tighter">24°C</div>
                  <Cloud className="text-white/10 w-8 h-8" />
                </div>
             </div>
             <div className="glass rounded-3xl p-8 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Budget Vector</span>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-serif italic tracking-tighter">42%</div>
                  <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary shadow-[0_0_10px_rgba(255,107,53,0.5)]" style={{ width: '42%' }} />
                  </div>
                </div>
             </div>
             <div className="glass rounded-3xl p-8 flex flex-col justify-between group cursor-pointer hover:border-primary/30 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Optimal Traversal</span>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-serif italic tracking-tight group-hover:text-primary">Sept - Nov</div>
                  <Sparkles className="text-white/10 w-6 h-6 group-hover:text-primary group-hover:animate-pulse" />
                </div>
             </div>
           </div>

           {/* Map Area */}
           <div className="flex-1 relative space-y-10 flex flex-col overflow-hidden">
             <div className="flex-1 min-h-[400px] glass overflow-hidden rounded-3xl border-white/5">
                <MapView locations={currentDay?.activities.map(a => ({ title: a.title, lat: 0, lng: 0 })) || []} />
             </div>

             {/* Packing Checklist */}
             <div className="glass rounded-3xl p-8 flex flex-col h-[35%] overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Deployment Essentials</span>
                  <div className="px-3 py-1 bg-primary/5 rounded text-[9px] font-bold text-primary/40 uppercase tracking-[0.1em] border border-primary/10">Neural Suggested</div>
                </div>
                <div className="grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-4">
                  {[
                    "Passport & Visas", 
                    "Local Currency", 
                    "Universal Adapter", 
                    "Camera Gear", 
                    "Comfortable Traversal Footwear", 
                    "Medical Reserve"
                  ].map(item => (
                    <div key={item} className="flex items-center space-x-4 p-4 glass rounded-2xl hover:border-primary/20 transition-all cursor-pointer group">
                      <div className="w-5 h-5 rounded glass border-white/10 group-hover:border-primary/40" />
                      <span className="text-[11px] text-white/40 font-light group-hover:text-white transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
             </div>
              
             {/* Floating Chat Button */}
             <button 
                onClick={() => alert("TravelVerse OS: 'Analyzing current traversal data... Protocol is active. How may I assist?'")}
                className="absolute bottom-8 right-8 w-16 h-16 sunset-gradient text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 hover:scale-110 transition-transform z-10 active:scale-95"
             >
                <Sparkles className="w-8 h-8" />
             </button>
           </div>
        </div>
      </div>
    </div>

  );
}
