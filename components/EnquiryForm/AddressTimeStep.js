"use client";

import { format } from "date-fns";
import { CalendarIcon, Clock, X, Cloud, Sun, Moon } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// --- REUSABLE DATE PICKER COMPONENT ---
export function DatePicker({
  field,
  placeholder = "Pick a date",
  disabled,
  showClearButton = false,
  onClear,
}) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 justify-start text-left font-normal h-9 md:h-10 text-sm md:text-base",
              !field.value && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            {field.value ? (
              <span className="flex-1 truncate">
                {format(field.value, "MMM d, yyyy")}
              </span>
            ) : (
              <span className="flex-1">{placeholder}</span>
            )}
            {showClearButton && field.value && (
              <X
                className="ml-1 md:ml-2 h-3.5 w-3.5 md:h-4 md:w-4 hover:text-red-400 cursor-pointer flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear?.();
                }}
              />
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 md:p-1 bg-gray-800 border-gray-700"
        align="start"
        sideOffset={4}
        style={{ zIndex: 9999 }}
      >
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={disabled}
          initialFocus
          className="bg-gray-800 text-white border-gray-700 scale-90 md:scale-90 p-2 md:p-3"
        />
      </PopoverContent>
    </Popover>
  );
}

// --- NEW COMPACT HOUR SLIDER COMPONENT ---
export function HourSlider({ field }) {
  // Service hours: 7 AM (7) to 9 PM (21)
  const MIN_HOUR = 7;
  const MAX_HOUR = 21;

  // Convert time string to hour number (7-21)
  const timeToHour = (timeString) => {
    if (!timeString) return 12; // Default to noon
    const hour = parseInt(timeString.split(":")[0], 10);
    return Math.max(MIN_HOUR, Math.min(MAX_HOUR, hour));
  };

  // Convert hour number to time string
  const hourToTime = (hour) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  // Format hour for display
  const formatHour = (hour) => {
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  // Get time period and icon
  const getTimePeriodInfo = (hour) => {
    if (hour >= 7 && hour < 12) {
      return { period: "morning", icon: Cloud, color: "text-blue-400" };
    }
    if (hour >= 12 && hour < 18) {
      return { period: "afternoon", icon: Sun, color: "text-yellow-400" };
    }
    return { period: "evening", icon: Moon, color: "text-indigo-400" };
  };

  const currentHour = timeToHour(field.value);
  const { icon: Icon, color } = getTimePeriodInfo(currentHour);

  const handleSliderChange = (value) => {
    const hour = value[0];
    field.onChange(hourToTime(hour));
  };

  return (
    <div className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-md">
      {/* Compact Time Display */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className={cn("h-4 w-4", color)} />
          <span className="text-sm font-medium text-white">
            {formatHour(currentHour)}
          </span>
        </div>
        <div className="text-xs text-gray-400">Service: 7AM - 9PM</div>
      </div>

      {/* Compact Slider */}
      <div className="space-y-2">
        <Slider
          value={[currentHour]}
          onValueChange={handleSliderChange}
          max={MAX_HOUR}
          min={MIN_HOUR}
          step={1}
          className="w-full"
        />

        {/* Compact Time markers with icons */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center space-x-1">
            <Cloud className="h-3 w-3 text-blue-400" />
            <span className="text-gray-500">7AM</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sun className="h-3 w-3 text-yellow-400" />
            <span className="text-gray-500">12PM</span>
          </div>
          <div className="flex items-center space-x-1">
            <Moon className="h-3 w-3 text-indigo-400" />
            <span className="text-gray-500">9PM</span>
          </div>
        </div>
      </div>
    </div>
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

  const isEndDateDisabled = (date) => {
    const startDate = form.getValues("startDate");
    if (!startDate) return isDateDisabled(date);
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    return date < startOfDay;
  };

  // Helper function to calculate the total rental duration
  const calculateDuration = () => {
    const startDate = form.getValues("startDate");
    const endDate = form.getValues("endDate");
    const startTime = form.getValues("startTime");
    const endTime = form.getValues("endTime");

    if (startDate && endDate && startTime && endTime) {
      const startDateTime = new Date(
        `${format(startDate, "yyyy-MM-dd")}T${startTime}`
      );
      const endDateTime = new Date(
        `${format(endDate, "yyyy-MM-dd")}T${endTime}`
      );

      if (endDateTime <= startDateTime) return "Invalid selection";

      const diffMs = endDateTime - startDateTime;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      let durationString = "";
      if (diffDays > 0)
        durationString += `${diffDays} day${diffDays > 1 ? "s" : ""} `;
      if (diffHours > 0)
        durationString += `${diffHours} hour${diffHours > 1 ? "s" : ""} `;

      return durationString.trim() || "Less than an hour";
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

        {/* Display Complete Address Preview */}
        {/* {(form.watch("houseNumber") ||
          form.watch("buildingName") ||
          form.watch("streetName") ||
          form.watch("pinCode") ||
          form.watch("city")) && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <FormLabel className="text-gray-300 text-xs md:text-sm font-medium">
              Complete Address Preview:
            </FormLabel>
            <p className="text-gray-200 text-sm mt-1">
              {[
                form.watch("houseNumber"),
                form.watch("buildingName"),
                form.watch("streetName"),
                form.watch("city"),
                form.watch("pinCode"),
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )} */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Start Date/Time */}
        <div className="space-y-3 md:space-y-4">
          <h4 className="text-sm md:text-md font-medium text-white">
            Rental Start
          </h4>
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm md:text-base">
                  Start Date *
                </FormLabel>
                <DatePicker
                  field={field}
                  placeholder="Pick start date"
                  disabled={isDateDisabled}
                  showClearButton={true}
                  onClear={() => {
                    form.setValue("startDate", undefined);
                    form.setValue("endDate", undefined);
                  }}
                />
                <FormMessage className="text-red-400 text-xs md:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm md:text-base">
                  Start Time *
                </FormLabel>
                <HourSlider field={field} />
                <FormMessage className="text-red-400 text-xs md:text-sm" />
              </FormItem>
            )}
          />
        </div>

        {/* End Date/Time */}
        <div className="space-y-3 md:space-y-4">
          <h4 className="text-sm md:text-md font-medium text-white">
            Rental End
          </h4>
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm md:text-base">
                  End Date *
                </FormLabel>
                <DatePicker
                  field={field}
                  placeholder="Pick end date"
                  disabled={isEndDateDisabled}
                  showClearButton={true}
                  onClear={() => form.setValue("endDate", undefined)}
                />
                <FormMessage className="text-red-400 text-xs md:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm md:text-base">
                  End Time *
                </FormLabel>
                <HourSlider field={field} />
                <FormMessage className="text-red-400 text-xs md:text-sm" />
              </FormItem>
            )}
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
