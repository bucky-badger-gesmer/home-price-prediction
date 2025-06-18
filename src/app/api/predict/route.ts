import { NextResponse } from 'next/server';
import { predictPrice, trainModel } from '../../../../lib/model';
import { supabase } from '../../../../lib/supabase';

interface PredictRequestBody {
  sqft: number;
  bedrooms: number;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { sqft, bedrooms } = (await req.json()) as PredictRequestBody;

    await trainModel();
    const price = predictPrice(sqft, bedrooms);
    const predictedPrice = Math.round(price); // Rounded to nearest dollar

    // Insert prediction into Supabase
    const { error } = await supabase.from('Predictions').insert([
      {
        square_feet: sqft,
        bedrooms: bedrooms,
        predicted_price: predictedPrice,
        created_at: new Date().toISOString(), // optional if table handles timestamps
      },
    ]);

    if (error) {
      console.error('Error inserting into Supabase:', error.message);
      return NextResponse.json(
        { error: 'Prediction saved but failed to store data.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ predictedPrice });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
