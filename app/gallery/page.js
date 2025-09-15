"use client";
import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Image from "next/image"; // Changed to the standard Next.js Image component

// A manually defined list of your gallery images
const galleryImages = [
  { id: 1, src: "/gameImages/image6.avif", alt: "Marvel's Spider-Man 2" },
  {
    id: 2,
    src: "/gameImages/image11.avif",
    alt: "God of War 20th Anniversary",
  },
  { id: 3, src: "/gameImages/image3.webp", alt: "Tekken 8" },
  { id: 4, src: "/gameImages/image7.avif", alt: "Horizon Zero Dawn" },
  {
    id: 5,
    src: "/gameImages/image12.avif",
    alt: "Uncharted: Legacy of Thieves Collection",
  },
  { id: 6, src: "/gameImages/image15.webp", alt: "The Last of Us Part I" },
  { id: 7, src: "/gameImages/image2.avif", alt: "Assassin's Creed Shadows" },
  { id: 8, src: "/gameImages/image1.avif", alt: "Cronos: The New Dawn" },
  { id: 9, src: "/gameImages/image14.avif", alt: "F1 25" },
  { id: 10, src: "/gameImages/image10.avif", alt: "Helldivers II" },
  { id: 11, src: "/gameImages/image4.avif", alt: "Black Myth: Wukong" },
  { id: 12, src: "/gameImages/image8.avif", alt: "EA Sports UFC 5" },
  { id: 13, src: "/gameImages/image13.avif", alt: "EA Sports FC 25" },
  { id: 14, src: "/gameImages/image9.avif", alt: "Hell is Us" },
  {
    id: 15,
    src: "/gameImages/image16.avif",
    alt: "Cyberpunk-style characters",
  },
  { id: 16, src: "/gameImages/image19.jpeg", alt: "Horizon Forbidden West" },
  { id: 17, src: "/gameImages/image26.webp", alt: "Days Gone" },
  { id: 18, src: "/gameImages/image24.avif", alt: "Mortal Kombat 1" },
  {
    id: 19,
    src: "/gameImages/image17.webp",
    alt: "Ghost of Tsushima Director's Cut",
  },
  { id: 20, src: "/gameImages/image23.avif", alt: "Hogwarts Legacy" },
  { id: 21, src: "/gameImages/image35.avif", alt: "Elden Ring" },
  { id: 22, src: "/gameImages/image20.webp", alt: "Red Dead Redemption II" },
  { id: 23, src: "/gameImages/image21.avif", alt: "Assassin's Creed Valhalla" },
  {
    id: 24,
    src: "/gameImages/image22.webp",
    alt: "Ratchet & Clank: Rift Apart",
  },
];

// This function now works with the local image source path
const getStableHeight = (src) => {
  const hash = src.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return 250 + (Math.abs(hash) % 51);
};

export default function MasonryGallery() {
  const [columns, setColumns] = useState(5);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageHeights, setImageHeights] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // This no longer needs to be an async function
    const loadImages = () => {
      try {
        const heights = {};
        galleryImages.forEach((image) => {
          heights[image.src] = getStableHeight(image.src);
        });
        setImageHeights(heights);
        setImages(galleryImages);
      } catch (error) {
        console.error("Error processing images:", error);
      } finally {
        // Use a small timeout to prevent jarring layout shifts on fast connections
        setTimeout(() => setLoading(false), 300);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width <= 640) setColumns(2);
      else if (width <= 768) setColumns(3);
      else if (width <= 1024) setColumns(5);
      else if (width <= 1440) setColumns(7);
      else setColumns(9);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [isMounted]);

  if (loading) {
    const skeletonHeights = Array(galleryImages.length) // Match the number of images
      .fill(0)
      .map((_, index) => 250 + (Math.abs(index * 27) % 51));

    return (
      <div className="container mx-auto px-4 mt-24">
        <div className="h-10 w-72 bg-gray-800 rounded-lg animate-pulse mb-8"></div>
        <div className="px-2">
          <Masonry
            breakpointCols={columns}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {skeletonHeights.map((height, index) => (
              <div
                key={index}
                className="mb-4 rounded-xl overflow-hidden w-full bg-gray-800"
                style={{ height: `${height}px` }}
              >
                <div className="w-full h-full animate-pulse"></div>
              </div>
            ))}
          </Masonry>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-24">
      <div className="px-2">
        <Masonry
          breakpointCols={columns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="group mb-4 rounded-xl overflow-hidden w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:shadow-[rgba(0,_0,_0,_0.24)_0px_12px_24px] transition-all duration-300 transform hover:-translate-y-1"
              style={{
                height: `${imageHeights[image.src]}px`,
              }}
            >
              <Image
                width={800}
                height={600}
                src={image.src}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, (max-width: 1440px) 14vw, 11vw"
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ height: "100%" }}
              />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
}
