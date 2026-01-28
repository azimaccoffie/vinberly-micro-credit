import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Blog() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: articles = [] } = trpc.blog.getAll.useQuery();

  const categories = ["all", "business", "finance", "tips", "success-stories"];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sampleArticles = [
    {
      id: 1,
      title: "5 Tips for Growing Your Small Business in Accra",
      slug: "5-tips-growing-business",
      excerpt:
        "Learn proven strategies to scale your business operations and increase revenue in the competitive Accra market.",
      category: "business",
      author: "Ama Osei",
      imageUrl: "/images/growth-illustration.png",
      createdAt: new Date("2026-01-15"),
    },
    {
      id: 2,
      title: "Understanding Micro-Credit: A Beginner's Guide",
      slug: "understanding-micro-credit",
      excerpt:
        "Discover how micro-credit works and why it's the perfect solution for entrepreneurs starting out.",
      category: "finance",
      author: "Kwesi Mensah",
      imageUrl: "/images/loan-calculator.png",
      createdAt: new Date("2026-01-10"),
    },
    {
      id: 3,
      title: "From Zero to Hero: Success Stories of Vinberly Clients",
      slug: "success-stories-clients",
      excerpt:
        "Read inspiring stories of entrepreneurs who transformed their businesses with Vinberly's support.",
      category: "success-stories",
      author: "Abena Boateng",
      imageUrl: "/images/community-support.png",
      createdAt: new Date("2026-01-05"),
    },
  ];

  const displayArticles = articles.length > 0 ? filteredArticles : sampleArticles.filter((a) => {
    const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1B5E3F] to-[#2A8659] text-white py-16">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4">Vinberly Blog</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Insights, tips, and success stories to help you grow your business
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-[#666666]" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#D4D0C8]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-[#1B5E3F] hover:bg-[#154B2F] text-white"
                    : "border-[#D4D0C8] text-[#2A2A2A] hover:bg-[#F8F7F4]"
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArticles.map((article) => (
              <Card
                key={article.id}
                className="border-[#D4D0C8] hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
                onClick={() => setLocation(`/blog/${article.slug}`)}
              >
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden bg-[#F8F7F4]">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-[#1B5E3F]/10 text-[#1B5E3F] text-sm font-semibold rounded-full">
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1).replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2A2A2A] mb-2 group-hover:text-[#1B5E3F] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[#666666] mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-[#666666] mb-4 border-t border-[#D4D0C8] pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/blog/${article.slug}`);
                    }}
                    variant="outline"
                    className="w-full border-[#1B5E3F] text-[#1B5E3F] hover:bg-[#1B5E3F]/5"
                  >
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#666666] text-lg">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
