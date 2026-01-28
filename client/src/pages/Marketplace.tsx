import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, ShoppingBag, Shield, Calculator, Briefcase, Star, ArrowLeft, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const partners = trpc.marketplace.getPartners.useQuery({});
  const services = trpc.marketplace.getServices.useQuery({});
  const purchaseMutation = trpc.marketplace.purchaseService.useMutation({
    onSuccess: () => {
      toast.success("Service purchased successfully! Our partner will contact you shortly.");
    },
    onError: (error) => {
      toast.error(`Purchase failed: ${error.message}`);
    }
  });

  const handlePurchase = (partnerId: number, serviceId: number, amount: number) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    purchaseMutation.mutate({ partnerId, serviceId, amount });
  };

  const isPurchasing = (serviceId: number) => {
    return purchaseMutation.isPending && purchaseMutation.variables?.serviceId === serviceId;
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "insurance": return <Shield className="h-5 w-5" />;
      case "accounting": return <Calculator className="h-5 w-5" />;
      case "business_services": return <Briefcase className="h-5 w-5" />;
      default: return <ShoppingBag className="h-5 w-5" />;
    }
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#1B5E3F] to-[#2A8659] rounded-lg flex items-center justify-center shadow-emerald-900/20 shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl text-[#2A2A2A] tracking-tight">Vinberly <span className="text-emerald-700">Marketplace</span></span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="/support" className="text-sm font-medium text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors">Support</a>
            <a href="/blog" className="text-sm font-medium text-[#2A2A2A] hover:text-[#1B5E3F] transition-colors">Blog</a>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard'} className="border-emerald-200 text-emerald-700">Dashboard</Button>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight text-emerald-900">Partner Marketplace</h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Grow your business with exclusive services from our trusted network. We've vetted the best providers to support your growth journey.
            </p>
          </div>

          {(partners.isError || services.isError) && (
            <Card className="bg-rose-50 border-rose-100 text-rose-900 p-6 text-center">
              <p className="font-medium">Failed to load marketplace items. Please refresh the page.</p>
              <Button variant="outline" onClick={() => window.location.reload()} className="mt-4 border-rose-200">Refresh Now</Button>
            </Card>
          )}

          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-emerald-800">Available Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="flex flex-col h-full">
                      <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /></CardHeader>
                      <CardContent className="flex-1"><Skeleton className="h-20 w-full" /></CardContent>
                      <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                    </Card>
                  ))
                ) : (
                  services.data?.map((service) => (
                    <Card key={service.serviceId} className="flex flex-col h-full hover:shadow-md transition-shadow border-emerald-50">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {service.category.replace("_", " ")}
                          </Badge>
                          <span className="text-xl font-bold text-emerald-900">₵{service.price}</span>
                        </div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        {!isAuthenticated ? (
                          <Button 
                            asChild
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2" 
                          >
                            <a href={getLoginUrl()}>
                              <LogIn className="h-4 w-4" /> Login to Purchase
                            </a>
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700" 
                            onClick={() => handlePurchase(service.partnerId, service.serviceId, service.price)}
                            disabled={purchaseMutation.isPending}
                          >
                            {isPurchasing(service.serviceId) ? "Processing..." : "Purchase Service"}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Our Featured Partners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="bg-muted/30 border-none h-48 animate-pulse" />
                  ))
                ) : (
                  partners.data?.map((partner) => (
                    <Card key={partner.partnerId} className="bg-muted/30 border-none transition-all hover:bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-4">
                          <div className="h-16 w-16 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 overflow-hidden">
                            {partner.logo ? (
                              <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML = '🏢';
                              }} />
                            ) : (
                              getIcon(partner.category)
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{partner.name}</h3>
                            <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="text-sm font-medium">{partner.rating} ({partner.reviews} reviews)</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{partner.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild 
                            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                            onClick={() => toast.info(`Opening ${partner.name} website...`)}
                          >
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              Visit Website <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
