import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Check } from "lucide-react";
import { Product, SelectedOptions } from "@/types/product";
import { useCustomizationOptions } from "@/hooks/useDatabase";

interface ProductCustomizationProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedOptions: SelectedOptions, totalPrice: number) => void;
  language: 'ar' | 'en';
}

const ProductCustomization = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  language
}: ProductCustomizationProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const { customizationOptions, loading } = useCustomizationOptions();
  
  // Filter options by product's category and active status
  const availableOptions = customizationOptions.filter(option => 
    option.category_id === product.categoryId && option.is_active
  ).sort((a, b) => a.sort_order - b.sort_order);

  const isRTL = language === 'ar';
  
  const translations = {
    ar: {
      customize: "تخصيص طلبك",
      customizeDescription: "اختر الخيارات التي تفضلها لطبقك",
      chooseOptions: "اختر من الخيارات التالية",
      required: "مطلوب",
      optional: "اختياري", 
      quantity: "الكمية",
      totalPrice: "السعر الإجمالي",
      addToCart: "أضف للسلة",
      egp: "جنيه",
      loading: "جاري التحميل..."
    },
    en: {
      customize: "Customize Your Order",
      customizeDescription: "Choose your preferred options for your dish",
      chooseOptions: "Choose from the following options",
      required: "Required",
      optional: "Optional",
      quantity: "Quantity", 
      totalPrice: "Total Price",
      addToCart: "Add to Cart",
      egp: "EGP",
      loading: "Loading..."
    }
  };

  const t = translations[language];

  // Reset selections when product changes
  useEffect(() => {
    setSelectedOptions({});
    setQuantity(1);
  }, [product.id]);

  // Get customization options for this product's category
  const productOptions = customizationOptions.filter(option => 
    option.category_id === product.categoryId && option.is_active
  );

  // Group options by type
  const optionsByType = productOptions.reduce((acc, option) => {
    if (!acc[option.option_type]) {
      acc[option.option_type] = [];
    }
    acc[option.option_type].push(option);
    return acc;
  }, {} as Record<string, typeof productOptions>);

  const calculateTotalPrice = (): number => {
    let basePrice = product.discountPrice || product.price;
    
    // Add option prices
    Object.values(selectedOptions).forEach(optionId => {
      const option = productOptions.find(opt => opt.id === optionId);
      if (option?.price) {
        basePrice += option.price;
      }
    });

    return basePrice * quantity;
  };

  const handleOptionSelect = (optionType: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionType]: optionId }));
  };

  const isValidSelection = (): boolean => {
    // Check if all required option types are selected
    const requiredTypes = Object.keys(optionsByType).filter(type => {
      return optionsByType[type].some(option => option.is_required);
    });

    for (const requiredType of requiredTypes) {
      if (!selectedOptions[requiredType]) {
        return false;
      }
    }

    return true;
  };

  const handleAddToCart = () => {
    if (!isValidSelection()) return;
    
    onAddToCart(product, quantity, selectedOptions, calculateTotalPrice());
    onClose();
  };

  const renderOptionGroup = (optionType: string, options: typeof productOptions) => {
    if (!options.length) return null;

    const isRequired = options.some(option => option.is_required);
    const selectedValue = selectedOptions[optionType];

    // Get type display name
    const typeNames = {
      bread: { ar: "نوع العيش", en: "Bread Type" },
      sauce: { ar: "نوع الصوص", en: "Sauce Type" },
      presentation: { ar: "طريقة التقديم", en: "Presentation" },
      pasta_sauce: { ar: "صوص المكرونة", en: "Pasta Sauce" },
      size: { ar: "الحجم", en: "Size" },
      extras: { ar: "إضافات", en: "Extras" }
    };

    const typeName = typeNames[optionType as keyof typeof typeNames] || 
      { ar: optionType, en: optionType };

    return (
      <div key={optionType} className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
            {typeName[language]}
          </h4>
          {isRequired && (
            <Badge variant="destructive" className="text-xs">
              {t.required}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {options.map((option) => (
            <Button
              key={option.id}
              variant={selectedValue === option.id ? "default" : "outline"}
              className={`justify-start text-sm h-auto py-3 ${isRTL ? 'font-arabic' : ''}`}
              onClick={() => handleOptionSelect(optionType, option.id)}
            >
              <div className="flex items-center gap-2 w-full">
                {selectedValue === option.id && (
                  <Check className="h-3 w-3" />
                )}
                <div className="flex-1 text-start">
                  <div>{language === 'ar' ? option.name_ar : option.name_en}</div>
                  {option.price > 0 && (
                    <div className="text-xs text-muted-foreground">
                      +{option.price} {t.egp}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md max-h-[90vh] overflow-y-auto" 
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <DialogHeader>
          <DialogTitle className={`text-xl ${isRTL ? 'font-arabic' : ''}`}>
            {t.customize}
          </DialogTitle>
          <DialogDescription className={`${isRTL ? 'font-arabic' : ''}`}>
            {t.customizeDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <img 
              src={product.image || '/placeholder.svg'} 
              alt={product.name[language]}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className={`font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                {product.name[language]}
              </h3>
              <p className={`text-sm text-muted-foreground mt-1 ${isRTL ? 'font-arabic' : ''}`}>
                {product.description[language]}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customization Options */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {t.loading}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className={`font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                {t.chooseOptions}
              </h3>
              
              {Object.keys(optionsByType).length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {language === 'ar' ? 'لا توجد خيارات تخصيص متاحة' : 'No customization options available'}
                </div>
              ) : (
                Object.entries(optionsByType).map(([optionType, options]) => 
                  renderOptionGroup(optionType, options)
                )
              )}
            </div>
          )}

          <Separator />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {t.quantity}:
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <span className={`font-semibold ${isRTL ? 'font-arabic' : ''}`}>
              {t.totalPrice}:
            </span>
            <span className="text-xl font-bold text-primary">
              {calculateTotalPrice()} {t.egp}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={!isValidSelection() || loading}
          >
            {t.addToCart}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomization;