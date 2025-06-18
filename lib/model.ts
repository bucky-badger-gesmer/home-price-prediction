import csv from 'csv-parser';
import fs from 'fs';
import MLR from 'ml-regression-multivariate-linear';
import path from 'path';

// Define global type extension for TypeScript
declare global {
  var __trainedModel: MLR | null;
}

// Ensure globalThis.__trainedModel is initialized
globalThis.__trainedModel ||= null;

// Define shape of each row in CSV
interface DataRow {
  sqft: number;
  bedrooms: number;
  price: number;
}

// Load CSV and parse into DataRow[]
async function loadCSV(): Promise<DataRow[]> {
  const data: DataRow[] = [];
  const filePath = path.join(process.cwd(), 'public', 'training-data.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        data.push({
          sqft: parseFloat(row['Square Footage']),
          bedrooms: parseInt(row['Number of Bedrooms'], 10),
          price: parseFloat(row['Price ($)']),
        });
      })
      .on('end', () => resolve(data))
      .on('error', reject);
  });
}

// Train model once and cache globally
export async function trainModel(): Promise<void> {
  if (globalThis.__trainedModel) return;

  const data = await loadCSV();
  const X = data.map((d) => [d.sqft, d.bedrooms]);
  const y = data.map((d) => [d.price]);

  const model = new MLR(X, y);
  globalThis.__trainedModel = model;

  console.log('✅ Model trained and cached globally');
}

// Predict price using trained model
export function predictPrice(sqft: number, bedrooms: number): number {
  const model = globalThis.__trainedModel;
  if (!model) throw new Error('Model not trained yet');

  const prediction = model.predict([[sqft, bedrooms]]);
  return prediction[0][0]; // Return the scalar prediction
}
