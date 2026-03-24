import { useState } from 'react';
import { ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface Project {
  title: string;
  category: string;
  image: string;
  description: string;
  span?: number;
}

interface ProjectSelectorProps {
  projects: Project[];
}

export function ProjectSelector({ projects }: ProjectSelectorProps) {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const handleNextProject = () => {
    setSelectedProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrevProject = () => {
    setSelectedProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Helper to get normalized distance considering wrapping
  const getNormalizedDistance = (idx: number, selected: number, length: number) => {
    const diff = idx - selected;
    // Normalize difference for closest wrap distance
    if (diff > length / 2) return diff - length;
    if (diff < -length / 2) return diff + length;
    return diff;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[700px] gap-12 items-center justify-center">
      {/* Left Menu Selector */}
      <div className="w-full md:w-2/5 flex flex-col items-center justify-center space-y-8">
        <button onClick={handlePrevProject} className="text-gray-500 hover:text-white transition-colors p-2 hidden md:block">
          <ChevronUp size={40} />
        </button>
        
        <div className="flex flex-col items-center justify-center w-full relative h-[500px] overflow-hidden mask-image-y">
          {projects.map((project, rawIdx) => {
            const distance = getNormalizedDistance(rawIdx, selectedProjectIndex, projects.length);
            const isSelected = distance === 0;
            
            // Do not render items that are too far away
            if (Math.abs(distance) > 2) return null;

            // Calculate the curved position based on distance
            const translateY = distance * 110;
            // Emulate 3D push back and rotation for non-selected
            const scale = 1 - Math.abs(distance) * 0.15;
            const rotateX = distance * -15; // tilt top/bottom edges away
            const opacity = isSelected ? 1 : Math.max(0.1, 1 - Math.abs(distance) * 0.4);

            return (
              <div 
                key={project.title} 
                onClick={() => setSelectedProjectIndex(rawIdx)}
                className={`
                  cursor-pointer transition-all duration-500 flex items-center justify-center absolute
                  ${isSelected ? 'z-10' : 'z-0'}
                `}
                style={{
                  top: `calc(50% - 48px)`,
                  transform: `translateY(${translateY}px) scale(${scale}) perspective(600px) rotateX(${rotateX}deg)`,
                  opacity: opacity,
                }}
              >
                <div className={`
                  border px-4 w-64 md:w-80 h-24 flex flex-col items-center justify-center text-center transition-all duration-500
                  ${isSelected 
                    ? 'border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.4)] bg-white/10' 
                    : 'border-gray-700 text-gray-400 bg-black/50'}
                `}>
                  <span className={`font-medium tracking-widest uppercase transition-all duration-500 leading-tight ${isSelected ? 'text-lg md:text-xl font-bold' : 'text-sm md:text-base'}`}>
                    {project.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleNextProject} className="text-gray-500 hover:text-white transition-colors p-2 hidden md:block">
          <ChevronDown size={40} />
        </button>

        {/* Mobile controls */}
        <div className="flex md:hidden gap-8 mt-4">
          <button onClick={handlePrevProject} className="text-gray-300 p-2"><ChevronUp size={32} className="-rotate-90" /></button>
          <button onClick={handleNextProject} className="text-gray-300 p-2"><ChevronDown size={32} className="-rotate-90" /></button>
        </div>
      </div>

      {/* Right Display Area */}
      <div className="w-full md:w-3/5 h-[650px] relative overflow-visible group flex items-center justify-center">
        {projects.map((project, idx) => (
          <div 
            key={`img-${idx}`}
            className={`absolute transition-all duration-700 ease-in-out w-full flex justify-center items-center ${idx === selectedProjectIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'}`}
          >
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-0 bg-white/5 blur-3xl -z-10 rounded-full"></div>
              <img src={project.image} alt={project.title} className="w-full h-auto object-contain max-h-[600px] md:max-h-[700px] drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 rounded-xl" />
              
              <div className="absolute -bottom-16 left-0 right-0 text-center bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-2xl">
                 <Badge variant="outline" className="w-fit mb-4 mx-auto border-white/30 text-white bg-white/10 px-4 py-1 text-sm">{project.category}</Badge>
                 <h3 className="text-4xl font-bold mb-3 text-white">{project.title}</h3>
                 <p className="text-gray-300 text-lg mb-6 leading-relaxed">{project.description}</p>
                 <button className="flex items-center gap-3 mx-auto text-white hover:text-gray-300 transition-colors w-fit group/link font-medium tracking-widest text-lg">
                    VIEW PROJECT <ArrowRight size={20} className="group-hover/link:translate-x-3 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
