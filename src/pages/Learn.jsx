import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import TermCard from '@/components/cards/TermCard';
import CategoryCard from '@/components/cards/CategoryCard';
import { mockTerms, getCategories } from '@/data/mockTerms';

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = getCategories();

  const filteredTerms = useMemo(() => {
    return mockTerms.filter(term => {
      const matchesSearch = 
        term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Tech Vocabulary 📚
          </h1>
          <p className="text-muted-foreground">
            Browse and learn technical terms with real-world examples
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant={showFilters ? 'default' : 'secondary'} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="mb-8 p-4 bg-muted rounded-xl animate-in slide-in-from-top-2 duration-300">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Category Cards (when no filters shown) */}
        {!showFilters && !searchQuery && !selectedCategory && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                termCount={category.count}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setShowFilters(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredTerms.length}</span> terms
            {selectedCategory && (
              <span> in <span className="font-semibold text-primary">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Terms Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTerms.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </div>

        {/* No Results */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No terms found matching your search.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Learn;
