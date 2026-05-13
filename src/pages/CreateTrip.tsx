import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MapPin, Calendar, DollarSign, ArrowRight, Loader2 } from "lucide-react";
import { generateItinerary } from "../lib/gemini";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { cn } from "../lib/utils";

export default function CreateTrip({ user }: { user: User | null }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [itinerary, setItinerary] = useState<any>(null);

  const [formData, setFormData] = useState({
    destination: searchParams.get("q") || "",
    days: 3,
    budget: 1000,
    interests: [] as string[],
  });

  const loadingMessages = [
    "Consulting local experts...",
    "Optimizing your routes...",
    "Finding hidden gems...",
    "Calculating the perfect budget...",
    "Almost there, breathtaking views ahead!"
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleGenerate = async () => {
    if (!user) {
      alert("Please sign in to generate a trip.");
      return;
    }
    setLoading(true);
    try {
      const result = await generateItinerary(formData);
      setItinerary(result);
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !itinerary) return;
    try {
      const docRef = await addDoc(collection(db, "trips"), {
        ...formData,
        userId: user.uid,
        itinerary,
        status: "planning",
        createdAt: serverTimestamp(),
      });
      navigate(`/trip/${docRef.id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "trips");
    }
  };

  const interestsOptions = ["Adventure", "Food", "Culture", "Relaxation", "Nightlife", "Nature", "Shopping", "History"];

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">Expedition Planning / 01</span>
                <h1 className="font-serif text-5xl font-light tracking-tight">Traversal <span className="italic">Parameters</span></h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Target Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="e.g. Bali, Indonesia"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full glass rounded-2xl py-5 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-all font-light"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Temporal Duration (Days)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                      className="w-full glass rounded-2xl py-5 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-all font-light"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Resource Allocation ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                      className="w-full glass rounded-2xl py-5 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-all font-light"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Interest Vectors</label>
                  <div className="flex flex-wrap gap-3">
                    {interestsOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => {
                          const newInterests = formData.interests.includes(interest)
                            ? formData.interests.filter(i => i !== interest)
                            : [...formData.interests, interest];
                          setFormData({ ...formData, interests: newInterests });
                        }}
                        className={cn(
                          "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                          formData.interests.includes(interest)
                            ? "sunset-gradient text-white shadow-lg shadow-primary/20"
                            : "glass text-white/40 hover:text-white"
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !formData.destination}
                  className="flex items-center space-x-4 px-10 py-5 sunset-gradient text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/30 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{loadingMessages[msgIndex]}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Compute Itinerary</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && itinerary && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12 pb-20"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">Computed Itinerary</span>
                  <h2 className="font-serif text-4xl font-light tracking-tight italic">{formData.destination}</h2>
                </div>
                <button
                  onClick={handleSave}
                  className="px-8 py-4 sunset-gradient text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  Sync to Vault
                </button>
              </div>

              <div className="space-y-20">
                {(itinerary as any[]).map((day: any) => (
                  <div key={day.day} className="relative">
                    <div className="sticky top-24 glass border-x-0 rounded-none z-10 px-8 py-5 mb-10 -mx-4 sm:mx-0 sm:rounded-2xl sm:border-x">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-serif italic tracking-tight">Day {day.day} — {day.date}</p>
                        <span className="font-mono text-[10px] opacity-40 uppercase tracking-tighter">Segment: 0{day.day}</span>
                      </div>
                    </div>
                    <div className="space-y-12 pl-10 relative">
                      <div className="itinerary-line absolute left-[15px] top-4 bottom-4" />
                      {day.activities.map((activity: any, idx: number) => (
                        <div key={idx} className="group relative flex space-x-8">
                           <div className="absolute left-[-29px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-bg-dark shadow-[0_0_15px_rgba(255,107,53,0.5)] group-hover:scale-125 transition-transform" />
                           <div className="flex-1 space-y-3">
                             <div className="flex items-center justify-between">
                               <span className="text-primary font-mono text-[10px] tracking-widest">{activity.time}</span>
                               <span className="glass px-2.5 py-1 rounded text-[9px] uppercase font-bold text-white/40 tracking-widest leading-none border-white/5">{activity.type}</span>
                             </div>
                             <h4 className="text-2xl font-serif italic tracking-tight text-white group-hover:text-primary transition-colors">{activity.title}</h4>
                             <p className="text-white/40 text-sm leading-relaxed font-light max-w-2xl">{activity.description}</p>
                             <div className="flex items-center space-x-8 pt-4">
                               <div className="flex items-center text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">
                                 <MapPin className="w-3.5 h-3.5 mr-2 text-primary/40" />
                                 {activity.location}
                               </div>
                               <div className="flex items-center text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">
                                 <DollarSign className="w-3.5 h-3.5 mr-2 text-primary/40" />
                                 {activity.cost}
                               </div>
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
