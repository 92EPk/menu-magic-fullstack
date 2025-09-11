import { useState } from "react";
import { MenuHero } from "@/components/MenuHero";
import { MenuFilter } from "@/components/MenuFilter";
import { MenuSection } from "@/components/MenuSection";
import { menuItems, getItemsByCategory, searchItems } from "@/data/menuData";
import appetizersImage from "@/assets/appetizers.jpg";
import mainsImage from "@/assets/mains.jpg";
import dessertsImage from "@/assets/desserts.jpg";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = searchItems(
    getItemsByCategory(activeCategory),
    searchTerm
  );

  const groupedItems = {
    appetizers: filteredItems.filter(item => item.category === "appetizers"),
    mains: filteredItems.filter(item => item.category === "mains"),
    desserts: filteredItems.filter(item => item.category === "desserts"),
    beverages: filteredItems.filter(item => item.category === "beverages"),
  };

  const shouldShowSection = (category: string, items: any[]) => {
    return activeCategory === "all" || activeCategory === category || items.length > 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <MenuHero />
      
      <MenuFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="pb-16">
        {shouldShowSection("appetizers", groupedItems.appetizers) && groupedItems.appetizers.length > 0 && (
          <MenuSection
            title="Appetizers"
            image={appetizersImage}
            items={groupedItems.appetizers}
          />
        )}

        {shouldShowSection("mains", groupedItems.mains) && groupedItems.mains.length > 0 && (
          <MenuSection
            title="Main Courses"
            image={mainsImage}
            items={groupedItems.mains}
          />
        )}

        {shouldShowSection("desserts", groupedItems.desserts) && groupedItems.desserts.length > 0 && (
          <MenuSection
            title="Desserts"
            image={dessertsImage}
            items={groupedItems.desserts}
          />
        )}

        {shouldShowSection("beverages", groupedItems.beverages) && groupedItems.beverages.length > 0 && (
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-12">
                Beverages
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {groupedItems.beverages.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        {item.name}
                        {item.isSignature && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                            Signature
                          </span>
                        )}
                      </h3>
                      <span className="text-xl font-bold text-primary ml-4 shrink-0">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No items found matching your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
