import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import OffersSection from "@/components/OffersSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import OrderSidebar from "@/components/OrderSidebar";
import { Product, SelectedOptions, CartItem } from "@/types/product";

const Index = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

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

  const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
    setLanguage(newLanguage);
  };

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
        return [...currentItems, { 
          ...product, 
          quantity,
          selectedOptions,
          totalPrice: totalPrice || product.discountPrice || product.price
        } as CartItem];
      }
    });
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

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleOrderClick = () => {
    if (cartItems.length > 0) {
      setIsOrderOpen(true);
    } else {
      setIsCartOpen(true);
    }
  };

  const handleOrderComplete = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        language={language}
        onLanguageChange={handleLanguageChange}
        cartItemsCount={cartItemsCount}
        onCartClick={handleCartClick}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection 
          language={language}
          onOrderClick={handleOrderClick}
        />

        {/* Menu Section */}
        <MenuSection 
          language={language}
          onAddToCart={handleAddToCart}
        />

        {/* Offers Section */}
        <OffersSection 
          language={language}
          onAddToCart={handleAddToCart}
        />

        {/* Contact Section */}
        <ContactSection 
          language={language}
        />
      </main>

      {/* Footer */}
      <Footer 
        language={language}
      />

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
          setIsCartOpen(false);
          setIsOrderOpen(true);
        }}
      />

      {/* Order Sidebar */}
      <OrderSidebar
        language={language}
        isOpen={isOrderOpen}
        onOpenChange={setIsOrderOpen}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
};

export default Index;