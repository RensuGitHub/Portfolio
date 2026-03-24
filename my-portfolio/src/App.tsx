import { useState, useEffect } from 'react';
import { Menu, X, Mail, MapPin, Download, ArrowRight } from 'lucide-react';
import NetworkNodes from '@/components/NetworkNodes';
import { ProjectSelector, type Project } from '@/components/ProjectSelector';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Navbar } from './components/ui/Navbar';
import './App.css'
import sageAiBanner from '@/assets/sage-ai/sage-ai banner.jpg';
import nixPreview from '@/assets/sage-ai/Nix.png';
import rcvLogo from '@/assets/regulatory-compliance-verification/rcv-logo.png';
import rcvBanner from '@/assets/regulatory-compliance-verification/rcv.jpg';
import clinicLogo from '@/assets/clinic-app/jimirene-clinic-logo.png';
import clinicBg from '@/assets/clinic-app/clinic-bg.png';
import aboutMePic from '@/assets/aboutme-pic.png';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const projects: Project[] = [
    {
      title: "RCV",
      category: "Mobile Application",
      image: rcvLogo,
      bgImage: rcvBanner,
      description: "A comprehensive application serving specific ecosystem needs.",
    },
    {
      title: "Clinic Management Systm.",
      category: "Healthcare Software",
      image: clinicLogo,
      bgImage: clinicBg,
      description: "A full-scale system handling patient records and appointments.",
    },
    {
      title: "SAGE.AI",
      category: "Software Engineering",
      image: nixPreview,
      bgImage: sageAiBanner,
      description: "A Text-Adventure Game that adapts to the player's choices with AI-powered storytelling.",
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
      <ProjectSelector projects={projects} />

      {/* About Section */}
      <section id="about-section" className="py-32 bg-black relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <div className="relative w-full max-w-md mx-auto md:mx-0">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-gray-800 relative z-10 shadow-2xl">
                <img src={aboutMePic} alt="Garvy Ren" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 object-top" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/20 to-transparent blur-2xl -z-10"></div>
            </div>
            {/* Right: Text */}
            <div className="flex flex-col space-y-8">
              <div>
                <span className="text-gray-500 font-medium tracking-widest text-xs uppercase block mb-4">The Journey</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Design is the thread that connects <span className="text-red-500 italic font-serif">intent</span> to impact.
                </h2>
              </div>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>
                  I am a multidisciplinary developer focused on the intersection of human-centric architecture and digital landscapes. My work is driven by the belief that every pixel and every line of code should serve a narrative purpose.
                </p>
              </div>
              <button className="flex items-center gap-3 bg-white text-black px-8 py-4 w-fit font-bold tracking-widest text-sm uppercase hover:bg-gray-200 transition-colors rounded-sm mt-4">
                Download Resume <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-32 bg-black relative border-t border-gray-900 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-red-900/10 blur-[150px] -z-10"></div>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Text & Info */}
            <div className="flex flex-col space-y-12 pb-8">
              <div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1]">Let's start a<br/>conversation.</h2>
                <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                  Whether you have a project in mind or just want to say hi, my inbox is always open for interesting discussions.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6 text-gray-300">
                  <div className="w-14 h-14 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                    <Mail size={22} className="text-red-500" />
                  </div>
                  <span className="text-xl tracking-wide">capalac.garvybscs2022@gmail.com</span>
                </div>
                <div className="flex items-center gap-6 text-gray-300">
                  <div className="w-14 h-14 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                    <MapPin size={22} className="text-red-500" />
                  </div>
                  <span className="text-xl tracking-wide">Currently in Caloocan, Metro Manila</span>
                </div>
              </div>

              <div className="pt-12 mt-auto">
                <span className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-6 block">Find Me Online</span>
                <div className="flex gap-8 text-sm font-bold tracking-widest uppercase text-gray-400">
                  <a href="https://www.linkedin.com/in/gcapalac/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 hover:-translate-y-1 transition-all duration-300">LinkedIn</a>
                  <a href="https://github.com/RensuGitHub/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 hover:-translate-y-1 transition-all duration-300">GitHub</a>
                  <a href="https://www.instagram.com/rensudesu_/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 hover:-translate-y-1 transition-all duration-300">Instagram</a>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-[#050505] border border-gray-800 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative h-full flex flex-col justify-between">
              <form className="space-y-10 flex flex-col h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 relative group">
                    <label className="text-xs text-gray-500 font-bold tracking-widest uppercase transition-colors group-focus-within:text-red-500">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-transparent border-b border-gray-800 py-2 text-white outline-none focus:border-red-500 transition-colors placeholder:text-gray-800 font-light" />
                  </div>
                  <div className="space-y-2 relative group">
                    <label className="text-xs text-gray-500 font-bold tracking-widest uppercase transition-colors group-focus-within:text-red-500">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-transparent border-b border-gray-800 py-2 text-white outline-none focus:border-red-500 transition-colors placeholder:text-gray-800 font-light" />
                  </div>
                </div>
                
                <div className="space-y-2 relative group">
                  <label className="text-xs text-gray-500 font-bold tracking-widest uppercase transition-colors group-focus-within:text-red-500">Subject</label>
                  <input type="text" placeholder="Project Inquiry" className="w-full bg-transparent border-b border-gray-800 py-2 text-white outline-none focus:border-red-500 transition-colors placeholder:text-gray-800 font-light" />
                </div>

                <div className="space-y-2 relative group flex-grow">
                  <label className="text-xs text-gray-500 font-bold tracking-widest uppercase transition-colors group-focus-within:text-red-500">Your Message</label>
                  <textarea placeholder="Tell me about your project..." className="w-full h-32 md:h-40 bg-transparent border-b border-gray-800 py-2 text-white outline-none focus:border-red-500 transition-colors placeholder:text-gray-800 resize-none mt-2 font-light leading-relaxed"></textarea>
                </div>

                <button type="button" className="w-full bg-white text-black font-bold uppercase tracking-widest py-5 flex items-center justify-center gap-3 hover:bg-gray-200 hover:gap-5 transition-all duration-300 rounded-sm mt-auto">
                  Send Message <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl font-bold mb-6">
            SHWC<span className="text-red-500">.</span>GRVC
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://www.linkedin.com/in/gcapalac/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              LinkedIn
            </a>
            <a href="https://github.com/RensuGitHub/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              GitHub
            </a>
            <a href="https://www.instagram.com/rensudesu_/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              Instagram
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