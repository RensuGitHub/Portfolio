import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


interface LandingPageProps {
  name: string;
  githubUrl: string;
  profileImage: string;
}

export function LandingPage({ name, githubUrl, profileImage }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center space-y-6">
        <img
          src={profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-primary"
        />
        <h1 className="text-4xl font-bold text-foreground">{name}</h1>
        <p className="text-lg text-muted-foreground">
          Aspiring Full-Stack Developer | Building the Future
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub Profile
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/portfolio">View Portfolio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}