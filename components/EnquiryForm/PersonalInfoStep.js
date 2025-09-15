// Personal Information Step Component
"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function PersonalInfoStep({ form }) {
  const handlePhoneChange = (e, onChange) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <h3 className="text-base md:text-lg font-semibold text-white border-b border-gray-700 pb-1.5 md:pb-2">
        Personal Information
      </h3>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300 text-sm md:text-base">
              Full Name *
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your full name"
                {...field}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 h-9 md:h-10 text-sm md:text-base"
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs md:text-sm" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300 text-sm md:text-base">
              Email Address *
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="your.email@example.com"
                {...field}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 h-9 md:h-10 text-sm md:text-base"
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs md:text-sm" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300 text-sm md:text-base">
              Phone Number *
            </FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xs md:text-sm">+91</span>
                </div>
                <Input
                  placeholder="9876543210"
                  value={field.value}
                  onChange={(e) => handlePhoneChange(e, field.onChange)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 pl-10 md:pl-12 h-9 md:h-10 text-sm md:text-base"
                  maxLength={10}
                />
              </div>
            </FormControl>
            <FormDescription className="text-gray-500 text-xs">
              Preferably WhatsApp number (10 digits only)
            </FormDescription>
            <FormMessage className="text-red-400 text-xs md:text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
}
