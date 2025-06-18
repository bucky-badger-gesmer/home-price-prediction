'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3, Home, Ruler } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Prediction } from '../../lib/supabase';

interface EditPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (squareFootage: number, bedrooms: number) => void;
  prediction: Prediction | null;
  isUpdating: boolean;
}

export function EditPredictionModal({
  isOpen,
  onClose,
  onConfirm,
  prediction,
  isUpdating,
}: EditPredictionModalProps) {
  const [editSquareFootage, setEditSquareFootage] = useState('');
  const [editBedrooms, setEditBedrooms] = useState('');
  const [editErrors, setEditErrors] = useState({
    squareFootage: '',
    bedrooms: '',
  });

  // Initialize form when prediction changes
  useEffect(() => {
    if (prediction) {
      // Fixed: Use square_footage instead of square_feet
      setEditSquareFootage(prediction.square_feet.toString());
      setEditBedrooms(prediction.bedrooms.toString());
      setEditErrors({ squareFootage: '', bedrooms: '' });
    }
  }, [prediction]);

  const validateEditSquareFootage = (value: string) => {
    const num = Number.parseFloat(value);
    if (!value.trim()) return 'Square footage is required';
    if (isNaN(num) || num <= 0) return 'Please enter a valid square footage';
    if (num > 50000) return 'Square footage seems too large';
    return '';
  };

  const validateEditBedrooms = (value: string) => {
    const num = Number.parseInt(value);
    if (!value.trim()) return 'Number of bedrooms is required';
    if (isNaN(num) || num < 0) return 'Please enter a valid number of bedrooms';
    if (num > 20) return 'Number of bedrooms seems too large';
    if (!Number.isInteger(Number.parseFloat(value)))
      return 'Bedrooms must be a whole number';
    return '';
  };

  const handleEditSquareFootageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setEditSquareFootage(value);
    setEditErrors((prev) => ({
      ...prev,
      squareFootage: validateEditSquareFootage(value),
    }));
  };

  const handleEditBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditBedrooms(value);
    setEditErrors((prev) => ({
      ...prev,
      bedrooms: validateEditBedrooms(value),
    }));
  };

  const isEditFormValid = () => {
    return (
      editSquareFootage.trim() !== '' &&
      editBedrooms.trim() !== '' &&
      !editErrors.squareFootage &&
      !editErrors.bedrooms &&
      !isNaN(Number.parseFloat(editSquareFootage)) &&
      !isNaN(Number.parseInt(editBedrooms)) &&
      Number.parseFloat(editSquareFootage) > 0 &&
      Number.parseInt(editBedrooms) >= 0
    );
  };

  const calculateUpdatedPrice = (sqft: number, beds: number) => {
    const basePricePerSqft = 150;
    const bedroomMultiplier = 1 + beds * 0.1;
    const basePrice = sqft * basePricePerSqft * bedroomMultiplier;
    const marketFactor = 1.2;
    return Math.round((basePrice * marketFactor) / 1000) * 1000;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleConfirm = () => {
    if (isEditFormValid()) {
      const sqft = Number.parseFloat(editSquareFootage);
      const beds = Number.parseInt(editBedrooms);
      onConfirm(sqft, beds);
    }
  };

  const handleClose = () => {
    setEditSquareFootage('');
    setEditBedrooms('');
    setEditErrors({ squareFootage: '', bedrooms: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Edit Prediction
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Update the property details. The predicted price will be
            recalculated automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="editSquareFootage"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Ruler className="w-4 h-4" />
              Square Footage
            </Label>
            <Input
              id="editSquareFootage"
              type="number"
              placeholder="e.g., 1,200"
              value={editSquareFootage}
              onChange={handleEditSquareFootageChange}
              className={`transition-all duration-200 ${
                editErrors.squareFootage
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : editSquareFootage && !editErrors.squareFootage
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }`}
              min="1"
              step="1"
            />
            {editErrors.squareFootage && (
              <p className="text-sm text-red-600">{editErrors.squareFootage}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="editBedrooms"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Number of Bedrooms
            </Label>
            <Input
              id="editBedrooms"
              type="number"
              placeholder="e.g., 3"
              value={editBedrooms}
              onChange={handleEditBedroomsChange}
              className={`transition-all duration-200 ${
                editErrors.bedrooms
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : editBedrooms && !editErrors.bedrooms
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }`}
              min="0"
              step="1"
            />
            {editErrors.bedrooms && (
              <p className="text-sm text-red-600">{editErrors.bedrooms}</p>
            )}
          </div>

          {/* Preview of new predicted price */}
          {isEditFormValid() && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 font-medium">
                  New Predicted Price:
                </span>
                <span className="text-lg font-bold text-blue-800">
                  {formatPrice(
                    calculateUpdatedPrice(
                      Number.parseFloat(editSquareFootage),
                      Number.parseInt(editBedrooms)
                    )
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isEditFormValid() || isUpdating}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Update Prediction
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
