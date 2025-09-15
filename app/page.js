"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Clock,
  Shield,
  ChevronDown,
  Users,
  Home,
  Coffee,
  Briefcase,
} from "lucide-react";
import Testimonials from "@/components/testimonials";
import MainPage from "@/components/MainPage";
import AnimatedBeamMultipleOutputDemo from "@/components/HowItWork";
import Header from "@/components/Header";
import ResponsivePS5Form from "@/components/EnquiryModal";

const features = [
  {
    icon: <Gamepad2 className="w-10 h-10 sm:w-8 sm:h-8 text-blue-400" />,
    title: "Premium PS5 Console",
    description:
      "Latest PlayStation 5 with DualSense controllers and lightning-fast SSD.",
  },
  {
    icon: <Clock className="w-10 h-10 sm:w-8 sm:h-8 text-blue-500" />,
    title: "Flexible Rentals",
    description:
      "From weekend gaming to monthly subscriptions - rent on your terms.",
  },
];

const suitableFor = [
  {
    icon: <Gamepad2 className="w-12 h-12 sm:w-10 sm:h-10 text-blue-400" />,
    title: "Gaming Enthusiasts",
    description:
      "Want to play premium PS5 games without the hefty upfront cost of buying a console and games? ",
    highlight: "Save $500+ on console purchase",
  },
  {
    icon: <Home className="w-12 h-12 sm:w-10 sm:h-10 text-blue-500" />,
    title: "House Parties",
    description:
      "Organizing a memorable house party? Add the excitement of multiplayer PS5 gaming .",
    highlight: "Perfect party entertainment",
  },
  {
    icon: <Briefcase className="w-12 h-12 sm:w-10 sm:h-10 text-blue-400" />,
    title: "Corporate Events",
    description: "Planning a corporate event or team building activity? ",
    highlight: "Team building made fun",
  },
  {
    icon: <Coffee className="w-12 h-12 sm:w-10 sm:h-10 text-blue-500" />,
    title: "Weekend Relaxation",
    description: "Just want to unwind on weekends with some quality gaming? ",
    highlight: "Stress-free gaming",
  },
];

export default function Component() {
  const contentRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full bg-black">
      <Header />

      {/* Hero Section with more breathing room */}
      <section className="relative h-screen mt-16">
        <MainPage />

        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            background:
              "linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 70%)",
            height: "200px",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center gap-6">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <button
                  onClick={scrollToContent}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full p-4 shadow-lg transition-all duration-300 shadow-blue-500/25"
                  aria-label="Scroll to content"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </motion.div>

              <div
                className="flex items-center gap-2 cursor-pointer pb-8"
                onClick={scrollToContent}
              >
                <span className="text-base sm:text-sm md:text-base lg:text-lg font-semibold text-blue-400">
                  Here&apos;s how it works
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area with better spacing */}
      <div
        ref={contentRef}
        className="relative bg-gradient-to-b from-black to-gray-900"
      >
        {/* Who Is This For Section - Mobile Optimized */}
        <section id="suitable-for" className="py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 text-white">
                Perfect For
              </h2>
              <p className="text-base sm:text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
                Premium gaming for every occasion
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {suitableFor.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 sm:p-8 text-center hover:border-blue-500/50 transition-all duration-300 group"
                >
                  {/* Icon with larger mobile size */}
                  <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>

                  {/* Title with larger mobile text */}
                  <h3 className="text-lg sm:text-base md:text-lg lg:text-xl font-semibold mb-4 text-white">
                    {item.title}
                  </h3>

                  {/* Description with larger mobile text */}
                  <p className="text-sm sm:text-xs md:text-sm lg:text-base text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section with mobile optimization */}
        <section id="pricing" className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center"
            >
              {/* Left side - Image with better spacing */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-gray-800">
                  <img
                    src="/logo/mainPage.png"
                    alt="PS5 Console Setup"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                {/* Floating elements for visual appeal */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-15 animate-pulse delay-1000"></div>
              </div>

              {/* Right side - Pricing Content with mobile optimization */}
              <div className="space-y-8 sm:space-y-10">
                <div>
                  <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Rent Premium PS5
                  </h2>

                  <div className="space-y-6 sm:space-y-8">
                    {/* Main pricing with larger mobile text */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-xl p-6 sm:p-8 border border-blue-500/30">
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                          ₹499
                        </span>
                        <span className="text-lg sm:text-base md:text-lg text-gray-300">
                          per day
                        </span>
                      </div>
                      <p className="text-base sm:text-sm md:text-base lg:text-lg text-gray-300">
                        Console + One Controller included
                      </p>
                    </div>

                    {/* Add-on pricing with larger mobile text */}
                    <div className="bg-gray-900/50 rounded-xl p-6 sm:p-8 border border-gray-700">
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-2xl sm:text-xl md:text-2xl font-bold text-blue-400">
                          ₹250
                        </span>
                        <span className="text-base sm:text-sm md:text-base text-gray-400">
                          per additional controller
                        </span>
                      </div>
                      <p className="text-sm sm:text-xs md:text-sm lg:text-base text-gray-400">
                        Perfect for multiplayer gaming sessions
                      </p>
                    </div>

                    {/* Features list with larger mobile elements */}
                    <div className="space-y-5">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            {feature.icon}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-base sm:text-sm md:text-base lg:text-lg font-semibold text-white">
                              {feature.title}
                            </h4>
                            <p className="text-sm sm:text-xs md:text-sm lg:text-base text-gray-300 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button with top margin */}
                    <div className="pt-6">
                      <ResponsivePS5Form />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom spacer */}
        <div className="py-10 lg:py-16"></div>
      </div>
    </div>
  );
}
