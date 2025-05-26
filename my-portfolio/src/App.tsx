import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Navbar } from './components/ui/Navbar';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  name="Your Name"
                  githubUrl="https://github.com/your-username"
                  profileImage="/profile.jpg"
                />
              }
            />
            <Route path="/portfolio" element={<div>Portfolio Page (TBD)</div>} />
            <Route path="/certificates" element={<div>Certificates Page (TBD)</div>} />
            <Route path="/gallery" element={<div>Gallery Page (TBD)</div>} />
            <Route path="/blog" element={<div>Blog Page (TBD)</div>} />
            <Route path="/about" element={<div>About Me Page (TBD)</div>} />
            <Route path="/contact" element={<div>Contact Page (TBD)</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;