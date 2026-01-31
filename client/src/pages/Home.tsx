import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, TrendingUp, Users, Zap, Globe, LogIn, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import LoanApplicationForm from "@/components/LoanApplicationForm";
import { getLoginUrl, getMockLoginUrl } from "@/const";

/**
 * Vinberly Micro-Credit Home Page
 * Design: Modern Financial Minimalism
 * Color Scheme: Emerald Green (#1B5E3F) + Gold (#D4A574) + Coral (#E8664A)
 * Typography: Poppins (headings), Inter (body), Playfair Display (accents)
 */

export default function Home() {
  // The `useAuth` hook provides authentication state.
  // If you need login/logout, the hook exposes additional helpers — add them when used.
  const { user, isAuthenticated } = useAuth();

  const [loanAmount, setLoanAmount] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(12);

  const handleApplyNow = () => {
    toast.success("Application Started!", {
      description: "Please fill out the form below to complete your loan application.",
    });
    // Scroll to application section
    setTimeout(() => {
      const element = document.getElementById("cta-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  // Simple loan calculation
  const monthlyRate = 0.02; // 2% monthly for demonstration
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  const services = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Business Loans",
      description: "Quick and flexible loans to expand your business operations and reach new markets.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Approval",
      description: "Get approved within 24-48 hours with minimal documentation requirements.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personal Support",
      description: "Dedicated loan officers to guide you through the entire process.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Flexible Terms",
      description: "Customizable repayment schedules that fit your business cash flow.",
    },
  ];

  const testimonials = [
    {
      name: "Ama Osei",
      business: "Textile Trader",
      quote: "Vinberly helped me expand my business from a small shop to a thriving enterprise. The process was seamless!",
    },
    {
      name: "Kwesi Mensah",
      business: "Restaurant Owner",
      quote: "The loan terms were fair and the team was incredibly supportive. Highly recommended!",
    },
    {
      name: "Abena Boateng",
      business: "Fashion Designer",
      quote: "I got approved in just 2 days. This is exactly what small business owners in Accra need.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#D4D0C8] sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-[#1B5E3F] flex items-center justify-center text-white font-bold text-lg">
                V
              </div>
              <span className="text-xl font-bold text-[#2A2A2A]">Vinberly</span>
            </a>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors font-medium">Services</a>
              <a href="#calculator" className="text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors font-medium">Calculator</a>
              <a href="#testimonials" className="text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors font-medium">Testimonials</a>
              <a href="/blog" className="text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors font-medium">Blog</a>
              <a href="/support" className="text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors font-medium">Support</a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-2"
                onClick={() => window.location.href = '/dashboard'}
              >
                <User className="h-4 w-4" /> Dashboard
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  asChild
                  variant="ghost" 
                  className="text-[#2A2A2A] hover:text-emerald-700 gap-2 cursor-pointer"
                >
                  <a href="/register">
                    <User className="h-4 w-4" /> Register
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="ghost" 
                  className="text-[#2A2A2A] hover:text-emerald-700 gap-2 cursor-pointer"
                >
                  <a href="/login">
                    <LogIn className="h-4 w-4" /> Sign In
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="border-amber-600 text-amber-700 hover:bg-amber-50 gap-2"
                >
                  <a href={getMockLoginUrl()}>
                    Demo Login
                  </a>
                </Button>
              </div>
            )}
            
            <Button onClick={handleApplyNow} className="bg-[#E8664A] hover:bg-[#D85438] text-white">Apply Now</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block bg-[#1B5E3F]/10 px-4 py-2 rounded-full">
                <span className="text-[#1B5E3F] text-sm font-semibold">Empowering Entrepreneurs</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#2A2A2A] leading-tight">
                Grow Your Business with <span className="text-[#1B5E3F]">Vinberly</span>
              </h1>
              <p className="text-lg text-[#666666] leading-relaxed">
                Access flexible micro-credit solutions designed for small business owners in Accra. Quick approval, fair terms, and dedicated support to help your business thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button onClick={handleApplyNow} size="lg" className="bg-[#1B5E3F] hover:bg-[#154B2F] text-white text-base">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline" 
                  className="border-[#1B5E3F] text-[#1B5E3F] hover:bg-[#1B5E3F]/5 gap-2"
                >
                  <a href="/register">
                    <User className="w-5 h-5" /> Create Account
                  </a>
                </Button>
                <Button onClick={() => {
                  const element = document.getElementById("services");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }} size="lg" variant="outline" className="border-[#1B5E3F] text-[#1B5E3F] hover:bg-[#1B5E3F]/5">
                  Learn More
                </Button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#D4D0C8]">
                <div>
                  <div className="text-3xl font-bold text-[#1B5E3F]">2,500+</div>
                  <p className="text-sm text-[#666666]">Businesses Funded</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#1B5E3F]">₵50M+</div>
                  <p className="text-sm text-[#666666]">Loans Disbursed</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#1B5E3F]">98%</div>
                  <p className="text-sm text-[#666666]">Satisfaction Rate</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src="/images/hero-banner.png"
                alt="Professional business consultation"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D4A574]/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
              Our <span className="text-[#1B5E3F]">Services</span>
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Comprehensive financial solutions tailored to support your business growth journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-6 border-[#D4D0C8] hover-lift bg-gradient-to-br from-white to-[#F8F7F4]/50 group"
              >
                <div className="text-[#1B5E3F] mb-4 group-hover:text-[#E8664A] transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#2A2A2A] mb-3">{service.title}</h3>
                <p className="text-[#666666] leading-relaxed">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Calculator Section */}
      <section id="calculator" className="py-20 md:py-28 bg-gradient-to-br from-[#1B5E3F] to-[#154B2F] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8664A]/10 rounded-full blur-3xl"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Calculate Your Loan
            </h2>
            <p className="text-center text-[#D4A574] text-lg mb-12">
              See how much you can borrow and what your monthly payments would be.
            </p>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
              <div className="space-y-8">
                {/* Loan Amount Slider */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Loan Amount: ₵{loanAmount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E8664A]"
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-2">
                    <span>₵1,000</span>
                    <span>₵100,000</span>
                  </div>
                </div>

                {/* Loan Term Slider */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Loan Term: {loanTerm} months
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="36"
                    step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E8664A]"
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-2">
                    <span>3 months</span>
                    <span>36 months</span>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-white/20">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Monthly Payment</p>
                    <p className="text-3xl font-bold text-[#D4A574]">₵{Math.round(monthlyPayment).toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Total Interest</p>
                    <p className="text-3xl font-bold text-[#E8664A]">₵{Math.round(totalInterest).toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Total Payment</p>
                    <p className="text-3xl font-bold text-white">₵{Math.round(totalPayment).toLocaleString()}</p>
                  </div>
                </div>

                <Button onClick={handleApplyNow} className="w-full bg-[#E8664A] hover:bg-[#D85438] text-white text-base py-6">
                  Apply for This Loan
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 bg-white">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2A2A2A] mb-4">
            Success <span className="text-[#1B5E3F]">Stories</span>
          </h2>
          <p className="text-center text-[#666666] text-lg max-w-2xl mx-auto mb-16">
            Hear from entrepreneurs who have grown their businesses with Vinberly's support.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 border-[#D4D0C8] hover-lift bg-gradient-to-br from-white to-[#F8F7F4]/50">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#D4A574] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[#666666] leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t border-[#D4D0C8] pt-4">
                  <p className="font-bold text-[#2A2A2A]">{testimonial.name}</p>
                  <p className="text-sm text-[#1B5E3F]">{testimonial.business}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#1B5E3F]/5 to-[#D4A574]/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img
              src="/images/growth-illustration.png"
              alt="Financial growth illustration"
              className="rounded-2xl shadow-lg w-full h-auto"
            />
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#2A2A2A]">
                Why Choose <span className="text-[#1B5E3F]">Vinberly?</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Fast approval process - get funded in 24-48 hours",
                  "Competitive interest rates tailored to your business",
                  "Flexible repayment schedules that match your cash flow",
                  "Dedicated support team to guide your journey",
                  "No hidden fees or surprise charges",
                  "Transparent terms and conditions",
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-[#1B5E3F] flex-shrink-0 mt-1" />
                    <p className="text-[#2A2A2A] text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Application Form */}
      <section id="cta-section" className="py-20 md:py-28 bg-[#1B5E3F] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#E8664A]/10 rounded-full blur-3xl"></div>
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg text-[#D4A574] mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who have transformed their businesses with Vinberly's flexible micro-credit solutions.
            </p>
          </div>
          
          {/* Application Form */}
          <div className="mb-12">
            <LoanApplicationForm />
          </div>
          
          <div className="text-center">
            <p className="text-[#D4A574]">
              Prefer to contact us directly? Call +233 (0) 598 656 465
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A] text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1B5E3F] to-[#2A8659] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="font-bold text-lg">Vinberly</span>
              </div>
              <p className="text-white/60 text-sm">Empowering entrepreneurs in Accra, Ghana.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#calculator" className="hover:text-white transition-colors">Calculator</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>Awoshie Abrantie, Accra</li>
                <li>Lake Fianga Street</li>
                <li>+233 (0) 598 656 465</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Email</h4>
              <p className="text-white/60 text-sm">info@vinberlymicro-credit.com</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2026 Vinberly Micro-Credit. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Floating AI Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => window.location.href = "/support"}
          size="lg" 
          className="rounded-full h-16 w-16 shadow-2xl bg-[#1B5E3F] hover:bg-[#154B2F] border-4 border-white"
        >
          <Zap className="h-8 w-8 text-amber-400 fill-amber-400" />
        </Button>
      </div>
    </div>
  );
}
