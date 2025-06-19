'use client';

import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bed, Calendar, Home, Ruler, Trash2, TrendingUp } from 'lucide-react';
import type { Prediction } from '../../lib/supabase';
import { Button } from './ui/button';

interface PredictionCardProps {
  prediction: Prediction;
  onDelete: (prediction: Prediction) => void;
  isDeleting: boolean;
  isLastItem?: boolean;
  lastElementRef?: React.RefObject<HTMLDivElement | null>;
}

export function PredictionCard({
  prediction,
  onDelete,
  isDeleting,
  isLastItem,
  lastElementRef,
}: PredictionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      className="w-full hover:shadow-lg transition-shadow duration-200"
      ref={isLastItem ? lastElementRef : null}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            <Home />
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(prediction.created_at)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Square Footage:</span>
            <span className="font-medium">
              {prediction.square_feet.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Bedrooms:</span>
            <span className="font-medium">{prediction.bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">Predicted Price:</span>
            <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formatPrice(prediction.predicted_price)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(prediction)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            aria-label="Delete prediction"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-1" />
            )}
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
