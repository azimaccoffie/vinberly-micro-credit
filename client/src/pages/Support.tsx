import { useState } from "react";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, ShieldCheck, Clock, ArrowLeft } from "lucide-react";

export default function Support() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Vinberly AI Assistant. How can I help you today? I can answer questions about loans, status tracking, document requirements, and more."
    }
  ]);

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (response) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.content
      }]);
    }
  });

  const faqs = trpc.ai.faqs.useQuery({});

  const handleSendMessage = (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate({ message: content });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#D4D0C8]">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'} className="text-emerald-700">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1B5E3F] to-[#2A8659] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl text-[#2A2A2A]">Vinberly Support</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/marketplace" className="text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors">Marketplace</a>
            <a href="/blog" className="text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors">Blog</a>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900">Support Center</h1>
            <p className="text-muted-foreground">Get instant help from our AI assistant or browse common questions.</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AIChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={chatMutation.isPending}
              className="h-[600px] shadow-lg border-emerald-100"
              suggestedPrompts={[
                "How do I apply for a loan?",
                "What documents are required?",
                "Check my application status",
                "Tell me about interest rates"
              ]}
            />
            
            <Card className="border-emerald-50 border-t-4 border-t-emerald-600">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Quick answers to common questions about our services.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.data?.map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                      <AccordionTrigger className="text-left font-medium hover:text-emerald-700">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-emerald-900 text-emerald-50 border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Need Human Help?</CardTitle>
                <CardDescription className="text-emerald-200/80">Our support team is available Mon-Fri, 8am-6pm.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-800 flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Average Response Time</p>
                    <p className="text-xs text-emerald-300">Under 2 hours</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm">Email: <span className="font-medium">support@vinberly.com</span></p>
                  <p className="text-sm">Phone: <span className="font-medium">+233 245 678 901</span></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  AI Assistant Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>• Be specific about your request (e.g., "status of application 1234")</p>
                <p>• You can ask for loan calculations or document checklists</p>
                <p>• If the AI can't help, ask to "speak with an agent"</p>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
