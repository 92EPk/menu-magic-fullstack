-- Create customization options table
CREATE TABLE public.customization_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL, -- bread, sauce, presentation, pasta_sauce
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for customization_options
ALTER TABLE public.customization_options ENABLE ROW LEVEL SECURITY;

-- Create policies for customization_options
CREATE POLICY "Customization options are viewable by everyone"
ON public.customization_options FOR SELECT
USING (true);

CREATE POLICY "Customization options are insertable by everyone"
ON public.customization_options FOR INSERT
WITH CHECK (true);

CREATE POLICY "Customization options are updatable by everyone"
ON public.customization_options FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Customization options are deletable by everyone"
ON public.customization_options FOR DELETE
USING (true);

-- Add trigger for customization_options updated_at
CREATE TRIGGER update_customization_options_updated_at
BEFORE UPDATE ON public.customization_options
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample customization options
INSERT INTO public.customization_options (category_id, option_type, name_ar, name_en, price, is_required) VALUES
-- For burgers (assume first category is burgers)
((SELECT id FROM public.categories LIMIT 1), 'bread', 'عيش برجر عادي', 'Regular Burger Bun', 0, true),
((SELECT id FROM public.categories LIMIT 1), 'bread', 'عيش برجر مدخن', 'Smoked Burger Bun', 5, false),
((SELECT id FROM public.categories LIMIT 1), 'sauce', 'كاتشب', 'Ketchup', 0, false),
((SELECT id FROM public.categories LIMIT 1), 'sauce', 'مايونيز', 'Mayo', 0, false),
((SELECT id FROM public.categories LIMIT 1), 'sauce', 'باربكيو', 'BBQ Sauce', 3, false);

-- Create customization_groups table for linking customizations
CREATE TABLE public.customization_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT false,
  allow_multiple BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for customization_groups
ALTER TABLE public.customization_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for customization_groups
CREATE POLICY "Customization groups are viewable by everyone"
ON public.customization_groups FOR SELECT
USING (true);

CREATE POLICY "Customization groups are insertable by everyone"
ON public.customization_groups FOR INSERT
WITH CHECK (true);

CREATE POLICY "Customization groups are updatable by everyone"
ON public.customization_groups FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Customization groups are deletable by everyone"
ON public.customization_groups FOR DELETE
USING (true);

-- Add trigger for customization_groups updated_at
CREATE TRIGGER update_customization_groups_updated_at
BEFORE UPDATE ON public.customization_groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();