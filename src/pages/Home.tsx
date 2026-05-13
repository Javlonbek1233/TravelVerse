import { motion, useScroll, useTransform } from "motion/react";
import { Search, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) navigate(`/create?q=${encodeURIComponent(search)}`);
  };

  const categories = [
    { name: "Adventure", icon: Sparkles, color: "text-blue-400" },
    { name: "Culture", icon: MapPin, color: "text-orange-400" },
    { name: "Luxury", icon: TrendingUp, color: "text-purple-400" },
  ];

  return (
    <div ref={targetRef} className="relative min-h-[200vh]">
      <div className="ambient-glow-orange top-[-100px] left-[-100px]" />
      <div className="ambient-glow-blue bottom-[-50px] right-[-50px]" />

      {/* Hero Section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        {/* Cinematic Background */}
        <motion.div 
          style={{ scale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-bg-dark/20 to-bg-dark z-10" />
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" 
            alt="Travel background"
            className="w-full h-full object-cover grayscale-[0.5] contrast-[1.1]"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity, y }}
          className="relative z-20 text-center px-4 max-w-5xl mx-auto"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "circOut" }}
            >
              <h1 className="font-serif text-[12vw] leading-[0.8] font-light tracking-tight sm:text-[100px] md:text-[140px] lg:text-[180px]">
                Travel <br />
                <span className="italic font-medium text-primary">Verse</span>
              </h1>
              <p className="mt-8 text-white/40 text-[10px] md:text-xs font-semibold uppercase tracking-[0.4em] max-w-2xl mx-auto">
                AI-Powered Planetary Exploration v2.4
              </p>
            </motion.div>

            {/* AI Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-16"
            >
              <form 
                onSubmit={handleSearch}
                className="relative max-w-2xl mx-auto group"
              >
                <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <input
                  type="text"
                  placeholder="Query your next destination..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="relative w-full h-16 md:h-20 glass rounded-full px-10 pr-20 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-light tracking-tight"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-3 bottom-3 w-10 md:w-14 sunset-gradient rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl shadow-primary/20"
                >
                  <Search className="text-white w-5 h-5" />
                </button>
              </form>

              {/* Categories */}
              <div className="mt-12 flex flex-wrap justify-center gap-6">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    className="flex items-center space-x-3 px-6 py-2.5 glass rounded-full hover:bg-white/5 transition-colors group"
                  >
                    <cat.icon className={cn("w-4 h-4 transition-colors", cat.color, "group-hover:text-primary")} />
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 group-hover:text-white transition-colors">{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Featured Destinations Section */}
      <div className="relative z-30 bg-bg-dark py-32 px-4 shadow-[0_-50px_100px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 space-y-4">
            <div className="space-y-3">
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em]">Archive</span>
              <h2 className="font-serif text-5xl font-light tracking-tight">Handpicked <span className="italic">Destinations</span></h2>
            </div>
            <p className="text-white/30 text-sm font-light max-w-sm leading-relaxed">A digital curated catalog of transformations, optimized by our latest traversal models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <DestinationCard 
              title="Santorini" 
              location="Greece" 
              image="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1000" 
            />
            <DestinationCard 
              title="Kyoto" 
              location="Japan" 
              image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000" 
            />
            <DestinationCard 
              title="Amalfi" 
              location="Italy" 
              image="https://images.unsplash.com/photo-1633321088390-802bcc914b7e?auto=format&fit=crop&q=80&w=1000" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DestinationCard({ title, location, image }: { title: string, location: string, image: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer"
    >
      <img 
        src={image} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 space-y-2">
        <div className="flex items-center space-x-2 text-orange-400">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">{location}</span>
        </div>
        <h3 className="text-3xl font-black uppercase italic tracking-tighter">{title}</h3>
        <button className="text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-white/60">
          Explore Trip &rarr;
        </button>
      </div>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
