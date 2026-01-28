import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to Vinberly Micro-Credit. How can we help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      let botResponse = "";

      const lowerInput = inputValue.toLowerCase();

      if (
        lowerInput.includes("loan") ||
        lowerInput.includes("borrow") ||
        lowerInput.includes("credit")
      ) {
        botResponse =
          "We offer flexible micro-credit solutions with quick approval (24-48 hours), competitive interest rates, and flexible repayment terms. Would you like to apply for a loan?";
      } else if (lowerInput.includes("interest") || lowerInput.includes("rate")) {
        botResponse =
          "Our interest rates are competitive and tailored to your business profile. The exact rate depends on your loan amount, business type, and repayment term. Contact us for a personalized quote!";
      } else if (
        lowerInput.includes("apply") ||
        lowerInput.includes("application")
      ) {
        botResponse =
          "To apply for a loan, click the 'Apply Now' button on our homepage. You'll need to provide basic business information and loan details. The process takes about 5 minutes!";
      } else if (lowerInput.includes("contact") || lowerInput.includes("phone")) {
        botResponse =
          "You can reach us at +233 (0) 598 656 465 or email info@vinberlymicro-credit.com. We're available Monday-Friday, 9 AM - 5 PM.";
      } else if (lowerInput.includes("approval") || lowerInput.includes("how long")) {
        botResponse =
          "Most applications are reviewed within 24-48 hours. You'll receive updates via email and SMS. Check your application status anytime using our loan tracker!";
      } else if (lowerInput.includes("business") || lowerInput.includes("type")) {
        botResponse =
          "We support various business types including retail, services, manufacturing, and more. Whether you're a startup or established business, we have solutions for you!";
      } else if (lowerInput.includes("thanks") || lowerInput.includes("thank you")) {
        botResponse =
          "You're welcome! Is there anything else I can help you with today?";
      } else {
        botResponse =
          "That's a great question! For more specific inquiries, please contact our team at +233 (0) 598 656 465 or email info@vinberlymicro-credit.com. We're here to help!";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-[#1B5E3F] hover:bg-[#154B2F] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 bg-white rounded-lg shadow-2xl border border-[#D4D0C8] flex flex-col h-96 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B5E3F] to-[#2A8659] text-white p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">Vinberly Support</h3>
            <p className="text-sm text-white/80">We typically reply instantly</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F7F4]/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-[#1B5E3F] text-white rounded-br-none"
                      : "bg-white text-[#2A2A2A] border border-[#D4D0C8] rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-white/70" : "text-[#666666]"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-[#2A2A2A] border border-[#D4D0C8] px-4 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#D4D0C8] p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSendMessage();
                  }
                }}
                className="border-[#D4D0C8]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-[#1B5E3F] hover:bg-[#154B2F] text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
