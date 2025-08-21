import { Heart, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={`bg-sidebar-gradient border-r border-border w-20 flex flex-col items-center py-6 ${className}`}>
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-health-gradient rounded-lg flex items-center justify-center shadow-health">
          <Heart className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* Auth Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl hover:bg-health-subtle text-muted-foreground hover:text-foreground transition-smooth"
          title="Login"
        >
          <LogIn className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl hover:bg-health-subtle text-muted-foreground hover:text-foreground transition-smooth"
          title="Sign Up"
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;