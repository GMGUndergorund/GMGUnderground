import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <i className="ri-gamepad-line text-primary text-2xl"></i>
              <span className="text-xl font-gaming font-bold">
                GMG <span className="text-primary">Underground</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mt-2">Your personal gaming library</p>
          </div>
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Discord"
            >
              <i className="ri-discord-fill text-xl"></i>
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <i className="ri-twitter-fill text-xl"></i>
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <i className="ri-github-fill text-xl"></i>
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Reddit"
            >
              <i className="ri-reddit-fill text-xl"></i>
            </a>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-6 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} GMG Underground. All rights reserved. Not affiliated with any game publishers.
        </div>
      </div>
    </footer>
  );
}
