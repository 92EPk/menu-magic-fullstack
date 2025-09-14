import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Plus, Minus, Trash2, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types/product";

interface CartSidebarProps {
  language: 'ar' | 'en';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const CartSidebar = ({ 
  language, 
  isOpen, 
  onOpenChange, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onCheckout
}: CartSidebarProps) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const { toast } = useToast();

  const translations = {
    ar: {
      yourCart: "سلة التسوق",
      emptyCart: "السلة فارغة",
      emptyCartDesc: "أضف بعض الأطباق الشهية",
      subtotal: "المجموع الفرعي",
      delivery: "التوصيل",
      total: "الإجمالي",
      checkout: "إتمام الطلب",
      free: "مجاني",
      egp: "ج.م"
    },
    en: {
      yourCart: "Shopping Cart",
      emptyCart: "Empty Cart",
      emptyCartDesc: "Add some delicious dishes",
      subtotal: "Subtotal",
      delivery: "Delivery",
      total: "Total",
      checkout: "Checkout",
      free: "Free",
      egp: "EGP"
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.totalPrice || item.discountPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const deliveryFee = subtotal >= 150 ? 0 : 15;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    console.log('Checkout button clicked!');
    console.log('Cart items:', cartItems);
    console.log('Total:', total);
    
    // Since this is just a cart sidebar, call the onCheckout prop
    // The parent component will handle the actual checkout flow
    onCheckout();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-full sm:max-w-md p-0 h-full flex flex-col"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <SheetHeader className="p-3 pb-2 border-b">
          <SheetTitle className={`flex items-center gap-2 text-base ${isRTL ? 'font-arabic' : ''}`}>
            <ShoppingCart className="h-4 w-4" />
            {t.yourCart}
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="text-xs">{cartItems.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className={`text-base font-semibold mb-1 ${isRTL ? 'font-arabic' : ''}`}>
              {t.emptyCart}
            </h3>
            <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {t.emptyCartDesc}
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-3 py-2">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-2 p-2 bg-muted/30 rounded-lg border">
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name[language]}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-xs leading-tight mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                          {item.name[language]}
                        </h4>
                        <div className="text-primary font-semibold text-sm mb-1">
                          {item.discountPrice || item.price} {t.egp}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-2 w-2" />
                            </Button>
                            <span className="w-6 text-center text-xs font-medium bg-background rounded px-1">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-2 w-2" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Fixed Bottom Section */}
            <div className="border-t bg-background p-3 space-y-3">
              {/* Order Summary */}
              <div className="bg-muted/30 p-2 rounded space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={isRTL ? 'font-arabic' : ''}>{t.subtotal}:</span>
                  <span>{subtotal} {t.egp}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={isRTL ? 'font-arabic' : ''}>{t.delivery}:</span>
                  <span>
                    {deliveryFee === 0 ? t.free : `${deliveryFee} ${t.egp}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-sm">
                  <span className={isRTL ? 'font-arabic' : ''}>{t.total}:</span>
                  <span className="text-primary">{total} {t.egp}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full h-10 text-sm font-semibold bg-primary hover:bg-primary/90"
                onClick={handlePlaceOrder}
              >
                <span className={isRTL ? 'font-arabic' : ''}>{t.checkout}</span>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;