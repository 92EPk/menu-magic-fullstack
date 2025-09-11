-- Insert sample categories
INSERT INTO public.categories (name_ar, name_en, description_ar, description_en, sort_order, is_active) VALUES
('البرجر', 'Burgers', 'أشهى أنواع البرجر المحضر بعناية', 'Delicious handcrafted burgers', 1, true),
('الدجاج', 'Chicken', 'دجاج طازج ومتبل بأفضل التوابل', 'Fresh chicken with premium spices', 2, true),
('اللحوم', 'Meat', 'لحوم طازجة عالية الجودة', 'Premium fresh meat selections', 3, true),
('المشروبات', 'Beverages', 'مشروبات منعشة ولذيذة', 'Refreshing and delicious drinks', 4, true),
('الحلويات', 'Desserts', 'حلويات شهية ومميزة', 'Delicious and special desserts', 5, true);

-- Insert sample menu items
INSERT INTO public.menu_items (category_id, name_ar, name_en, description_ar, description_en, price, discount_price, rating, prep_time, is_spicy, is_offer, is_available, sort_order) 
SELECT 
  c.id,
  'برجر مخصوص',
  'Special Burger',
  'برجر لحم بقري طازج مع الجبن والخضار',
  'Fresh beef burger with cheese and vegetables',
  45.00,
  40.00,
  4.8,
  '15-20',
  false,
  true,
  true,
  1
FROM categories c WHERE c.name_en = 'Burgers';

INSERT INTO public.menu_items (category_id, name_ar, name_en, description_ar, description_en, price, rating, prep_time, is_spicy, is_offer, is_available, sort_order) 
SELECT 
  c.id,
  'دجاج كرسبي',
  'Crispy Chicken',
  'قطع دجاج مقرمشة ولذيذة',
  'Crispy and delicious chicken pieces',
  35.00,
  4.6,
  '20-25',
  true,
  false,
  true,
  1
FROM categories c WHERE c.name_en = 'Chicken';

INSERT INTO public.menu_items (category_id, name_ar, name_en, description_ar, description_en, price, rating, prep_time, is_spicy, is_offer, is_available, sort_order) 
SELECT 
  c.id,
  'ستيك لحم',
  'Beef Steak',
  'ستيك لحم بقري طري ومتبل',
  'Tender and seasoned beef steak',
  65.00,
  4.9,
  '25-30',
  false,
  false,
  true,
  1
FROM categories c WHERE c.name_en = 'Meat';

INSERT INTO public.menu_items (category_id, name_ar, name_en, description_ar, description_en, price, discount_price, rating, prep_time, is_spicy, is_offer, is_available, sort_order) 
SELECT 
  c.id,
  'عصير برتقال طازج',
  'Fresh Orange Juice',
  'عصير برتقال طبيعي 100%',
  '100% natural orange juice',
  15.00,
  12.00,
  4.7,
  '5-10',
  false,
  true,
  true,
  1
FROM categories c WHERE c.name_en = 'Beverages';

INSERT INTO public.menu_items (category_id, name_ar, name_en, description_ar, description_en, price, rating, prep_time, is_spicy, is_offer, is_available, sort_order) 
SELECT 
  c.id,
  'كيكة شوكولاتة',
  'Chocolate Cake',
  'كيكة شوكولاتة غنية ولذيذة',
  'Rich and delicious chocolate cake',
  25.00,
  4.8,
  '10-15',
  false,
  false,
  true,
  1
FROM categories c WHERE c.name_en = 'Desserts';