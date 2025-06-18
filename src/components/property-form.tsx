'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Ruler, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function PropertyForm() {
  const [squareFootage, setSquareFootage] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [errors, setErrors] = useState({ squareFootage: '', bedrooms: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(0);

  const validateSquareFootage = (value: string) => {
    const num = Number.parseFloat(value);
    if (!value.trim()) return 'Square footage is required';
    if (isNaN(num) || num <= 0) return 'Please enter a valid square footage';
    if (num > 50000) return 'Square footage seems too large';
    return '';
  };

  const validateBedrooms = (value: string) => {
    const num = Number.parseInt(value);
    if (!value.trim()) return 'Number of bedrooms is required';
    if (isNaN(num) || num < 0) return 'Please enter a valid number of bedrooms';
    if (num > 20) return 'Number of bedrooms seems too large';
    if (!Number.isInteger(Number.parseFloat(value)))
      return 'Bedrooms must be a whole number';
    return '';
  };

  const handleSquareFootageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSquareFootage(value);
    setErrors((prev) => ({
      ...prev,
      squareFootage: validateSquareFootage(value),
    }));
  };

  const handleBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBedrooms(value);
    setErrors((prev) => ({ ...prev, bedrooms: validateBedrooms(value) }));
  };

  const isFormValid = () => {
    return (
      squareFootage.trim() !== '' &&
      bedrooms.trim() !== '' &&
      !errors.squareFootage &&
      !errors.bedrooms &&
      !isNaN(Number.parseFloat(squareFootage)) &&
      !isNaN(Number.parseInt(bedrooms)) &&
      Number.parseFloat(squareFootage) > 0 &&
      Number.parseInt(bedrooms) >= 0
    );
  };

  const predict = async (sqft: number, bedrooms: number) => {
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sqft, bedrooms }),
      });

      if (!res.ok) throw new Error('Prediction API failed');

      const data = await res.json();
      return data.predictedPrice;
    } catch (err) {
      console.error('Prediction error:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const sqft = Number.parseFloat(squareFootage);
    const beds = Number.parseInt(bedrooms);

    const predicted = await predict(sqft, beds);
    if (predicted !== null) {
      setPredictedPrice(predicted);
      setIsSubmitted(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Property Details
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter your property information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="squareFootage"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Ruler className="w-4 h-4" />
                Square Footage
              </Label>
              <Input
                id="squareFootage"
                type="number"
                placeholder="e.g., 1200"
                value={squareFootage}
                onChange={handleSquareFootageChange}
                className={`transition-all duration-200 ${
                  errors.squareFootage
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : squareFootage && !errors.squareFootage
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                min="1"
                step="1"
                disabled={isSubmitted}
              />
              {errors.squareFootage && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  {errors.squareFootage}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bedrooms"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Number of Bedrooms
              </Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="e.g., 3"
                value={bedrooms}
                onChange={handleBedroomsChange}
                className={`transition-all duration-200 ${
                  errors.bedrooms
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : bedrooms && !errors.bedrooms
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                min="0"
                step="1"
                disabled={isSubmitted}
              />
              {errors.bedrooms && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  {errors.bedrooms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitted}
              className={`w-full py-3 text-white font-medium rounded-lg transition-all duration-200 ${
                isFormValid() && !isSubmitted
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitted
                ? 'Prediction Complete'
                : isFormValid()
                ? 'Submit Property Details'
                : 'Please Complete All Fields'}
            </Button>
          </form>
          {isSubmitted && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Predicted Property Value
                </h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {formatCurrency(predictedPrice)}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Based on {squareFootage} sq ft • {bedrooms} bedroom
                  {Number.parseInt(bedrooms) !== 1 ? 's' : ''}
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSquareFootage('');
                    setBedrooms('');
                    setErrors({ squareFootage: '', bedrooms: '' });
                  }}
                  variant="outline"
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  Calculate Another Property
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
