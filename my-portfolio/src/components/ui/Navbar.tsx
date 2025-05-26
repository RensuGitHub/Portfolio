import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="w-full bg-background border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-foreground">
          [Your Name]
        </Link>
        <div className="space-x-4">
          <Link to="/portfolio" className="text-foreground hover:text-primary">
            Portfolio
          </Link>
          <Link to="/certificates" className="text-foreground hover:text-primary">
            Certificates
          </Link>
          <Link to="/gallery" className="text-foreground hover:text-primary">
            Gallery
          </Link>
          <Link to="/blog" className="text-foreground hover:text-primary">
            Blog
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary">
            About
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}