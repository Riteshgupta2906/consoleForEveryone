"use client";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { ProgressBar } from "./EnquiryForm/ProgressBar";
import { PersonalInfoStep } from "./EnquiryForm/PersonalInfoStep";
import { GameSelectionStep } from "./EnquiryForm/GameSelectionStep";
import { AddressTimeStep } from "./EnquiryForm/AddressTimeStep";
import { NavigationButtons } from "./EnquiryForm/NavigationStep";

// localStorage keys
const FORM_DATA_KEY = "ps5_rental_form_data";
const CURRENT_STEP_KEY = "ps5_rental_current_step";
const SELECTED_GAMES_KEY = "ps5_rental_selected_games";

// Updated Validation schema with separate address fields
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number must be exactly 10 digits")
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
    selectedGames: z
      .array(z.string())
      .min(1, "Please select at least one game"),
    customGames: z.string().optional(),
    numberOfControllers: z
      .number()
      .min(1, "At least 1 controller required")
      .max(4, "Maximum 4 controllers allowed"),

    // Updated address fields
    houseNumber: z
      .string()
      .min(1, "House/Flat number is required")
      .max(50, "House number must be less than 50 characters"),
    buildingName: z
      .string()
      .min(2, "Building name is required")
      .max(100, "Building name must be less than 100 characters"),
    streetName: z
      .string()
      .min(2, "Street name is required")
      .max(100, "Street name must be less than 100 characters"),
    pinCode: z
      .string()
      .min(6, "Pin code must be 6 digits")
      .max(6, "Pin code must be 6 digits")
      .regex(/^\d{6}$/, "Please enter a valid 6-digit pin code"),
    city: z
      .string()
      .min(2, "City name is required")
      .max(50, "City name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "City should only contain letters and spaces"),

    startDate: z
      .date({
        required_error: "Start date is required",
      })
      .nullable()
      .refine((date) => date !== null, {
        message: "Start date is required",
      }),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z
      .date({
        required_error: "End date is required",
      })
      .nullable()
      .refine((date) => date !== null, {
        message: "End date is required",
      }),
    endTime: z.string().min(1, "End time is required"),
    message: z
      .string()
      .max(500, "Message must be less than 500 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (
        !data.startDate ||
        !data.endDate ||
        !data.startTime ||
        !data.endTime
      ) {
        return true;
      }
      const startDateTime = new Date(data.startDate);
      const endDateTime = new Date(data.endDate);
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);
      startDateTime.setHours(startHour, startMinute);
      endDateTime.setHours(endHour, endMinute);
      return endDateTime > startDateTime;
    },
    {
      message: "End date and time must be after start date and time",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.startDate) return true;
      const startDate = new Date(data.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return startDate >= today;
    },
    {
      message: "Start date cannot be in the past",
      path: ["startDate"],
    }
  );

// Utility functions for localStorage
const saveToLocalStorage = (key, data) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
};

const removeFromLocalStorage = (key) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

// Function to serialize form data for localStorage (handle Date objects)
const serializeFormData = (data) => {
  return {
    ...data,
    startDate: data.startDate ? data.startDate.toISOString() : null,
    endDate: data.endDate ? data.endDate.toISOString() : null,
  };
};

// Function to deserialize form data from localStorage (convert back to Date objects)
const deserializeFormData = (data) => {
  if (!data) return null;
  return {
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  };
};

