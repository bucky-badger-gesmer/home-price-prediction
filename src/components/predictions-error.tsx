import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface PredictionsErrorProps {
  error: string;
}

export function PredictionsError({ error }: PredictionsErrorProps) {
  return (
    <Card className="w-full border-red-200 bg-red-50">
      <CardContent className="flex items-center gap-3 p-6">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-900">
            Error Loading Predictions
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      </CardContent>
    </Card>
  );
}
