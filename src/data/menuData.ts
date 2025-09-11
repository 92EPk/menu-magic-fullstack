export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  isSignature?: boolean;
}

export const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: "app1",
    name: "Truffle Arancini",
    description: "Crispy risotto balls stuffed with aged parmesan and black truffle, served with roasted garlic aioli",
    price: "$16",
    category: "appetizers",
    isSignature: true,
  },
  {
    id: "app2",
    name: "Seared Scallops",
    description: "Pan-seared diver scallops with cauliflower purée, pancetta crisps, and micro herbs",
    price: "$22",
    category: "appetizers",
  },
  {
    id: "app3",
    name: "Burrata Caprese",
    description: "Fresh burrata cheese with heirloom tomatoes, basil oil, and aged balsamic reduction",
    price: "$18",
    category: "appetizers",
  },
  {
    id: "app4",
    name: "Duck Liver Mousse",
    description: "Silky duck liver mousse with cherry compote, toasted brioche, and pickled shallots",
    price: "$19",
    category: "appetizers",
  },

  // Main Courses
  {
    id: "main1",
    name: "Wagyu Beef Tenderloin",
    description: "Prime wagyu tenderloin with roasted bone marrow, seasonal vegetables, and red wine jus",
    price: "$65",
    category: "mains",
    isSignature: true,
  },
  {
    id: "main2",
    name: "Pan-Roasted Halibut",
    description: "Atlantic halibut with lemon risotto, grilled asparagus, and brown butter sauce",
    price: "$42",
    category: "mains",
  },
  {
    id: "main3",
    name: "Rack of Lamb",
    description: "Herb-crusted rack of lamb with ratatouille, goat cheese, and rosemary jus",
    price: "$48",
    category: "mains",
  },
  {
    id: "main4",
    name: "Lobster Ravioli",
    description: "House-made ravioli filled with Maine lobster, served in a light cream sauce with fresh herbs",
    price: "$38",
    category: "mains",
  },
  {
    id: "main5",
    name: "Vegetarian Wellington",
    description: "Roasted vegetables and wild mushrooms wrapped in flaky pastry with red wine reduction",
    price: "$32",
    category: "mains",
  },

  // Desserts
  {
    id: "des1",
    name: "Chocolate Soufflé",
    description: "Warm dark chocolate soufflé with vanilla bean ice cream and raspberry coulis",
    price: "$14",
    category: "desserts",
    isSignature: true,
  },
  {
    id: "des2",
    name: "Tiramisu",
    description: "Classic Italian tiramisu with espresso-soaked ladyfingers and mascarpone cream",
    price: "$12",
    category: "desserts",
  },
  {
    id: "des3",
    name: "Lemon Tart",
    description: "Meyer lemon curd tart with Italian meringue and candied lemon zest",
    price: "$11",
    category: "desserts",
  },
  {
    id: "des4",
    name: "Affogato",
    description: "Vanilla gelato 'drowned' in hot espresso, served with amaretti cookies",
    price: "$9",
    category: "desserts",
  },

  // Beverages
  {
    id: "bev1",
    name: "Bella Vista Signature Cocktail",
    description: "House-infused gin with elderflower, cucumber, and fresh lime",
    price: "$16",
    category: "beverages",
    isSignature: true,
  },
  {
    id: "bev2",
    name: "Chianti Classico",
    description: "2019 Castello di Ama, Tuscany - Rich and full-bodied with notes of cherry and spice",
    price: "$15",
    category: "beverages",
  },
  {
    id: "bev3",
    name: "Craft Beer Selection",
    description: "Rotating selection of local craft beers on tap",
    price: "$8",
    category: "beverages",
  },
  {
    id: "bev4",
    name: "Artisan Coffee",
    description: "Single-origin espresso sourced from small farms, prepared by our trained baristas",
    price: "$5",
    category: "beverages",
  },
];

export const getItemsByCategory = (category: string) => {
  if (category === "all") return menuItems;
  return menuItems.filter(item => item.category === category);
};

export const searchItems = (items: MenuItem[], searchTerm: string) => {
  if (!searchTerm.trim()) return items;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerSearchTerm) ||
    item.description.toLowerCase().includes(lowerSearchTerm)
  );
};