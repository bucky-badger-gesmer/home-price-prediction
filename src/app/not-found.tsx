'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="text-center p-8">
          {/* 404 Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-white" />
          </div>

          {/* 404 Text */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-2">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Page Not Found
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Oops! The page you are looking for does not exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                <Home className="w-5 h-5 mr-2" />
                Go Back Home
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Or try one of these pages:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors duration-200"
              >
                Property Form
              </Link>
              <span className="hidden sm:inline text-gray-300">•</span>
              <Link
                href="/price-predictions"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors duration-200"
              >
                Price Predictions
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
