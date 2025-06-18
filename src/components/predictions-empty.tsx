import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export function PredictionsEmpty() {
  return (
    <Card className="w-full">
      <CardContent className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Predictions Yet
        </h3>
        <p className="text-gray-600">
          Start by creating your first property prediction!
        </p>
      </CardContent>
    </Card>
  );
}
