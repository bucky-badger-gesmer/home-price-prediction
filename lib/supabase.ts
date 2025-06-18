import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Use anon key on client, service role key on server
export const supabase = createClient(supabaseUrl, supabaseKey);

export type Prediction = {
  id: string;
  square_feet: number;
  bedrooms: number;
  predicted_price: number;
  created_at: string;
};
