import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus, Star, Clock, Flame, ShoppingCart } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import ProductCustomization from "@/components/ProductCustomization";
import { Product, SelectedOptions, CartItem } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useMenuItems, useCategories } from "@/hooks/useDatabase";

const FullMenu = () => {
  const [language] = useState<'ar' | 'en'>('ar');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  // Database hooks
  const { menuItems, loading } = useMenuItems();
  const { categories: dbCategories } = useCategories();

  const translations = {
    ar: {
      fullMenu: "القائمة الكاملة",
      menuSubtitle: "استكشف جميع أطباقنا الشهية المحضرة بعناية فائقة",
      backToHome: "العودة للرئيسية",
      all: "الكل",
      mains: "الأطباق الرئيسية", 
      appetizers: "المقبلات",
      desserts: "الحلويات",
      beverages: "المشروبات",
      addToCart: "أضف للسلة",
      spicy: "حار",
      offer: "عرض خاص",
      minutes: "دقيقة",
      egp: "جنيه",
      cartCount: "عنصر في السلة"
    },
    en: {
      fullMenu: "Full Menu",
      menuSubtitle: "Explore all our delicious dishes prepared with exceptional care",
      backToHome: "Back to Home",
      all: "All",
      mains: "Main Dishes",
      appetizers: "Appetizers", 
      desserts: "Desserts",
      beverages: "Beverages",
      addToCart: "Add to Cart",
      spicy: "Spicy",
      offer: "Special Offer",
      minutes: "min",
      egp: "EGP",
      cartCount: "items in cart"
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

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('mixandtaste-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mixandtaste-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Convert database items to Product format
  const products: Product[] = menuItems.map(item => ({
    id: parseInt(item.id.slice(-8), 16), // Convert UUID to number for compatibility
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

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.categoryId === selectedCategory);

  const t = translations[language];
  const isRTL = language === 'ar';

  const handleAddToCart = (product: Product, quantity: number = 1, selectedOptions: SelectedOptions = {}, totalPrice?: number) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = { 
          ...product, 
          quantity,
          selectedOptions,
          totalPrice: totalPrice || product.discountPrice || product.price
        };
        return [...currentItems, newItem];
      }
    });

    toast({
      title: language === 'ar' ? 'تم إضافة المنتج' : 'Product Added',
      description: language === 'ar' ? 'تم إضافة المنتج إلى السلة بنجاح' : 'Product added to cart successfully',
    });
  };

  const handleProductClick = (product: Product) => {
    console.log('FullMenu - Product clicked:', product);
    console.log('FullMenu - Product categoryId:', product.categoryId);
    console.log('FullMenu - Product dbId:', product.dbId);
    
    // Find the database item to check customization setting
    const dbItem = menuItems.find(item => item.id === product.dbId);
    console.log('FullMenu - Database item found:', dbItem);
    console.log('FullMenu - Allow customization:', dbItem?.allow_customization);
    
    if (dbItem?.allow_customization) {
      console.log('FullMenu - Opening customization dialog');
      setCustomizationProduct(product);
    } else {
      console.log('FullMenu - Adding directly to cart');
      // Add directly to cart for simple products
      handleAddToCart(product, 1, {}, product.discountPrice || product.price);
    }
  };

  const handleCustomizedAddToCart = (product: Product, quantity: number, selectedOptions: SelectedOptions, totalPrice: number) => {
    handleAddToCart(product, quantity, selectedOptions, totalPrice);
    setCustomizationProduct(null);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(currentItems => 
      currentItems.filter(item => item.id !== id)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
            <span className="font-medium">{t.backToHome}</span>
          </Link>
          
          <h1 className="text-xl font-bold text-primary">Mix & Taste</h1>
          
          <Button 
            variant="outline" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4 ml-2" />
            السلة
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className={`text-4xl lg:text-5xl font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t.fullMenu}
          </h1>
          <p className={`text-xl text-muted-foreground max-w-3xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t.menuSubtitle}
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${isRTL ? 'font-arabic' : ''} transition-all duration-300 hover:scale-105`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const dbItem = menuItems.find(item => item.id === product.dbId);
                return (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <CardHeader className="p-0 relative">
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

                  <p className={`text-sm text-muted-foreground mb-4 line-clamp-2 ${isRTL ? 'font-arabic' : ''}`}>
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
                      {dbItem?.allow_customization 
                        ? (language === 'ar' ? 'تخصيص' : 'Customize')
                        : t.addToCart}
                    </Button>
                  </div>
                </CardContent>
                </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">لا توجد منتجات في هذه الفئة</p>
            </div>
          )}
        </div>
      </section>

      {/* Cart Sidebar */}
      <CartSidebar
        language={language}
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          // في FullMenu، نفتح السلة فقط - يمكن إضافة OrderSidebar لاحقاً إذا لزم الأمر
          console.log('Checkout from FullMenu');
        }}
      />

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

export default FullMenu;