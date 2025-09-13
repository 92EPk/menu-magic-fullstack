import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Clock, Flame } from "lucide-react";
import ProductCustomization from "./ProductCustomization";
import { Product, SelectedOptions } from "@/types/product";
import { useMenuItems } from "@/hooks/useDatabase";

interface FeaturedSectionProps {
  language: 'ar' | 'en';
  onAddToCart: (product: Product, quantity?: number, selectedOptions?: SelectedOptions, totalPrice?: number) => void;
}

const FeaturedSection = ({ language, onAddToCart }: FeaturedSectionProps) => {
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);
  
  // Get featured items from database
  const { menuItems } = useMenuItems();
  const featuredItems = menuItems.filter(item => item.is_featured);

  const translations = {
    ar: {
      featuredDishes: "أطباقنا المميزة",
      featuredSubtitle: "أشهر الأطباق الأكثر طلباً من قبل عملائنا",
      addToCart: "أضف للسلة",
      customize: "تخصيص",
      spicy: "حار",
      offer: "عرض خاص",
      minutes: "دقيقة",
      egp: "جنيه"
    },
    en: {
      featuredDishes: "Featured Dishes",
      featuredSubtitle: "Our most popular dishes ordered by our customers",
      addToCart: "Add to Cart",
      customize: "Customize",
      spicy: "Spicy",
      offer: "Special Offer",
      minutes: "min",
      egp: "EGP"
    }
  };

  // Convert database items to Product format
  const products: Product[] = featuredItems.map(item => ({
    id: parseInt(item.id.slice(-8), 16),
    dbId: item.id,
    name: { ar: item.name_ar, en: item.name_en },
    description: { ar: item.description_ar || '', en: item.description_en || '' },
    price: item.price,
    discountPrice: item.discount_price,
    image: item.image_url || '/placeholder.svg',
    categoryId: item.category_id,
    rating: item.rating,
    prepTime: item.prep_time,
    isSpicy: item.is_spicy,
    isOffer: item.is_offer
  }));

  const t = translations[language];
  const isRTL = language === 'ar';

  const handleProductClick = (product: Product) => {
    // Find the database item to check customization setting
    const dbItem = menuItems.find(item => item.id === product.dbId);
    
    if (dbItem?.allow_customization) {
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

  // Don't render if no featured items
  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <div>
      <section className="py-20 bg-background-cream/30" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className={`text-4xl lg:text-5xl font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {t.featuredDishes}
            </h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
              {t.featuredSubtitle}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const dbItem = menuItems.find(item => item.id === product.dbId);
              return (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="p-0 relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={product.image} 
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
                  </div>

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
                        {dbItem?.allow_customization ? t.customize : t.addToCart}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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

export default FeaturedSection;