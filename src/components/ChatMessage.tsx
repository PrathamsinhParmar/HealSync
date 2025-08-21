import { Heart, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  timestamp?: Date;
  image?: string;
}

const ChatMessage = ({ message, isBot = false, timestamp, image }: ChatMessageProps) => {
  return (
    <div className={`flex gap-4 p-6 ${isBot ? 'bg-health-subtle' : 'bg-transparent'}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isBot ? 'bg-health-gradient shadow-health' : 'bg-secondary'
      }`}>
        {isBot ? (
          <Heart className="w-6 h-6 text-white" />
        ) : (
          <User className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {isBot ? "Health Assistant" : "You"}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        
        {image && (
          <div className="max-w-sm">
            <img 
              src={image} 
              alt="Uploaded content" 
              className="rounded-lg border border-border max-w-full h-auto"
            />
          </div>
        )}
        
        <div className="text-foreground whitespace-pre-wrap leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;