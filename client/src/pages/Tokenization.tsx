import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, TrendingUp, ShieldCheck, Activity, Globe, Wallet } from "lucide-react";

export default function Tokenization() {
  const analytics = trpc.blockchain.getAnalytics.useQuery();
  const performance = trpc.blockchain.getPerformance.useQuery({ tokenId: "token-1" });
  const marketplace = trpc.blockchain.getMarketplace.useQuery({ tokenId: "token-1" });

  const stats = [
    { label: "Total Value Tokenized", value: `₵${(analytics.data?.totalValueTokenized || 0).toLocaleString()}`, icon: Database, color: "text-blue-600" },
    { label: "Active Traders", value: (analytics.data?.activeTraders || 0).toLocaleString(), icon: Globe, color: "text-purple-600" },
    { label: "Market Cap", value: `₵${(analytics.data?.marketCap || 0).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600" },
    { label: "Yield Distributed", value: `₵${(analytics.data?.totalYieldDistributed || 0).toLocaleString()}`, icon: Wallet, color: "text-amber-600" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900">Loan Tokenization</h1>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">BETA</Badge>
          </div>
          <p className="text-muted-foreground">Blockchain-powered loan pool securitization and secondary market analytics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                Active Loan Pool Performance
              </CardTitle>
              <CardDescription>Real-time secondary market trading activity for VIN-1 pool.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="text-lg font-bold">₵{performance.data?.performance["1d"]}%</p>
                    <p className="text-[10px] text-emerald-600 font-medium">↑ 0.5% (24h)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Holders</p>
                    <p className="text-lg font-bold">{performance.data?.totalHolders}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Avg. Yield</p>
                    <p className="text-lg font-bold">{(performance.data?.averageYield || 0) * 100}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Risk Rating</p>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">LOW-MED</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Pool Liquidity</span>
                    <span className="font-bold">₵{(marketplace.data?.liquidity || 0).toLocaleString()}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="rounded-xl border bg-muted/20 p-4">
                  <h4 className="text-sm font-semibold mb-3">Order Book (VIN-1)</h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Buy Orders</p>
                      {marketplace.data?.buyOrders.map((order, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="font-mono">{order.price}</span>
                          <span className="text-muted-foreground">{order.quantity} units</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Sell Orders</p>
                      {marketplace.data?.sellOrders.map((order, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="font-mono">{order.price}</span>
                          <span className="text-muted-foreground">{order.quantity} units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Token Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-tight">Contract Address</span>
                  <code className="text-[10px] bg-muted p-2 rounded break-all font-mono leading-relaxed">
                    0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                  </code>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Network</span>
                    <span className="text-sm font-bold flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Polygon
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Standard</span>
                    <span className="text-sm font-bold">ERC-20</span>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-800">Top Holders</h4>
                  {performance.data?.topHolders.map((holder, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-dashed last:border-0">
                      <span className="text-muted-foreground font-mono text-[10px]">{holder.address.slice(0, 8)}...</span>
                      <span className="font-bold">{holder.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
