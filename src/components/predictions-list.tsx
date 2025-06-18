'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, type Prediction } from '../../lib/supabase';
import { DeletePredictionModal } from './delete-prediction-modal';
import { PredictionCard } from './prediction-card';
import { PredictionsEmpty } from './predictions-empty';
import { PredictionsError } from './predictions-error';
import { PredictionsLoading } from './predictions-loading';

const ITEMS_PER_PAGE = 10;

export function PredictionsList() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [predictionToDelete, setPredictionToDelete] =
    useState<Prediction | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [predictionToEdit, setPredictionToEdit] = useState<Prediction | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);

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
          .from('Predictions') // Fixed: Use lowercase table name
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

  // Delete handlers
  const handleDeleteClick = (prediction: Prediction) => {
    setPredictionToDelete(prediction);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!predictionToDelete) return;

    try {
      setDeletingIds((prev) => new Set(prev).add(predictionToDelete.id));

      const { error } = await supabase
        .from('Predictions') // Fixed: Use lowercase table name
        .delete()
        .eq('id', predictionToDelete.id);

      if (error) {
        throw error;
      }

      setPredictions((prev) =>
        prev.filter((prediction) => prediction.id !== predictionToDelete.id)
      );
      setDeleteModalOpen(false);
      setPredictionToDelete(null);
    } catch (err) {
      console.error('Failed to delete prediction:', err);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(predictionToDelete.id);
        return newSet;
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setPredictionToDelete(null);
  };

  // Edit handlers
  const handleEditClick = (prediction: Prediction) => {
    setPredictionToEdit(prediction);
    setEditModalOpen(true);
  };

  const calculateUpdatedPrice = (sqft: number, beds: number) => {
    const basePricePerSqft = 150;
    const bedroomMultiplier = 1 + beds * 0.1;
    const basePrice = sqft * basePricePerSqft * bedroomMultiplier;
    const marketFactor = 1.2;
    return Math.round((basePrice * marketFactor) / 1000) * 1000;
  };

  const confirmEdit = async (squareFootage: number, bedrooms: number) => {
    if (!predictionToEdit) return;

    try {
      setIsUpdating(true);

      const newPredictedPrice = calculateUpdatedPrice(squareFootage, bedrooms);

      const { error } = await supabase
        .from('Predictions') // Fixed: Use lowercase table name
        .update({
          square_footage: squareFootage,
          bedrooms: bedrooms,
          predicted_price: newPredictedPrice,
        })
        .eq('id', predictionToEdit.id);

      if (error) {
        throw error;
      }

      setPredictions((prev) =>
        prev.map((prediction) =>
          prediction.id === predictionToEdit.id
            ? {
                ...prediction,
                square_footage: squareFootage,
                bedrooms: bedrooms,
                predicted_price: newPredictedPrice,
              }
            : prediction
        )
      );

      setEditModalOpen(false);
      setPredictionToEdit(null);
    } catch (err) {
      console.error('Failed to update prediction:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditModalOpen(false);
    setPredictionToEdit(null);
  };

  if (loading) {
    return <PredictionsLoading />;
  }

  if (error) {
    return <PredictionsError error={error} />;
  }

  if (predictions.length === 0) {
    return <PredictionsEmpty />;
  }

  return (
    <>
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isDeleting={deletingIds.has(prediction.id)}
            isLastItem={index === predictions.length - 1}
            lastElementRef={lastElementRef}
          />
        ))}

        {loadingMore && <PredictionsLoading count={3} />}

        {!hasMore && predictions.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              You have reached the end of the predictions list
            </p>
          </div>
        )}
      </div>

      <DeletePredictionModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        prediction={predictionToDelete}
        isDeleting={
          predictionToDelete ? deletingIds.has(predictionToDelete.id) : false
        }
      />

      {/* <EditPredictionModal
        isOpen={editModalOpen}
        onClose={cancelEdit}
        onConfirm={confirmEdit}
        prediction={predictionToEdit}
        isUpdating={isUpdating}
      /> */}
    </>
  );
}
