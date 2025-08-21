import { useState, useRef } from "react";
import { Send, Image, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string, image?: File) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim() || selectedImage) {
      onSendMessage(message, selectedImage || undefined);
      setMessage("");
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        toast({
          title: "Image selected",
          description: `${file.name} ready to send`,
        });
      } else {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Voice recording",
        description: "Voice input feature coming soon!",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="mb-4 p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Image: {selectedImage.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
      
      {/* Input Container */}
      <div className="relative bg-card border border-border rounded-2xl shadow-health overflow-hidden">
        <div className="flex items-center gap-2 p-3">
          {/* Text Input */}
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about your health..."
            className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Image Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-health-subtle text-muted-foreground hover:text-health-primary transition-smooth"
            >
              <Image className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            {/* Voice Input Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-smooth ${
                isRecording 
                  ? 'bg-health-primary text-white hover:bg-health-primary/90' 
                  : 'hover:bg-health-subtle text-muted-foreground hover:text-health-primary'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
            
            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!message.trim() && !selectedImage}
              className="w-10 h-10 rounded-xl bg-health-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-health transition-smooth"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;