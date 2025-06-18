import { NextResponse } from 'next/server';
import { predictPrice, trainModel } from '../../../../lib/model';

// Define expected request body type
interface PredictRequestBody {
  sqft: number;
  bedrooms: number;
}

// Define handler with proper request type
export async function POST(req: Request): Promise<Response> {
  try {
    const { sqft, bedrooms } = (await req.json()) as PredictRequestBody;

    await trainModel(); // Will only run once due to global caching
    const price = predictPrice(sqft, bedrooms);

    return NextResponse.json({ predictedPrice: price.toFixed(0) });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
