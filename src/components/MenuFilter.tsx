import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MenuFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const categories = [
  { id: "all", label: "All Items" },
  { id: "appetizers", label: "Appetizers" },
  { id: "mains", label: "Main Courses" },
  { id: "desserts", label: "Desserts" },
  { id: "beverages", label: "Beverages" },
];

export const MenuFilter = ({ 
  activeCategory, 
  onCategoryChange, 
  searchTerm, 
  onSearchChange 
}: MenuFilterProps) => {
  return (
    <div className="bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 py-3 text-lg bg-background/50 border-accent/20 focus:border-accent/50"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "category"}
              onClick={() => onCategoryChange(category.id)}
              className="px-6 py-2"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};