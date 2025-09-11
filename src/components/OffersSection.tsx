import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Gift, Percent, ArrowRight } from "lucide-react";
import { Product, SelectedOptions } from "@/types/product";
import ProductCustomization from "./ProductCustomization";
import familyMealImage from "@/assets/offer-family-meal.jpg";
import pizzaDiscountImage from "@/assets/offer-pizza-discount.jpg";
import { useMenuItems } from "@/hooks/useDatabase";

interface OffersSectionProps {
  language: 'ar' | 'en';
  onAddToCart: (product: Product, quantity?: number, selectedOptions?: any, totalPrice?: number) => void;
}

const OffersSection = ({ language, onAddToCart }: OffersSectionProps) => {
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);
  
  // Get real offers from database
  const { menuItems } = useMenuItems();
  const realOffers = menuItems.filter(item => item.is_offer);
  const translations = {
    ar: {
      specialOffers: "عروضنا الخاصة",
      offersSubtitle: "لا تفوت هذه العروض المحدودة والخصومات الحصرية",
      limitedTime: "وقت محدود",
      orderNow: "اطلب الآن",
      save: "وفر",
      validUntil: "ساري حتى",
      off: "خصم"
    },
    en: {
      specialOffers: "Special Offers",
      offersSubtitle: "Don't miss these limited-time offers and exclusive discounts",
      limitedTime: "Limited Time",
      orderNow: "Order Now", 
      save: "Save",
      validUntil: "Valid until",
      off: "OFF"
    }
  };

  // Convert database offers to Product format
  const offers = realOffers.map(item => ({
    id: parseInt(item.id.slice(-8), 16),
    name: { ar: item.name_ar, en: item.name_en },
    description: { ar: item.description_ar || '', en: item.description_en || '' },
    price: item.price,
    discountPrice: item.discount_price,
    image: item.image_url || familyMealImage, // Fallback image
    categoryId: "offer",
    rating: item.rating,
    prepTime: item.prep_time,
    isSpicy: item.is_spicy,
    isOffer: true,
    // Additional offer-specific properties for display
    discount: item.discount_price ? Math.round(((item.price - item.discount_price) / item.price) * 100) : 0,
    validUntil: "2024-03-31", // You could add this to database later
    badge: { ar: "عرض خاص", en: "Special Deal" },
    color: "bg-gradient-to-r from-primary to-primary-dark"
  }));

  const t = translations[language];
  const isRTL = language === 'ar';

  const handleOfferClick = (offer: Product) => {
    // Check if offer needs customization
    const needsCustomization = ['burger', 'meat', 'chicken'].some(type => 
      offer.name.en.toLowerCase().includes(type) || 
      offer.name.ar.includes('برجر') || 
      offer.name.ar.includes('لحم') || 
      offer.name.ar.includes('دجاج') ||
      offer.name.ar.includes('فراخ')
    );
    
    if (needsCustomization) {
      setCustomizationProduct(offer);
    } else {
      onAddToCart(offer, 1, {}, offer.discountPrice || offer.price);
    }
  };

  const handleCustomizedAddToCart = (product: Product, quantity: number, selectedOptions: SelectedOptions, totalPrice: number) => {
    onAddToCart(product, quantity, selectedOptions, totalPrice);
    setCustomizationProduct(null);
  };

  return (
    <section id="offers" className="py-20 bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl lg:text-5xl font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t.specialOffers}
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t.offersSubtitle}
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <Card key={offer.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={offer.image} 
                    alt={offer.name[language]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Badge overlay */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {(offer as any).badge[language]}
                    </Badge>
                  </div>
                  
                  {/* Discount badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-bold">
                      {(offer as any).discount}% {t.off}
                    </div>
                  </div>
                  
                  {/* Timer indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-sm">
                    <Timer className="h-4 w-4" />
                    <span>{t.limitedTime}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title and Description */}
                  <h3 className={`text-xl font-bold mb-2 text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                    {offer.name[language]}
                  </h3>
                  
                  <p className={`text-muted-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                    {offer.description[language]}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {offer.discountPrice}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'جنيه' : 'EGP'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg text-muted-foreground line-through">
                        {offer.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'السعر الأصلي' : 'Original'}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center">
                      <div className="text-accent font-bold">
                        {t.save} {offer.price - offer.discountPrice!} {language === 'ar' ? 'جنيه' : 'EGP'}
                      </div>
                    </div>
                  </div>

                  {/* Valid Until */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{t.validUntil}: {(offer as any).validUntil}</span>
                    <Gift className="h-4 w-4" />
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="hero"
                    size="lg"
                    className="w-full group-hover:scale-105 transition-transform"
                    onClick={() => handleOfferClick(offer)}
                  >
                    {t.orderNow}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-6 py-3 rounded-full mb-4">
            <Percent className="h-5 w-5" />
            <span className={`font-semibold ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'المزيد من العروض قريباً!' : 'More offers coming soon!'}
            </span>
          </div>
        </div>
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

export default OffersSection;