function PS5RentalForm({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGames, setSelectedGames] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalSteps = 3;

  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    selectedGames: [],
    customGames: "",
    numberOfControllers: 2,
    houseNumber: "",
    buildingName: "",
    streetName: "",
    pinCode: "",
    city: "",
    startDate: undefined,
    startTime: "",
    endDate: undefined,
    endTime: "",
    message: "",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load saved form data
      const savedFormData = loadFromLocalStorage(FORM_DATA_KEY);
      const savedStep = loadFromLocalStorage(CURRENT_STEP_KEY, 1);
      const savedSelectedGames = loadFromLocalStorage(SELECTED_GAMES_KEY, []);

      if (savedFormData) {
        const deserializedData = deserializeFormData(savedFormData);
        // Reset form with saved data
        form.reset(deserializedData);
      }

      setCurrentStep(savedStep);
      setSelectedGames(savedSelectedGames);
      setIsLoaded(true);
    }
  }, [form]);

  // Save form data to localStorage whenever form values change
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load

    const subscription = form.watch((data) => {
      const serializedData = serializeFormData(data);
      saveToLocalStorage(FORM_DATA_KEY, serializedData);
    });

    return () => subscription.unsubscribe();
  }, [form, isLoaded]);

  // Save current step to localStorage
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(CURRENT_STEP_KEY, currentStep);
    }
  }, [currentStep, isLoaded]);

  // Save selected games to localStorage
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(SELECTED_GAMES_KEY, selectedGames);
    }
  }, [selectedGames, isLoaded]);

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ["name", "email", "phone"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["selectedGames", "numberOfControllers"];
    } else if (currentStep === 3) {
      fieldsToValidate = [
        "houseNumber",
        "buildingName",
        "streetName",
        "pinCode",
        "city",
        "startDate",
        "startTime",
        "endDate",
        "endTime",
      ];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Clear localStorage data
  const clearLocalStorageData = () => {
    removeFromLocalStorage(FORM_DATA_KEY);
    removeFromLocalStorage(CURRENT_STEP_KEY);
    removeFromLocalStorage(SELECTED_GAMES_KEY);
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Combine address fields into a single address string
      const completeAddress = [
        values.houseNumber,
        values.buildingName,
        values.streetName,
        values.city,
        values.pinCode,
      ]
        .filter(Boolean)
        .join(", ");

      const submissionData = {
        ...values,
        address: completeAddress, // Combined address
        phone: `+91${values.phone}`,
        startDate: format(values.startDate, "yyyy-MM-dd"),
        endDate: format(values.endDate, "yyyy-MM-dd"),
        startDateTime: `${format(values.startDate, "yyyy-MM-dd")} ${
          values.startTime
        }`,
        endDateTime: `${format(values.endDate, "yyyy-MM-dd")} ${
          values.endTime
        }`,
        submittedAt: new Date().toISOString(),
        // Keep individual address fields for better data structure
        addressDetails: {
          houseNumber: values.houseNumber,
          buildingName: values.buildingName,
          streetName: values.streetName,
          pinCode: values.pinCode,
          city: values.city,
        },
      };

      const response = await fetch("/api/rental-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      const result = await response.json();
      if (process.env.NODE_ENV === "development") {
        console.log("Server response:", result);
      }

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      toast.success("Inquiry Submitted Successfully!", {
        description: "We'll get back to you shortly",
      });

      // Clear form and localStorage after successful submission
      form.reset(defaultValues);
      setCurrentStep(1);
      setSelectedGames([]);
      clearLocalStorageData();
      onClose?.();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Submission Failed", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form and clear localStorage
  const handleReset = () => {
    form.reset(defaultValues);
    setCurrentStep(1);
    setSelectedGames([]);
    clearLocalStorageData();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} />;
      case 2:
        return (
          <GameSelectionStep
            form={form}
            selectedGames={selectedGames}
            setSelectedGames={setSelectedGames}
          />
        );
      case 3:
        return <AddressTimeStep form={form} />;
      default:
        return null;
    }
  };

  // Show loading state until data is loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-shrink-0">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full min-h-0"
        >
          {/* Scrollable content area - reduced padding on mobile */}
          <div className="flex-1 overflow-y-auto px-1 py-1 md:py-4 min-h-0">
            <div className="space-y-2 md:space-y-6">{renderStep()}</div>
          </div>
          {/* Fixed navigation buttons at bottom - reduced padding on mobile */}
          <div className="flex-shrink-0 border-t border-gray-700 bg-gray-900 p-2 md:p-4 -mx-1">
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrevious={prevStep}
              onNext={nextStep}
              onSubmit={form.handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

// Main Modal Component - Updated to accept custom trigger button
export default function PS5InquiryModal({ triggerButton }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Default trigger button if none provided
  const defaultTriggerButton = (
    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40">
      Book Your PS5 Now
    </Button>
  );

  const triggerElement = triggerButton || defaultTriggerButton;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerElement}</DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Book Your PS5 Experience
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <PS5RentalForm onClose={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerElement}</DrawerTrigger>
      <DrawerContent className="bg-gray-900 border-gray-800 text-white h-[95vh] flex flex-col">
        <DrawerHeader className="text-left flex-shrink-0 px-4 py-2">
          <DrawerTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Book Your PS5 Experience
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 px-3 min-h-0">
          <PS5RentalForm onClose={() => setOpen(false)} />
        </div>
        <DrawerFooter className="flex-shrink-0 px-4 py-2">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 text-sm h-8"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
