"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { Brain, Image as ImageIcon, Type } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const ImageBlock = forwardRef(
  ({ className, children, label, showImageIcon }, ref) => {
    return (
      <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105">
        <div
          ref={ref}
          className={cn(
            "z-10 flex items-center justify-center rounded-lg border-2 border-border bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
            "size-16 md:size-48",
            "transition-all duration-300 hover:shadow-lg hover:border-blue-400",
            className
          )}
        >
          {showImageIcon ? (
            <>
              <div className="block md:hidden">
                <ImageIcon size={24} className="text-gray-600" />
              </div>
              <div className="hidden md:block w-full h-full">{children}</div>
            </>
          ) : (
            children
          )}
        </div>
        <span className="text-sm md:text-base text-gray-600 font-medium">
          {label}
        </span>
      </div>
    );
  }
);

ImageBlock.displayName = "ImageBlock";

const PromptBlock = forwardRef(({ className, children }, ref) => {
  return (
    <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105">
      <div
        ref={ref}
        className={cn(
          "z-10 size-16 md:size-48 p-2 md:p-4 rounded-lg border-2 border-border bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          "transition-all duration-300 hover:shadow-lg hover:border-blue-400",
          "flex items-center justify-center",
          className
        )}
      >
        <div className="block md:hidden">
          <Type size={24} className="text-gray-600" />
        </div>
        <div className="hidden md:block">{children}</div>
      </div>
      <span className="text-sm md:text-base text-gray-600 font-medium">
        Prompt
      </span>
    </div>
  );
});

PromptBlock.displayName = "PromptBlock";

export default function AnimatedBeamMultipleOutputDemo({ className }) {
  const containerRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const promptRef = useRef(null);
  const brainRef = useRef(null);
  const outputRef = useRef(null);

  return (
    <div
      className={cn(
        "relative flex flex-col h-[700px] md:h-[900px] w-full items-center justify-start overflow-hidden rounded-lg  bg-background p-10 ",
        className
      )}
      ref={containerRef}
    >
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-4xl font-bold text-center  text-purple-600">
          How It Works
        </h2>
      </div>

      <div className="flex size-full flex-row items-stretch justify-between gap-10 max-w-5xl">
        <div className="flex flex-col justify-center gap-6 md:gap-10">
          <ImageBlock ref={img1Ref} showImageIcon label="Human Model">
            <img
              src="./model.png"
              alt="Human model"
              className="w-full h-full object-cover rounded-lg"
            />
          </ImageBlock>
          <ImageBlock ref={img2Ref} showImageIcon label="Dress">
            <img
              src="./dress.png"
              alt="Dress"
              className="w-full h-full object-cover rounded-lg"
            />
          </ImageBlock>
          <PromptBlock ref={promptRef} className="bg-gray-50">
            <p className="text-xs md:text-sm text-gray-700">
              Generate an image of the model wearing the dress while maintaining
              a natural pose and lighting
            </p>
          </PromptBlock>
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <div
            ref={brainRef}
            className="z-10 flex size-16 md:size-20 items-center justify-center rounded-full border-2 border-border bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-400"
          >
            <Brain size={32} className="text-gray-600" />
          </div>
          <span className="text-sm md:text-base text-gray-600 font-medium">
            AI Model
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <ImageBlock ref={outputRef} showImageIcon label="Generated Image">
            <img
              src="./mode_dress.png"
              alt="Generated image"
              className="w-full h-full object-cover rounded-lg"
            />
          </ImageBlock>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={img1Ref}
        toRef={brainRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={img2Ref}
        toRef={brainRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={promptRef}
        toRef={brainRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={brainRef}
        toRef={outputRef}
      />
    </div>
  );
}
