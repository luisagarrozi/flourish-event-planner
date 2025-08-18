-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create weddings table
CREATE TABLE public.weddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bride_name TEXT,
  groom_name TEXT,
  wedding_date DATE,
  venue TEXT,
  budget DECIMAL(10,2),
  guest_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'booked', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget_items table
CREATE TABLE public.budget_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  paid BOOLEAN DEFAULT false,
  vendor TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'declined')),
  plus_one BOOLEAN DEFAULT false,
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  cost DECIMAL(10,2),
  status TEXT DEFAULT 'researching' CHECK (status IN ('researching', 'contacted', 'quoted', 'booked', 'paid')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for weddings
CREATE POLICY "Users can view their own weddings" 
ON public.weddings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weddings" 
ON public.weddings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weddings" 
ON public.weddings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weddings" 
ON public.weddings FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks for their weddings" 
ON public.tasks FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = tasks.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tasks for their weddings" 
ON public.tasks FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = tasks.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update tasks for their weddings" 
ON public.tasks FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = tasks.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete tasks for their weddings" 
ON public.tasks FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = tasks.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

-- Create RLS policies for budget_items
CREATE POLICY "Users can view budget items for their weddings" 
ON public.budget_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = budget_items.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create budget items for their weddings" 
ON public.budget_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = budget_items.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update budget items for their weddings" 
ON public.budget_items FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = budget_items.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete budget items for their weddings" 
ON public.budget_items FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = budget_items.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

-- Create RLS policies for guests
CREATE POLICY "Users can view guests for their weddings" 
ON public.guests FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = guests.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create guests for their weddings" 
ON public.guests FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = guests.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update guests for their weddings" 
ON public.guests FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = guests.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete guests for their weddings" 
ON public.guests FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = guests.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

-- Create RLS policies for vendors
CREATE POLICY "Users can view vendors for their weddings" 
ON public.vendors FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = vendors.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create vendors for their weddings" 
ON public.vendors FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = vendors.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update vendors for their weddings" 
ON public.vendors FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = vendors.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete vendors for their weddings" 
ON public.vendors FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.weddings 
    WHERE weddings.id = vendors.wedding_id 
    AND weddings.user_id = auth.uid()
  )
);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weddings_updated_at
  BEFORE UPDATE ON public.weddings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at
  BEFORE UPDATE ON public.budget_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();