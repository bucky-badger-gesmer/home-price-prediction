'use client';

import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Home, Ruler, Trash2, TrendingUp } from 'lucide-react';
import type { Prediction } from '../../lib/supabase';

interface PredictionCardProps {
  prediction: Prediction;
  onEdit: (prediction: Prediction) => void;
  onDelete: (prediction: Prediction) => void;
  isDeleting: boolean;
  isLastItem?: boolean;
  lastElementRef?: React.RefObject<HTMLDivElement | null>;
}

export function PredictionCard({
  prediction,
  onEdit,
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
            Property Prediction
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(prediction.created_at)}
            </Badge>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(prediction)}
              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              aria-label="Edit prediction"
            >
              <Edit3 className="w-4 h-4" />
            </Button> */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(prediction)}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              aria-label="Delete prediction"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
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
            <Home className="w-4 h-4 text-green-600" />
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
      </CardContent>
    </Card>
  );
}
