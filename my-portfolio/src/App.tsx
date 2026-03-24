import { useState, useEffect } from 'react';
import { Menu, X, ChevronUp, ChevronDown } from 'lucide-react'; // I should include Download later on.
import NetworkNodes from '@/components/NetworkNodes';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Navbar } from './components/ui/Navbar';
import './App.css'
import sageAiBanner from '@/assets/sage-ai banner.jpg';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const handleNextProject = () => {
    setSelectedProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrevProject = () => {
    setSelectedProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "projects", "about", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(`${section}-section`)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`${sectionId}-section`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ]

  const projects = [
    {
      title: "SAGE.AI",
      category: "Software Engineering",
      image: sageAiBanner,
      description: "A Text-Adventure Game that adapts to the player's choices with AI-powered storytelling.",
    },
    {
      title: "Project Alpha",
      category: "Web Development",
      image: "/placeholder.svg?height=800&width=600",
      description: "A modern web application built with React and TailwindCSS.",
    },
    {
      title: "Neon Skies",
      category: "Game Design",
      image: "/placeholder.svg?height=800&width=600",
      description: "A cyberpunk themed 2D platformer with neon visuals.",
    },
    {
      title: "Data Dash",
      category: "Data Science",
      image: "/placeholder.svg?height=800&width=600",
      description: "Interactive dashboard for visualizing complex analytics.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.slice(0, 2).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    activeSection === item.id ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="text-xl font-bold">
              SHWC<span className="text-red-500">.</span>GRVC
            </div>

            {/* Right Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.slice(2).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    activeSection === item.id ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left py-2 px-4 text-sm font-medium transition-colors hover:text-white ${
                      activeSection === item.id ? "text-white bg-gray-800" : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <section id="home-section" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0,0,0,0.7)), url('/placeholder.svg?height=1080&width=1920')",
          }}
        />
        <NetworkNodes />
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white">Unleash</h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-12">the visions of creativity.</h2>
          <div className="flex flex-col items-center">
            <div className="w-px h-16 bg-white/30 mb-4"></div>
            <button
              onClick={() => scrollToSection("projects")}
              className="flex flex-col items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center mb-2">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
              </div>
              <span>Scroll</span>
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects-section" className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-widest text-white uppercase">Projects</h2>
          </div>
          
          <div className="flex flex-col md:flex-row min-h-[500px] gap-8 items-center justify-center">
            {/* Left Menu Selector */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-6">
              <button onClick={handlePrevProject} className="text-gray-500 hover:text-white transition-colors p-2 hidden md:block">
                <ChevronUp size={32} />
              </button>
              
              <div className="flex flex-col items-center justify-center w-full relative h-[300px] overflow-hidden mask-image-y">
                {projects.map((project, idx) => {
                  const isSelected = idx === selectedProjectIndex;
                  return (
                    <div 
                      key={project.title} 
                      onClick={() => setSelectedProjectIndex(idx)}
                      className={`
                        cursor-pointer transition-all duration-500 flex items-center justify-center absolute
                        ${isSelected ? 'opacity-100 z-10' : 'opacity-40 hover:opacity-70'}
                      `}
                      style={{
                        top: `calc(50% - 24px + ${(idx - selectedProjectIndex) * 70}px)`
                      }}
                    >
                      <div className={`
                        border px-6 py-3 w-48 md:w-64 text-center transition-all duration-500
                        ${isSelected 
                          ? 'border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                          : 'border-gray-700 text-gray-400 bg-black/50'}
                      `}>
                        <span className={`font-medium tracking-widest uppercase transition-all duration-500 ${isSelected ? 'text-lg font-bold' : 'text-sm'}`}>
                          {project.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={handleNextProject} className="text-gray-500 hover:text-white transition-colors p-2 hidden md:block">
                <ChevronDown size={32} />
              </button>

              {/* Mobile controls */}
              <div className="flex md:hidden gap-8 mt-4">
                <button onClick={handlePrevProject} className="text-gray-300 p-2"><ChevronUp size={24} className="-rotate-90" /></button>
                <button onClick={handleNextProject} className="text-gray-300 p-2"><ChevronDown size={24} className="-rotate-90" /></button>
              </div>
            </div>

            {/* Right Display Area */}
            <div className="w-full md:w-1/2 h-[450px] relative overflow-visible group flex items-center justify-center">
              {projects.map((project, idx) => (
                <div 
                  key={`img-${idx}`}
                  className={`absolute transition-all duration-700 ease-in-out w-full flex justify-center items-center ${idx === selectedProjectIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'}`}
                >
                  <div className="relative w-full max-w-sm">
                    {/* To make it look like a character selection, the image floats a bit above. I add a subtle glow. */}
                    <div className="absolute inset-0 bg-white/5 blur-3xl -z-10 rounded-full"></div>
                    <img src={project.image} alt={project.title} className="w-full h-auto object-contain max-h-[500px] drop-shadow-2xl transition-transform duration-700 hover:scale-105" />
                    
                    <div className="absolute -bottom-12 left-0 right-0 text-center bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
                       <p className="text-gray-300 text-sm">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Placeholder */}
      <section id="about-section" className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">About Me</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
                Passionate developer focused on building AI-driven experiences and elegant software solutions.
            </p>
        </div>
      </section>

      {/* Contact Section - Placeholder */}
      <section id="contact-section" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
            <p className="text-gray-400 mb-8">Ready to start your next project?</p>
            <a href="mailto:contact@shwc.grvc" className="inline-block px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                Email Me
            </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl font-bold mb-6">
            SHWC<span className="text-red-500">.</span>GRVC
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white">
              Facebook
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Reddit
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              YouTube
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            Copyright © 2025 All rights reserved. Website Portfolio by Garvy Ren V. Capalac
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App;