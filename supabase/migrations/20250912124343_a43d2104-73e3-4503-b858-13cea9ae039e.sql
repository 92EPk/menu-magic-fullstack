-- Enable RLS (idempotent)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Categories policies
DO $$ BEGIN
  CREATE POLICY "Categories are insertable by everyone"
  ON public.categories FOR INSERT
  WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Categories are updatable by everyone"
  ON public.categories FOR UPDATE
  USING (true)
  WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Categories are deletable by everyone"
  ON public.categories FOR DELETE
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Menu items policies
DO $$ BEGIN
  CREATE POLICY "Menu items are insertable by everyone"
  ON public.menu_items FOR INSERT
  WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Menu items are updatable by everyone"
  ON public.menu_items FOR UPDATE
  USING (true)
  WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Menu items are deletable by everyone"
  ON public.menu_items FOR DELETE
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Orders policies
DO $$ BEGIN
  CREATE POLICY "Orders are viewable by everyone"
  ON public.orders FOR SELECT
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Orders are updatable by everyone"
  ON public.orders FOR UPDATE
  USING (true)
  WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Order items policies
DO $$ BEGIN
  CREATE POLICY "Order items are viewable by everyone"
  ON public.order_items FOR SELECT
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Update triggers for updated_at
DO $$ BEGIN
  CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;