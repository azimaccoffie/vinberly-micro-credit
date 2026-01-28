import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Clock, Share2, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug;

  const { data: article, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white pb-20">
        <div className="container py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-4">Article Not Found</h2>
          <p className="text-[#666666] mb-6">The blog post you're looking for might have been moved or deleted.</p>
          <Button onClick={() => setLocation("/blog")} className="bg-[#1B5E3F]">
            Back to Blog
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#D4D0C8]">
        <div className="container flex items-center justify-between py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/blog")} 
            className="text-[#1B5E3F] hover:bg-[#1B5E3F]/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-[#666666]">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-[#1B5E3F]/10 text-[#1B5E3F] text-sm font-semibold rounded-full uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-[#666666] text-sm flex items-center gap-1">
                <Clock className="h-4 w-4" /> 5 min read
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-6 text-[#666666] border-y border-[#D4D0C8] py-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-[#1B5E3F] flex items-center justify-center text-white font-bold">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2A2A2A]">{article.author}</p>
                  <p className="text-xs">Financial Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-[#D4D0C8] pl-6">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none prose-emerald prose-headings:text-[#2A2A2A] prose-p:text-[#4A4A4A] prose-p:leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
          </div>

          {/* Article Footer */}
          <div className="mt-16 pt-8 border-t border-[#D4D0C8]">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#1B5E3F]" />
                <span className="text-sm font-medium text-[#666666]">Tags:</span>
                <span className="text-sm text-[#1B5E3F]">#BusinessGrowth</span>
                <span className="text-sm text-[#1B5E3F]">#AccraEntrepreneurs</span>
                <span className="text-sm text-[#1B5E3F]">#FinanceTips</span>
              </div>
              <Button onClick={() => setLocation("/support")} className="bg-[#1B5E3F] hover:bg-[#154B2F]">
                Need Financial Advice? Ask AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
