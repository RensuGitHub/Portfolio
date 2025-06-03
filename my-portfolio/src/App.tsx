import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ExternalLink } from 'lucide-react'; // I should include Download later on.
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Navbar } from './components/ui/Navbar';
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "portfolio", "about", "services", "skills", "review", "blog", "contact"]
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
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "skills", label: "Skills" },
    { id: "review", label: "Review" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
  ]

  const portfolioItems = [
    {
      title: "Portfolio Item 1",
      category: "None",
      image: "/placeholder.svg?height=300&width=400",
      description: "None",
    },
    {
      title: "Portfolio Item 2",
      category: "None",
      image: "/placeholder.svg?height=300&width=400",
      description: "None",
    },
    {
      title: "Portfolio Item 3",
      category: "None",
      image: "/placeholder.svg?height=300&width=400",
      description: "None",
    },
    {
      title: "Portfolio Item 4",
      category: "None",
      image: "/placeholder.svg?height=300&width=400",
      description: "None",
    },
    {
      title: "Portfolio Item 5",
      category: "None",
      image: "/placeholder.svg?height=300&width=400",
      description: "None",
    },
    {
      title: "Portfolio Item 6",
      category: "None",
      image: "/placeholder.svg?height=300&width=400",
      description: "None",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.slice(0, 4).map((item) => (
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
              {navItems.slice(4).map((item) => (
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
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white">Unleash</h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-12">the visions of creativity.</h2>
          <div className="flex flex-col items-center">
            <div className="w-px h-16 bg-white/30 mb-4"></div>
            <button
              onClick={() => scrollToSection("portfolio")}
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

      {/* Portfolio Section */}
      <section id="portfolio-section" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Portfolio</h2>
            <div className="w-16 h-px bg-white mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <Card
                key={index}
                className="bg-black border-gray-800 overflow-hidden group hover:border-gray-600 transition-colors"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="text-white" size={24} />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-2">
                    {item.category}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
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