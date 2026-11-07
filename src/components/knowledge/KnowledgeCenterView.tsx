import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Clock,
  ChevronRight,
  Shield,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KNOWLEDGE_ARTICLES, KnowledgeArticle } from '../../data/knowledgeData';

export const KnowledgeCenterView: React.FC = () => {
  const { user, toggleBookmark } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(
    KNOWLEDGE_ARTICLES[0] || null
  );

  const categories = [
    'All',
    'Tactics',
    'Formations',
    'Terminology',
    'Nutrition',
    'Recovery',
    'Academy Prep'
  ];

  const filteredArticles = KNOWLEDGE_ARTICLES.filter(art => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121217] border border-[#242430] p-5 lg:p-6 rounded-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
              <span>FOOTBALL TACTICAL REPOSITORY</span>
              <span>·</span>
              <span className="text-[#ccff00] font-bold">THE ACADEMY VAULT</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
              Football Knowledge Center
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl">
              Understand the tactical masterminds: formations, press systems, half-spaces, modern rules, and high-performance nutrition.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tactics, formations, terms..."
              className="w-full pl-9 pr-3 py-2 bg-[#0a0a0d] border border-[#272735] text-xs text-white rounded-sm focus:border-[#ccff00] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Category Pills / Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-[#20202a]">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono-sport transition-colors ${
                  isSelected
                    ? 'bg-[#ccff00] text-black font-bold'
                    : 'bg-[#181822] text-zinc-400 hover:text-white border border-[#262634]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Articles List & Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Article List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono-sport px-1">
            <span>Showing {filteredArticles.length} Articles</span>
            <span>{user.bookmarks?.length || 0} Bookmarked</span>
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredArticles.map(article => {
              const isActive = activeArticle?.id === article.id;
              const isBookmarked = user.bookmarks?.includes(article.id);

              return (
                <div
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#171722] border-[#ccff00] pl-3.5'
                      : 'bg-[#121217] border-[#242432] hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono-sport font-bold uppercase text-[#ccff00]">
                      {article.category}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleBookmark(article.id);
                      }}
                      className={`p-1 rounded-sm ${
                        isBookmarked ? 'text-[#ccff00]' : 'text-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display mb-1">
                    {article.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                  <div className="mt-2 text-[10px] text-zinc-500 font-mono-sport flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTimeMinutes} min read</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Full Article Reader */}
        <div className="lg:col-span-2">
          {activeArticle ? (
            <div className="bg-[#121217] border border-[#242430] p-6 rounded-sm space-y-6">
              <div className="border-b border-[#22222e] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-sport text-zinc-400 mb-1">
                    <span className="text-[#ccff00] font-bold uppercase">
                      {activeArticle.category}
                    </span>
                    <span>·</span>
                    <span>{activeArticle.readTimeMinutes} MIN READ</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    {activeArticle.title}
                  </h3>
                </div>

                <button
                  onClick={() => toggleBookmark(activeArticle.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono-sport border transition-colors ${
                    user.bookmarks?.includes(activeArticle.id)
                      ? 'bg-zinc-900 border-[#ccff00] text-[#ccff00]'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {user.bookmarks?.includes(activeArticle.id) ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </button>
              </div>

              {/* Summary Callout */}
              <div className="p-4 bg-[#161622] border-l-2 border-[#ccff00] rounded-sm text-xs lg:text-sm text-zinc-200 leading-relaxed italic">
                "{activeArticle.summary}"
              </div>

              {/* Core Key Points */}
              <div className="p-4 bg-[#14141c] border border-[#242432] rounded-sm space-y-2">
                <span className="text-[10px] font-mono-sport uppercase font-bold text-[#ccff00] block">
                  Core Tactical Takeaways:
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {activeArticle.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#ccff00] font-mono-sport font-bold">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* In-Depth Sections */}
              <div className="space-y-4">
                {activeArticle.contentSections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                      {sec.heading}
                    </h4>
                    <p className="text-xs lg:text-sm text-zinc-300 leading-relaxed">
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#121217] border border-[#242430] p-12 text-center rounded-sm text-zinc-500">
              Select an article to begin reading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
