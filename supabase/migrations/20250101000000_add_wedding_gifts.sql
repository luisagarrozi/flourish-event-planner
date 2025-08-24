-- Create wedding_gifts table for admin/planning side
CREATE TABLE public.wedding_gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL,
  gift_name TEXT NOT NULL,
  gift_description TEXT,
  gift_amount INTEGER NOT NULL DEFAULT 1,
  gift_value NUMERIC(10,2) NOT NULL,
  gift_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Foreign key constraint
  CONSTRAINT fk_wedding_gifts_wedding_id 
    FOREIGN KEY (wedding_id) 
    REFERENCES public.weddings(id) 
    ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.wedding_gifts ENABLE ROW LEVEL SECURITY;

-- Create policies for wedding_gifts
CREATE POLICY "Users can view gifts for their weddings" 
ON public.wedding_gifts 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM weddings WHERE weddings.id = wedding_gifts.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can create gifts for their weddings" 
ON public.wedding_gifts 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1 FROM weddings WHERE weddings.id = wedding_gifts.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can update gifts for their weddings" 
ON public.wedding_gifts 
FOR UPDATE 
USING (EXISTS ( SELECT 1 FROM weddings WHERE weddings.id = wedding_gifts.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can delete gifts for their weddings" 
ON public.wedding_gifts 
FOR DELETE 
USING (EXISTS ( SELECT 1 FROM weddings WHERE weddings.id = wedding_gifts.wedding_id AND weddings.user_id = auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_wedding_gifts_updated_at
BEFORE UPDATE ON public.wedding_gifts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_wedding_gifts_wedding_id ON public.wedding_gifts(wedding_id);
