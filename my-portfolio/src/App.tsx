import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // I should include Download later on.
import NetworkNodes from '@/components/NetworkNodes';
import { ProjectSelector, type Project } from '@/components/ProjectSelector';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Navbar } from './components/ui/Navbar';
import './App.css'
import sageAiBanner from '@/assets/sage-ai banner.jpg';

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
      image: "/placeholder.svg?height=800&width=600",
      description: "A comprehensive application serving specific ecosystem needs.",
    },
    {
      title: "Clinic Management Systm.",
      category: "Healthcare Software",
      image: "/placeholder.svg?height=800&width=600",
      description: "A full-scale system handling patient records and appointments.",
    },
    {
      title: "SAGE.AI",
      category: "Software Engineering",
      image: sageAiBanner,
      description: "A Text-Adventure Game that adapts to the player's choices with AI-powered storytelling.",
    },
    {
      title: "RoomDeserv - Room Mngt.",
      category: "Hospitality Management",
      image: "/placeholder.svg?height=800&width=600",
      description: "Booking and logistical management application for facilities.",
    },
    {
      title: "SoloDungeon - MD Calculator",
      category: "Game Tool",
      image: "/placeholder.svg?height=800&width=600",
      description: "Stat calculator to optimize player runs and mechanics.",
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
          
          <ProjectSelector projects={projects} />
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