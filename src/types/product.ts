// Product types with advanced options system
export interface ProductOption {
  id: string;
  type: 'bread' | 'sauce' | 'sides' | 'presentation' | 'pasta_sauce';
  name: { ar: string; en: string };
  price?: number; // additional price if any
}

export interface ProductCategory {
  id: string;
  name: { ar: string; en: string };
  type: 'burger' | 'meat' | 'chicken' | 'dessert' | 'beverage';
  baseIncludes: { ar: string; en: string }; // what comes with the base dish
  requiredOptions: string[]; // option types that must be selected
  availableOptions: ProductOption[];
}

export interface Product {
  id: number;
  dbId?: string; // original UUID from database for reliable references
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price: number;
  discountPrice?: number;
  image: string;
  categoryId: string;
  rating: number;
  prepTime: string;
  isSpicy: boolean;
  isOffer: boolean;
  customizations?: {
    allowCustomization: boolean;
    maxSelections?: number;
  };
}

export interface SelectedOptions {
  [optionType: string]: string; // optionType -> optionId
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: SelectedOptions;
  totalPrice: number; // base price + options
}

// Available product options data
export const PRODUCT_OPTIONS: { [key: string]: ProductOption[] } = {
  // Bread types
  bread: [
    { id: 'brioche', type: 'bread', name: { ar: 'عيش بريوش', en: 'Brioche Bread' } },
    { id: 'semolina', type: 'bread', name: { ar: 'عيش سيمولينا', en: 'Semolina Bread' } },
    { id: 'french', type: 'bread', name: { ar: 'عيش فرنساوي', en: 'French Bread' } },
    { id: 'lebanese', type: 'bread', name: { ar: 'عيش لبناني', en: 'Lebanese Bread' } },
    { id: 'syrian', type: 'bread', name: { ar: 'عيش سوري', en: 'Syrian Bread' } },
    { id: 'saj', type: 'bread', name: { ar: 'عيش صاج', en: 'Saj Bread' } }
  ],
  
  // Sauce types
  sauce: [
    { id: 'garlic', type: 'sauce', name: { ar: 'صوص ثوم', en: 'Garlic Sauce' } },
    { id: 'tahini', type: 'sauce', name: { ar: 'صوص طحينة', en: 'Tahini Sauce' } },
    { id: 'spicy', type: 'sauce', name: { ar: 'صوص حار', en: 'Spicy Sauce' } },
    { id: 'bbq', type: 'sauce', name: { ar: 'صوص باربكيو', en: 'BBQ Sauce' } },
    { id: 'cheese', type: 'sauce', name: { ar: 'صوص جبنة', en: 'Cheese Sauce' } }
  ],
  
  // Pasta sauces
  pasta_sauce: [
    { id: 'white', type: 'pasta_sauce', name: { ar: 'صوص أبيض', en: 'White Sauce' } },
    { id: 'red', type: 'pasta_sauce', name: { ar: 'صوص أحمر', en: 'Red Sauce' } },
    { id: 'arrabbiata', type: 'pasta_sauce', name: { ar: 'صوص آرض', en: 'Arrabbiata Sauce' } }
  ],
  
  // Presentation options
  presentation: [
    { id: 'sandwich', type: 'presentation', name: { ar: 'ساندويتش', en: 'Sandwich' } },
    { id: 'meal_pasta', type: 'presentation', name: { ar: 'وجبة مع مكرونة', en: 'Meal with Pasta' } },
    { id: 'meal_rice', type: 'presentation', name: { ar: 'وجبة مع أرز', en: 'Meal with Rice' } }
  ]
};

// Product categories with their specific options
export const PRODUCT_CATEGORIES: { [key: string]: ProductCategory } = {
  burger: {
    id: 'burger',
    name: { ar: 'البرجر', en: 'Burgers' },
    type: 'burger',
    baseIncludes: { 
      ar: 'يُقدم مع البطاطس والطماطم والبصل والخص', 
      en: 'Served with fries, tomatoes, onions, and lettuce' 
    },
    requiredOptions: ['bread', 'sauce'],
    availableOptions: [...PRODUCT_OPTIONS.bread, ...PRODUCT_OPTIONS.sauce]
  },
  
  meat: {
    id: 'meat',
    name: { ar: 'اللحوم', en: 'Meat' },
    type: 'meat',
    baseIncludes: { 
      ar: 'يُقدم مع بطاطس ومخلل', 
      en: 'Served with fries and pickles' 
    },
    requiredOptions: ['presentation'],
    availableOptions: [...PRODUCT_OPTIONS.presentation, ...PRODUCT_OPTIONS.bread, ...PRODUCT_OPTIONS.pasta_sauce]
  },
  
  chicken: {
    id: 'chicken',
    name: { ar: 'الفراخ', en: 'Chicken' },
    type: 'chicken',
    baseIncludes: { 
      ar: 'يُقدم مع بطاطس ومخلل', 
      en: 'Served with fries and pickles' 
    },
    requiredOptions: ['presentation'],
    availableOptions: [...PRODUCT_OPTIONS.presentation, ...PRODUCT_OPTIONS.bread, ...PRODUCT_OPTIONS.pasta_sauce]
  }
};