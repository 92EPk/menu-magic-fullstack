import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Check } from "lucide-react";
import { Product, PRODUCT_CATEGORIES, PRODUCT_OPTIONS, SelectedOptions, ProductOption } from "@/types/product";

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
  const [secondaryOptions, setSecondaryOptions] = useState<SelectedOptions>({});

  const isRTL = language === 'ar';
  const category = PRODUCT_CATEGORIES[product.categoryId];
  
  const translations = {
    ar: {
      customize: "تخصيص طلبك",
      baseIncludes: "يشمل الطبق",
      chooseOptions: "اختر من الخيارات التالية",
      required: "مطلوب",
      optional: "اختياري", 
      quantity: "الكمية",
      totalPrice: "السعر الإجمالي",
      addToCart: "أضف للسلة",
      egp: "جنيه",
      breadType: "نوع العيش",
      sauceType: "نوع الصوص",
      presentation: "طريقة التقديم",
      pastaSauce: "صوص المكرونة",
      selectOption: "اختر..."
    },
    en: {
      customize: "Customize Your Order",
      baseIncludes: "Base dish includes",
      chooseOptions: "Choose from the following options",
      required: "Required",
      optional: "Optional",
      quantity: "Quantity", 
      totalPrice: "Total Price",
      addToCart: "Add to Cart",
      egp: "EGP",
      breadType: "Bread Type",
      sauceType: "Sauce Type", 
      presentation: "Presentation",
      pastaSauce: "Pasta Sauce",
      selectOption: "Select..."
    }
  };

  const t = translations[language];

  // Reset selections when product changes
  useEffect(() => {
    setSelectedOptions({});
    setSecondaryOptions({});
    setQuantity(1);
  }, [product.id]);

  const getOptionsByType = (type: string): ProductOption[] => {
    return category?.availableOptions?.filter(option => option.type === type) || [];
  };

  const isRequiredOption = (type: string): boolean => {
    return category?.requiredOptions?.includes(type) || false;
  };

  const calculateTotalPrice = (): number => {
    let basePrice = product.discountPrice || product.price;
    
    // Add option prices
    Object.values(selectedOptions).forEach(optionId => {
      const option = category?.availableOptions?.find(opt => opt.id === optionId);
      if (option?.price) {
        basePrice += option.price;
      }
    });

    Object.values(secondaryOptions).forEach(optionId => {
      const option = category?.availableOptions?.find(opt => opt.id === optionId);
      if (option?.price) {
        basePrice += option.price;
      }
    });

    return basePrice * quantity;
  };

  const handleOptionSelect = (optionType: string, optionId: string) => {
    if (optionType === 'presentation') {
      setSelectedOptions({ ...selectedOptions, [optionType]: optionId });
      // Clear secondary options when presentation changes
      setSecondaryOptions({});
    } else {
      setSelectedOptions({ ...selectedOptions, [optionType]: optionId });
    }
  };

  const handleSecondaryOptionSelect = (optionType: string, optionId: string) => {
    setSecondaryOptions({ ...secondaryOptions, [optionType]: optionId });
  };

  const isValidSelection = (): boolean => {
    if (!category) return false;
    
    // Check if all required options are selected
    for (const requiredType of category.requiredOptions) {
      if (!selectedOptions[requiredType]) {
        return false;
      }
    }

    // Check secondary options based on presentation
    const presentation = selectedOptions.presentation;
    if (presentation === 'sandwich' && (product.categoryId === 'meat' || product.categoryId === 'chicken')) {
      return !!secondaryOptions.bread;
    }
    if (presentation === 'meal_pasta' && (product.categoryId === 'meat' || product.categoryId === 'chicken')) {
      return !!secondaryOptions.pasta_sauce;
    }

    return true;
  };

  const handleAddToCart = () => {
    if (!isValidSelection()) return;
    
    const allOptions = { ...selectedOptions, ...secondaryOptions };
    onAddToCart(product, quantity, allOptions, calculateTotalPrice());
    onClose();
  };

  const renderOptionGroup = (
    optionType: string, 
    title: string, 
    isRequired: boolean = false,
    isSecondary: boolean = false
  ) => {
    const options = getOptionsByType(optionType);
    if (!options.length) return null;

    const selectedValue = isSecondary ? secondaryOptions[optionType] : selectedOptions[optionType];
    const handleSelect = isSecondary ? handleSecondaryOptionSelect : handleOptionSelect;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>
            {title}
          </h4>
          {isRequired && (
            <Badge variant="destructive" className="text-xs">
              {t.required}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <Button
              key={option.id}
              variant={selectedValue === option.id ? "default" : "outline"}
              className={`justify-start text-sm h-auto py-3 ${isRTL ? 'font-arabic' : ''}`}
              onClick={() => handleSelect(optionType, option.id)}
            >
              <div className="flex items-center gap-2 w-full">
                {selectedValue === option.id && (
                  <Check className="h-3 w-3" />
                )}
                <div className="flex-1 text-start">
                  <div>{option.name[language]}</div>
                  {option.price && (
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

  const shouldShowSecondaryOptions = () => {
    const presentation = selectedOptions.presentation;
    return presentation === 'sandwich' || presentation === 'meal_pasta';
  };

  if (!category) return null;

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
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <img 
              src={product.image} 
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

          {/* Base includes */}
          <div className="bg-secondary/10 p-4 rounded-lg">
            <h4 className={`font-medium mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {t.baseIncludes}:
            </h4>
            <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {category.baseIncludes[language]}
            </p>
          </div>

          <Separator />

          {/* Primary Options */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${isRTL ? 'font-arabic' : ''}`}>
              {t.chooseOptions}
            </h3>
            
            {product.categoryId === 'burger' && (
              <>
                {renderOptionGroup('bread', t.breadType, true)}
                {renderOptionGroup('sauce', t.sauceType, true)}
              </>
            )}

            {(product.categoryId === 'meat' || product.categoryId === 'chicken') && (
              renderOptionGroup('presentation', t.presentation, true)
            )}
          </div>

          {/* Secondary Options */}
          {shouldShowSecondaryOptions() && (
            <>
              <Separator />
              <div className="space-y-4">
                {selectedOptions.presentation === 'sandwich' && (
                  renderOptionGroup('bread', t.breadType, true, true)
                )}
                {selectedOptions.presentation === 'meal_pasta' && (
                  renderOptionGroup('pasta_sauce', t.pastaSauce, true, true)
                )}
              </div>
            </>
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
            disabled={!isValidSelection()}
          >
            {t.addToCart}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomization;