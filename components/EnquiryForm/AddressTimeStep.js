"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// --- CUSTOM DATE RANGE PICKER COMPONENT ---
export function DateRangePicker({
  startField,
  endField,
  placeholder = "Pick date range",
  disabled,
  showClearButton = false,
  onClear,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDateRange = () => {
    if (startField.value && endField.value) {
      return `${format(startField.value, "MMM d")} - ${format(
        endField.value,
        "MMM d, yyyy"
      )}`;
    } else if (startField.value) {
      return `${format(startField.value, "MMM d, yyyy")} - Select end date`;
    }
    return placeholder;
  };

  const handleDateClick = (date) => {
    if (disabled && disabled(date)) return;

    if (!startField.value) {
      // First selection - set start date
      startField.onChange(date);
      endField.onChange(null);
    } else if (!endField.value) {
      // Second selection - set end date
      if (date >= startField.value) {
        endField.onChange(date);
        // Keep calendar open briefly to show selection, then close
        setTimeout(() => setIsOpen(false), 300);
      } else {
        // If earlier date selected, make it new start
        startField.onChange(date);
        endField.onChange(null);
      }
    } else {
      // Both selected, start over
      startField.onChange(date);
      endField.onChange(null);
    }
  };

  const isInRange = (date) => {
    if (!startField.value || !endField.value) return false;
    const dateTime = date.getTime();
    const startTime = startField.value.getTime();
    const endTime = endField.value.getTime();
    return dateTime >= startTime && dateTime <= endTime;
  };

  const isStartDate = (date) => {
    return startField.value && date.getTime() === startField.value.getTime();
  };

  const isEndDate = (date) => {
    return endField.value && date.getTime() === endField.value.getTime();
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = disabled && disabled(date);
      const inRange = isInRange(date);
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);
      const isSameDay = isStart && isEnd;

      let cellClass =
        "h-10 w-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200 relative select-none ";

      if (isDisabled) {
        cellClass += "text-gray-500 cursor-not-allowed opacity-50 ";
      } else if (inRange) {
        cellClass += "text-white ";
        if (isSameDay) {
          cellClass +=
            "rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg ";
        } else if (isStart) {
          cellClass +=
            "rounded-l-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg ";
        } else if (isEnd) {
          cellClass +=
            "rounded-r-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg ";
        } else {
          cellClass += "bg-gradient-to-br from-blue-500 to-blue-600 ";
        }
      } else if (isStart && !endField.value) {
        // Mark the first selected date when no end date is selected
        cellClass +=
          "text-white rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg ring-2 ring-blue-300 ";
      } else {
        cellClass += "text-white hover:bg-gray-700 rounded-lg hover:scale-105 ";
      }

      days.push(
        <button
          key={day}
          type="button"
          className={cellClass}
          onClick={() => handleDateClick(date)}
          disabled={isDisabled}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 justify-start text-left font-normal h-9 md:h-10 text-sm md:text-base",
              !startField.value && "text-gray-400"
            )}
          >
            <Calendar className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="flex-1 truncate">{formatDateRange()}</span>
            {showClearButton && (startField.value || endField.value) && (
              <X
                className="ml-1 md:ml-2 h-3.5 w-3.5 md:h-4 md:w-4 hover:text-red-400 cursor-pointer flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear?.();
                }}
              />
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-gray-800 border-gray-700 shadow-2xl"
        align="start"
        sideOffset={4}
        style={{ zIndex: 50 }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header with Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(-1)}
            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-white font-medium">
            {format(currentDate, "MMMM yyyy")}
          </h3>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(1)}
            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Clear Button */}
        {(startField.value || endField.value) && (
          <div className="px-4 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                startField.onChange(null);
                endField.onChange(null);
              }}
              className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              Clear Selection
            </Button>
          </div>
        )}

        {/* Calendar */}
        <div className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs font-medium text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">{renderCalendarGrid()}</div>
        </div>

        {/* Footer */}
        {startField.value && (
          <div className="p-3 border-t border-gray-700 text-xs text-gray-400">
            {endField.value
              ? `Selected: ${format(startField.value, "MMM d")} - ${format(
                  endField.value,
                  "MMM d, yyyy"
                )}`
              : `Start: ${format(
                  startField.value,
                  "MMM d, yyyy"
                )} - Click to select end date`}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// --- MAIN FORM STEP COMPONENT ---
export function AddressTimeStep({ form }) {
  // Helper functions to disable past dates
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Helper function to calculate the total rental duration
  const calculateDuration = () => {
    const startDate = form.getValues("startDate");
    const endDate = form.getValues("endDate");

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) return "Invalid selection";

      const diffMs = end - start;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Same day rental";
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
    return null;
  };

  const duration = calculateDuration();

  return (
    <div className="space-y-3 md:space-y-6">
      <h3 className="text-base md:text-lg font-semibold text-white border-b border-gray-700 pb-1.5 md:pb-2">
        Address & Rental Period
      </h3>

      {/* Address Fields */}
      <div className="space-y-4">
        <h4 className="text-sm md:text-base font-medium text-white">
          Delivery Address Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* House Number */}
          <FormField
            control={form.control}
            name="houseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm md:text-base">
                  House/Flat Number *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., A-101, 2nd Floor"
                    {...field}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs md:text-sm" />
              </FormItem>
            )}
          />

          {/* Building Name */}
          <FormField
            control={form.control}
            name="buildingName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm md:text-base">
                  Building Name *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Sunrise Apartments"
                    {...field}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs md:text-sm" />
              </FormItem>
            )}
          />
        </div>

        {/* Street Name */}
        <FormField
          control={form.control}
          name="streetName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 text-sm md:text-base">
                Street Name *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., MG Road, 5th Cross Street"
                  {...field}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs md:text-sm" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pin Code */}
          <FormField
            control={form.control}
            name="pinCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm md:text-base">
                  Pin Code *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 560001"
                    {...field}
                    maxLength={6}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs md:text-sm" />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm md:text-base">
                  City *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Bangalore"
                    {...field}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs md:text-sm" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="space-y-4">
        <h4 className="text-sm md:text-base font-medium text-white">
          Rental Period
        </h4>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field: startField }) => (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field: endField }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm md:text-base">
                      Select Date Range *
                    </FormLabel>
                    <DateRangePicker
                      startField={startField}
                      endField={endField}
                      placeholder="Pick start and end dates"
                      disabled={isDateDisabled}
                      showClearButton={true}
                      onClear={() => {
                        form.setValue("startDate", null);
                        form.setValue("endDate", null);
                        form.setValue("startTime", null);
                        form.setValue("endTime", null);
                      }}
                    />

                    <FormMessage className="text-red-400 text-xs md:text-sm" />
                  </FormItem>
                )}
              />
            )}
          />
        </div>

        {/* Hidden time fields with default values */}
        <div className="hidden">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => {
              // Set default time when start date is selected
              if (form.getValues("startDate") && !field.value) {
                field.onChange("08:00");
              }
              return (
                <input type="hidden" {...field} value={field.value || ""} />
              );
            }}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => {
              // Set default time when end date is selected
              if (form.getValues("endDate") && !field.value) {
                field.onChange("08:00");
              }
              return (
                <input type="hidden" {...field} value={field.value || ""} />
              );
            }}
          />
        </div>
      </div>

      {/* Duration Display */}
      {duration && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-2 md:p-3">
          <div className="flex items-center text-blue-300">
            <Clock className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm font-medium">
              Rental Duration: <span className="text-blue-200">{duration}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
