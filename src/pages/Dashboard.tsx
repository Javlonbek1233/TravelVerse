import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { Trip } from "../types";
import { motion } from "motion/react";
import { Calendar, MapPin, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../lib/utils";

export default function Dashboard({ user }: { user: User | null }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "trips"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedTrips = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Trip[];
        setTrips(fetchedTrips);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "trips");
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-dark pt-24 px-4 pb-20 relative overflow-hidden">
      <div className="ambient-glow-orange top-[-100px] left-[-100px]" />
      <div className="ambient-glow-blue bottom-[-50px] right-[-50px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-20 px-4">
          <div className="space-y-3">
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">Data Vault</span>
            <h1 className="font-serif text-5xl font-light tracking-tight">Active <span className="italic">Expeditions</span></h1>
          </div>
          <Link
            to="/create"
            className="flex items-center space-x-3 px-8 py-4 sunset-gradient text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Journey</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 glass rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-24 glass rounded-3xl border-dashed">
            <MapPin className="w-12 h-12 text-white/5 mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-light italic tracking-tight">Vault Empty</h3>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mt-4 mb-10">Initialize your first traversal plan.</p>
            <Link
              to="/create"
              className="inline-block px-10 py-4 sunset-gradient text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all"
            >
              Start Traversal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {trips.map((trip) => (
              <Link key={trip.id} to={`/trip/${trip.id}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative h-[450px] rounded-[2.5rem] overflow-hidden glass border-white/5 hover:border-primary/30 transition-all duration-500"
                >
                  <img
                    src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800`}
                    alt={trip.destination}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="px-4 py-1.5 glass bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                        {trip.status}
                      </div>
                      <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary transform -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-serif text-[2.5rem] font-light leading-none italic tracking-tight uppercase">{trip.destination}</h3>
                      <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-primary/40" />
                          {trip.days} Segments
                        </span>
                        <span className="flex items-center">
                          <Plus className="w-4 h-4 mr-2 text-primary/40" />
                          {formatCurrency(trip.budget)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
