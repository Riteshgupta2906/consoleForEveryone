"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ResponsivePS5Form from "@/components/EnquiryModal";

const VisuallyHidden = ({ children }) => (
  <span className="sr-only">{children}</span>
);

const Header = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="">
                <Image
                  src="/logo/logo.png"
                  alt="PS5 Elite Logo"
                  width={64}
                  height={64}
                  className="w-14 h-14 object-contain"
                  priority
                />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Console
                </span>
                <p className="text-xs text-blue-400 font-medium -mt-1">
                  For Everyone
                </p>
              </div>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/#suitable-for"
                className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
              >
                Perfect For
              </Link>

              <Link
                href="/#pricing"
                className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/gallery"
                className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
              >
                Game Gallery
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ResponsivePS5Form />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:text-blue-400"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-black border-l border-gray-800">
              <VisuallyHidden>
                <SheetTitle>Menu</SheetTitle>
              </VisuallyHidden>
              <div className="flex flex-col space-y-6 mt-8">
                <Link href="/" className="flex items-center space-x-3 mb-4">
                  <div className="">
                    <Image
                      src="/logo/logo.png"
                      alt="PS5 Elite Logo"
                      width={32}
                      height={32}
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      Console
                    </span>
                    <p className="text-xs text-blue-400 font-medium -mt-1">
                      For Everyone
                    </p>
                  </div>
                </Link>
                <Link
                  href="/#suitable-for"
                  className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Perfect For
                </Link>

                <Link
                  href="/#pricing"
                  className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/gallery"
                  className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Game Gallery
                </Link>
                <ResponsivePS5Form
                  triggerButton={
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 rounded-md px-6 py-3 transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center">
                      Rent PS5 Now
                      <Play className="w-4 h-4 ml-2" />
                    </Button>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Header;
