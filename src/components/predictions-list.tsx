'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Calendar, Home, Ruler, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, type Prediction } from '../../lib/supabase';

const ITEMS_PER_PAGE = 10;

export function PredictionsList() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const fetchPredictions = useCallback(
    async (pageNum: number, isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const from = pageNum * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const {
          data,
          error: fetchError,
          count,
        } = await supabase
          .from('Predictions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to);

        if (fetchError) {
          throw fetchError;
        }

        if (isInitial) {
          setPredictions(data || []);
        } else {
          setPredictions((prev) => [...prev, ...(data || [])]);
        }

        // Check if there are more items to load
        const totalItems = count || 0;
        const loadedItems = (pageNum + 1) * ITEMS_PER_PAGE;
        setHasMore(loadedItems < totalItems);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch predictions'
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    fetchPredictions(0, true);
  }, [fetchPredictions]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPredictions(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, page, fetchPredictions]);

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

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
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

  if (predictions.length === 0) {
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

  return (
    <div className="space-y-4">
      {predictions.map((prediction, index) => (
        <Card
          key={prediction.id}
          className="w-full hover:shadow-lg transition-shadow duration-200"
          ref={index === predictions.length - 1 ? lastElementRef : null}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Property Prediction
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(prediction.created_at)}
              </Badge>
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
      ))}

      {loadingMore && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!hasMore && predictions.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            You have reached the end of the predictions list
          </p>
        </div>
      )}
    </div>
  );
}
