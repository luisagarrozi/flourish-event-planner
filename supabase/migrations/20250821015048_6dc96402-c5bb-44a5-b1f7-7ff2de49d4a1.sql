-- Create wedding_sites table to store website data
CREATE TABLE public.wedding_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL,
  site_url TEXT UNIQUE,
  site_title TEXT,
  published BOOLEAN DEFAULT false,
  theme_color TEXT DEFAULT '#D4A574',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_sections table for customizable content sections
CREATE TABLE public.site_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  background_image_url TEXT,
  section_order INTEGER NOT NULL DEFAULT 0,
  section_type TEXT DEFAULT 'content',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gift_lists table for wedding gifts
CREATE TABLE public.gift_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL,
  gift_name TEXT NOT NULL,
  gift_description TEXT,
  gift_price NUMERIC,
  gift_url TEXT,
  claimed BOOLEAN DEFAULT false,
  claimed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wedding_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for wedding_sites
CREATE POLICY "Users can view sites for their weddings" 
ON public.wedding_sites 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM weddings WHERE weddings.id = wedding_sites.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can create sites for their weddings" 
ON public.wedding_sites 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1 FROM weddings WHERE weddings.id = wedding_sites.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can update sites for their weddings" 
ON public.wedding_sites 
FOR UPDATE 
USING (EXISTS ( SELECT 1 FROM weddings WHERE weddings.id = wedding_sites.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can delete sites for their weddings" 
ON public.wedding_sites 
FOR DELETE 
USING (EXISTS ( SELECT 1 FROM weddings WHERE weddings.id = wedding_sites.wedding_id AND weddings.user_id = auth.uid()));

-- Create policies for site_sections
CREATE POLICY "Users can view sections for their sites" 
ON public.site_sections 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM wedding_sites ws JOIN weddings w ON ws.wedding_id = w.id WHERE ws.id = site_sections.site_id AND w.user_id = auth.uid()));

CREATE POLICY "Users can create sections for their sites" 
ON public.site_sections 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1 FROM wedding_sites ws JOIN weddings w ON ws.wedding_id = w.id WHERE ws.id = site_sections.site_id AND w.user_id = auth.uid()));

CREATE POLICY "Users can update sections for their sites" 
ON public.site_sections 
FOR UPDATE 
USING (EXISTS ( SELECT 1 FROM wedding_sites ws JOIN weddings w ON ws.wedding_id = w.id WHERE ws.id = site_sections.site_id AND w.user_id = auth.uid()));

CREATE POLICY "Users can delete sections for their sites" 
ON public.site_sections 
FOR DELETE 
USING (EXISTS ( SELECT 1 FROM wedding_sites ws JOIN weddings w ON ws.wedding_id = w.id WHERE ws.id = site_sections.site_id AND w.user_id = auth.uid()));

-- Create policies for gift_lists
CREATE POLICY "Users can view gifts for their sites" 
ON public.gift_lists 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM wedding_sites ws JOIN weddings w ON ws.wedding_id = w.id WHERE ws.id = gift_lists.site_id AND w.user_id = auth.uid()));

CREATE POLICY "Users can create gifts for their sites" 
ON public.gift_lists 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1 FROM wedding_sites ws JOIN weddings w ON ws.wedding_id = w.id WHERE ws.id = gift_lists.site_id AND w.user_id = auth.uid()));

CREATE POLICY "Users can update gifts for their sites" 
ON public.gift_lists 
FOR UPDATE 
USING (EXISTS ( SELECT 1 FROM wedding_sites ws JOIN weddings w ON ws.wedding_id = w.id WHERE ws.id = gift_lists.site_id AND w.user_id = auth.uid()));

CREATE POLICY "Users can delete gifts for their sites" 
ON public.gift_lists 
FOR DELETE 
USING (EXISTS ( SELECT 1 FROM wedding_sites ws JOIN weddings w ON ws.wedding_id = w.id WHERE ws.id = gift_lists.site_id AND w.user_id = auth.uid()));

-- Public access policies for published sites (for guests)
CREATE POLICY "Published sites are viewable by everyone" 
ON public.wedding_sites 
FOR SELECT 
USING (published = true);

CREATE POLICY "Sections of published sites are viewable by everyone" 
ON public.site_sections 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM wedding_sites WHERE wedding_sites.id = site_sections.site_id AND wedding_sites.published = true));

CREATE POLICY "Gifts of published sites are viewable by everyone" 
ON public.gift_lists 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM wedding_sites WHERE wedding_sites.id = gift_lists.site_id AND wedding_sites.published = true));

-- Create triggers for updated_at
CREATE TRIGGER update_wedding_sites_updated_at
BEFORE UPDATE ON public.wedding_sites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_sections_updated_at
BEFORE UPDATE ON public.site_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gift_lists_updated_at
BEFORE UPDATE ON public.gift_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();