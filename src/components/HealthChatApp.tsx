import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  image?: string;
}

const HealthChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello I am your Health Assistant.",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const webhookUrl = "https://prathamsinh.app.n8n.cloud/webhook/c88e119d-9908-4f13-acf9-7229de515385";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendToWebhook = async (message: string, image?: File) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      if (image) {
        formData.append('image', image);
      }
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.text();
      
      // Parse JSON response and extract output field
      try {
        const jsonResponse = JSON.parse(result);
        return jsonResponse.output || result;
      } catch (parseError) {
        // If not valid JSON, return original text
        return result;
      }
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  };

  const handleSendMessage = async (messageText: string, image?: File) => {
    if (!messageText.trim() && !image) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
      image: image ? URL.createObjectURL(image) : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to webhook
      const response = await sendToWebhook(messageText, image);
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || "I received your message and I'm processing it. Please wait for a detailed response.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      
      toast({
        title: "Message sent",
        description: "Your health query has been processed successfully.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to send message. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background-gradient text-foreground">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:relative z-50 h-screen md:h-full`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-border bg-card-gradient p-3 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10 hover:bg-health-subtle"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold bg-health-gradient bg-clip-text text-transparent">
                  Health Assistant
                </h1>
                <p className="text-muted-foreground text-sm mt-1 hidden md:block">
                  Your AI-powered health companion for personalized advice and support
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
                image={message.image}
              />
            ))}
            
            {isLoading && (
              <div className="flex gap-4 p-6 bg-health-subtle">
                <div className="w-10 h-10 bg-health-gradient rounded-lg flex items-center justify-center shadow-health">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground mb-2">Health Assistant</div>
                  <div className="text-muted-foreground">Analyzing your health query...</div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Area */}
        <div className="border-t border-border bg-card-gradient p-3 shadow-lg">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default HealthChatApp;