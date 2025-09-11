import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Clock, Truck, Plus } from "lucide-react";
import ProductCustomization from "./ProductCustomization";
import { Product, SelectedOptions } from "@/types/product";
import { useMenuItems } from "@/hooks/useDatabase";

interface HeroSectionProps {
  language: 'ar' | 'en';
  onOrderClick: () => void;
  onAddToCart: (product: Product, quantity?: number, selectedOptions?: SelectedOptions, totalPrice?: number) => void;
}

const HeroSection = ({ language, onOrderClick, onAddToCart }: HeroSectionProps) => {
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);
  const { menuItems } = useMenuItems();
  
  // Get featured products for home page
  const featuredProducts = menuItems.slice(0, 3).map(item => ({
    id: parseInt(item.id.slice(-8), 16),
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

  const translations = {
    ar: {
      title: "طعمك المميز في مزيج واحد",
      subtitle: "اكتشف أشهى الأطباق المحضرة بعناية فائقة من أجود المكونات",
      orderNow: "اطلب الآن",
      viewMenu: "استعرض القائمة",
      fastDelivery: "توصيل سريع",
      freshIngredients: "مكونات طازجة",
      topRated: "الأفضل تقييماً",
      deliveryTime: "30-45 دقيقة"
    },
    en: {
      title: "Your Mix of Exceptional Taste",
      subtitle: "Discover the most delicious dishes prepared with great care from the finest ingredients",
      orderNow: "Order Now",
      viewMenu: "View Menu",
      fastDelivery: "Fast Delivery",
      freshIngredients: "Fresh Ingredients", 
      topRated: "Top Rated",
      deliveryTime: "30-45 minutes"
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  const handleProductClick = (product: Product) => {
    // Check if product needs customization
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
      onAddToCart(product, 1, {}, product.discountPrice || product.price);
    }
  };

  const handleCustomizedAddToCart = (product: Product, quantity: number, selectedOptions: SelectedOptions, totalPrice: number) => {
    onAddToCart(product, quantity, selectedOptions, totalPrice);
    setCustomizationProduct(null);
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center bg-gradient-to-br from-background via-background-cream to-background relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/20 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{t.topRated}</span>
            </div>
            
            <h1 className={`text-5xl lg:text-6xl font-bold mb-6 text-gradient ${isRTL ? 'font-arabic' : ''}`}>
              {t.title}
            </h1>
            
            <p className={`text-xl text-muted-foreground mb-8 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {t.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg"
                onClick={onOrderClick}
                className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse-glow"
              >
                {t.orderNow}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 hover:bg-primary/5"
                onClick={() => {
                  const menuSection = document.getElementById('menu');
                  if (menuSection) {
                    menuSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {t.viewMenu}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-accent text-accent-foreground p-2 rounded-lg">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.fastDelivery}</div>
                  <div className="text-xs text-muted-foreground">{t.deliveryTime}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-secondary text-secondary-foreground p-2 rounded-lg">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.freshIngredients}</div>
                  <div className="text-xs text-muted-foreground">100%</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.topRated}</div>
                  <div className="text-xs text-muted-foreground">4.9/5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 animate-float">
              <img 
                src="/lovable-uploads/0161c61f-e0e5-469c-b26a-59aa97cc4b86.png" 
                alt="Mix and Taste Logo" 
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
            
            {/* Floating badges */}
            <Badge className="absolute top-10 right-10 bg-accent text-accent-foreground animate-float" style={{animationDelay: '0.5s'}}>
              {language === 'ar' ? 'جودة عالية' : 'High Quality'}
            </Badge>
            
            <Badge className="absolute bottom-20 left-10 bg-secondary text-secondary-foreground animate-float" style={{animationDelay: '1.5s'}}>
              {language === 'ar' ? 'طعم أصيل' : 'Authentic Taste'}
            </Badge>
          </div>
        </div>

        {/* Featured Products on Home */}
        {featuredProducts.length > 0 && (
          <div className="mt-16">
            <h3 className={`text-2xl font-bold text-center mb-8 ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'أطباق مميزة' : 'Featured Dishes'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-card rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src={product.image} 
                    alt={product.name[language]}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className={`font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                    {product.name[language]}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">
                      {product.discountPrice || product.price} {language === 'ar' ? 'جنيه' : 'EGP'}
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => handleProductClick(product)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {language === 'ar' ? 'أضف' : 'Add'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
    </section>
  );
};

export default HeroSection;