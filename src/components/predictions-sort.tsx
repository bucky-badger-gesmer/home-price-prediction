'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = {
  value: string;
  label: string;
  column: string;
  ascending: boolean;
};

const sortOptions: SortOption[] = [
  {
    value: 'created_at_desc',
    label: 'Newest First',
    column: 'created_at',
    ascending: false,
  },
  {
    value: 'created_at_asc',
    label: 'Oldest First',
    column: 'created_at',
    ascending: true,
  },
  {
    value: 'square_footage_asc',
    label: 'Square Feet (Low to High)',
    column: 'square_feet',
    ascending: true,
  },
  {
    value: 'square_footage_desc',
    label: 'Square Feet (High to Low)',
    column: 'square_feet',
    ascending: false,
  },
  {
    value: 'bedrooms_asc',
    label: 'Bedrooms (Low to High)',
    column: 'bedrooms',
    ascending: true,
  },
  {
    value: 'bedrooms_desc',
    label: 'Bedrooms (High to Low)',
    column: 'bedrooms',
    ascending: false,
  },
  {
    value: 'predicted_price_asc',
    label: 'Price (Low to High)',
    column: 'predicted_price',
    ascending: true,
  },
  {
    value: 'predicted_price_desc',
    label: 'Price (High to Low)',
    column: 'predicted_price',
    ascending: false,
  },
];

interface PredictionsSortProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function PredictionsSort({
  value,
  onValueChange,
}: PredictionsSortProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select sort option" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { sortOptions };
