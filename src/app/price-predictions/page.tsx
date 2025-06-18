import { PredictionsList } from '@/components/predictions-list';

export default function PricePredictionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Price Predictions
          </h1>
          <p className="text-gray-600 text-lg">
            View all your property price predictions
          </p>
        </div>

        <PredictionsList />
      </div>
    </div>
  );
}
