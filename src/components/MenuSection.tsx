import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Clock, Flame } from "lucide-react";
import ProductCustomization from "./ProductCustomization";
import { Product, SelectedOptions } from "@/types/product";
import { useMenuItems, useCategories } from "@/hooks/useDatabase";

interface MenuSectionProps {
  language: 'ar' | 'en';
  onAddToCart: (product: Product, quantity?: number, selectedOptions?: SelectedOptions, totalPrice?: number) => void;
}

const MenuSection = ({ language, onAddToCart }: MenuSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);
  
  // Database hooks
  const { menuItems, loading } = useMenuItems();
  const { categories: dbCategories } = useCategories();

  const translations = {
    ar: {
      ourMenu: "قائمة طعامنا",
      menuSubtitle: "تذوق أشهى الأطباق المحضرة بعناية فائقة وحب",
      all: "الكل",
      addToCart: "أضف للسلة",
      customize: "تخصيص",
      spicy: "حار",
      offer: "عرض خاص",
      minutes: "دقيقة",
      egp: "جنيه"
    },
    en: {
      ourMenu: "Our Menu",
      menuSubtitle: "Taste the most delicious dishes prepared with exceptional care and love",
      all: "All",
      addToCart: "Add to Cart",
      customize: "Customize",
      spicy: "Spicy",
      offer: "Special Offer",
      minutes: "min",
      egp: "EGP"
    }
  };

  // Convert database categories to filter options
  const categories = [
    { id: 'all', name: translations[language].all },
    ...dbCategories.map(cat => ({
      id: cat.id,
      name: language === 'ar' ? cat.name_ar : cat.name_en
    }))
  ];

  // Convert database items to Product format
  const products: Product[] = menuItems.map(item => ({
    id: parseInt(item.id.slice(-8), 16), // Convert UUID to number for compatibility
    dbId: item.id,
    name: { ar: item.name_ar, en: item.name_en },
    description: { ar: item.description_ar || '', en: item.description_en || '' },
    price: item.price,
    discountPrice: item.discount_price,
    image: item.image_url || '',
    categoryId: item.category_id,
    rating: item.rating,
    prepTime: item.prep_time,
    isSpicy: item.is_spicy,
    isOffer: item.is_offer
  }));
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.categoryId === selectedCategory);

  const t = translations[language];
  const isRTL = language === 'ar';

  const handleProductClick = (product: Product) => {
    // Check if product needs customization (burgers, meat, chicken)
    const needsCustomization = ['burger', 'meat', 'chicken'].some(type => 
      product.name.en.toLowerCase().includes(type) || 
      product.name.ar.includes('برجر') || 
      product.name.ar.includes('لحم') || 
      product.name.ar.includes('دجاج') ||
      product.name.ar.includes('فراخ')
    );
    
    if (needsCustomization) {
      setCustomizationProduct(product);
    } else {
      // Add directly to cart for simple products
      onAddToCart(product, 1, {}, product.discountPrice || product.price);
    }
  };

  const handleCustomizedAddToCart = (product: Product, quantity: number, selectedOptions: SelectedOptions, totalPrice: number) => {
    onAddToCart(product, quantity, selectedOptions, totalPrice);
    setCustomizationProduct(null);
  };

  return (
    <div>
      <section id="menu" className="py-20 bg-background-cream/50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className={`text-4xl lg:text-5xl font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {t.ourMenu}
            </h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
              {t.menuSubtitle}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${isRTL ? 'font-arabic' : ''} transition-all duration-300`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'جاري تحميل القائمة...' : 'Loading menu...'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardHeader className="p-0 relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={product.image || '/placeholder.svg'} 
                        alt={product.name[language]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.isOffer && (
                        <Badge className="offer-badge-special">
                          {t.offer}
                        </Badge>
                      )}
                      {product.isSpicy && (
                        <Badge className="offer-badge-discount flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {t.spicy}
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={`text-lg font-semibold text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                        {product.name[language]}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{product.prepTime} {t.minutes}</span>
                      </div>
                    </div>

                    <p className={`text-sm text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                      {product.description[language]}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.discountPrice ? (
                          <>
                            <span className="text-xl font-bold text-primary">
                              {product.discountPrice} {t.egp}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {product.price} {t.egp}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-primary">
                            {product.price} {t.egp}
                          </span>
                        )}
                      </div>

                      <Button 
                        size="sm"
                        onClick={() => handleProductClick(product)}
                        className="hover:scale-105 transition-transform"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t.addToCart}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Customization Dialog */}
      {customizationProduct && (
        <ProductCustomization
          product={customizationProduct}
          isOpen={!!customizationProduct}
          onClose={() => setCustomizationProduct(null)}
          onAddToCart={handleCustomizedAddToCart}
          language={language}
        />
      )}
    </div>
  );
};

export default MenuSection;