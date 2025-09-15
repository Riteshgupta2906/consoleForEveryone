"use client";

import {
  CalendarIcon,
  Loader2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function NavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
}) {
  return (
    <div className="flex justify-between pt-1 md:pt-4 gap-2 md:gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50 text-sm h-8 md:h-10 px-2 md:px-4"
      >
        <ChevronLeft className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Back</span>
      </Button>

      {currentStep < totalSteps ? (
        <Button
          type="button"
          onClick={onNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-sm h-8 md:h-10 px-2 md:px-4"
        >
          Next
          <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium shadow-lg shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-base h-8 md:h-10 px-2 md:px-4 flex-1 md:flex-initial"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 md:h-4 md:w-4 animate-spin" />
              <span className="hidden sm:inline">Submitting...</span>
              <span className="sm:hidden">Sending...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Submit Rental Inquiry</span>
              <span className="sm:hidden">Submit</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
