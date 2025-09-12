-- Add customization control and featured status to menu_items
ALTER TABLE public.menu_items 
ADD COLUMN allow_customization boolean DEFAULT false,
ADD COLUMN is_featured boolean DEFAULT false;

-- Create special_offers table for managing special offers from admin panel
CREATE TABLE public.special_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  discount_percentage integer,
  discount_amount numeric,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for special_offers
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

-- Create policies for special_offers
CREATE POLICY "Special offers are viewable by everyone"
ON public.special_offers FOR SELECT
USING (true);

CREATE POLICY "Special offers are insertable by everyone"
ON public.special_offers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Special offers are updatable by everyone"
ON public.special_offers FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Special offers are deletable by everyone"
ON public.special_offers FOR DELETE
USING (true);

-- Add trigger for special_offers updated_at
CREATE TRIGGER update_special_offers_updated_at
BEFORE UPDATE ON public.special_offers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();