"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ChevronDown, Play, Gamepad2 } from "lucide-react";

const ps5Games = [
  {
    id: 1,
    src: "/gameImages/image6.avif",
    alt: "Spider-Man 2",
    title: "Spider-Man 2",
  },
  {
    id: 2,
    src: "/gameImages/image11.avif",
    alt: "God of War Ragnarök",
    title: "God of War Ragnarök",
  },
  {
    id: 3,
    src: "/gameImages/image7.avif",
    alt: "Horizon Forbidden West",
    title: "Horizon Forbidden West",
  },
  {
    id: 4,
    src: "/gameImages/image12.avif",
    alt: "The Last of Us Part I",
    title: "The Last of Us Part I",
  },
  {
    id: 5,
    src: "/gameImages/image1.avif",
    alt: "Ratchet & Clank",
    title: "Ratchet & Clank",
  },
  {
    id: 6,
    src: "/gameImages/image14.avif",
    alt: "Gran Turismo 7",
    title: "Gran Turismo 7",
  },
  {
    id: 7,
    src: "/gameImages/image3.webp",
    alt: "Demon's Souls",
    title: "Demon's Souls",
  },
  {
    id: 8,
    src: "/gameImages/image9.avif",
    alt: "Returnal",
    title: "Returnal",
  },
  {
    id: 9,
    src: "/gameImages/image2.avif",
    alt: "Ghost of Tsushima",
    title: "Ghost of Tsushima",
  },
  {
    id: 10,
    src: "/gameImages/image13.avif",
    alt: "FIFA 24",
    title: "FIFA 24",
  },
  {
    id: 11,
    src: "/gameImages/image8.avif",
    alt: "Call of Duty",
    title: "Call of Duty",
  },
  {
    id: 12,
    src: "/gameImages/image10.avif",
    alt: "Assassin's Creed Mirage",
    title: "Assassin's Creed Mirage",
  },
  {
    id: 13,
    src: "/gameImages/image4.avif",
    alt: "Baldur's Gate 3",
    title: "Baldur's Gate 3",
  },
  {
    id: 14,
    src: "/gameImages/image15.webp",
    alt: "The Last of Us Part I",
    title: "The Last of Us Part I",
  },
  {
    id: 15,
    src: "/gameImages/image16.avif",
    alt: "Cyberpunk 2077",
    title: "Cyberpunk 2077",
  },
  {
    id: 16,
    src: "/gameImages/image19.jpeg",
    alt: "Horizon Forbidden West",
    title: "Horizon Forbidden West",
  },
  {
    id: 17,
    src: "/gameImages/image26.webp",
    alt: "Days Gone",
    title: "Days Gone",
  },
  {
    id: 18,
    src: "/gameImages/image24.avif",
    alt: "Mortal Kombat 1",
    title: "Mortal Kombat 1",
  },
  {
    id: 19,
    src: "/gameImages/image17.webp",
    alt: "Ghost of Tsushima Director's Cut",
    title: "Ghost of Tsushima Director's Cut",
  },
  {
    id: 20,
    src: "/gameImages/image23.avif",
    alt: "Hogwarts Legacy",
    title: "Hogwarts Legacy",
  },
  {
    id: 21,
    src: "/gameImages/image35.avif",
    alt: "Elden Ring",
    title: "Elden Ring",
  },
  {
    id: 22,
    src: "/gameImages/image20.webp",
    alt: "Red Dead Redemption II",
    title: "Red Dead Redemption II",
  },
  {
    id: 23,
    src: "/gameImages/image21.avif",
    alt: "Assassin's Creed Valhalla",
    title: "Assassin's Creed Valhalla",
  },
  {
    id: 24,
    src: "/gameImages/image22.webp",
    alt: "Ratchet & Clank: Rift Apart",
    title: "Ratchet & Clank: Rift Apart",
  },
];

const CurvedGrid = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(0); // 1. Start with a default server-safe value

  // 2. This effect runs ONLY on the client, after the initial render
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width on mount
    handleResize();

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this runs once on mount

  const columns = 7;
  const columnWrapper = {};
  const result = [];

  for (let i = 0; i < columns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  for (let i = 0; i < children.length; i++) {
    const columnIndex = i % columns;
    columnWrapper[`column${columnIndex}`].push(
      <div key={i} className="mb-4">
        {children[i]}
      </div>
    );
  }

  const getMarginTop = (index) => {
    // 3. The calculation now depends on the state, which is consistent
    // on the server (0) and updated safely on the client.
    if (windowWidth === 0) {
      // Return a default or null value for the server and initial render
      return 300; // Or whatever your largest default is
    }

    const middleIndex = Math.floor((columns - 1) / 2);
    const distance = Math.abs(index - middleIndex);
    const margins = {
      sm: 150,
      md: 190,
      lg: 300,
    };

    const getMaxMargin = () => {
      if (windowWidth < 768) return margins.sm;
      if (windowWidth < 1024) return margins.md;
      return margins.lg;
    };

    const maxMargin = getMaxMargin();
    const step = maxMargin / middleIndex;
    return maxMargin - distance * step;
  };

  for (let i = 0; i < columns; i++) {
    result.push(
      <div
        key={i}
        className="flex-1"
        style={{
          marginLeft: i > 0 ? "16px" : "0",
          marginTop: `${getMarginTop(i)}px`,
        }}
      >
        {columnWrapper[`column${i}`]}
      </div>
    );
  }

  // 4. Don't render until the width is known to avoid a layout flash
  if (windowWidth === 0) {
    return null; // Or a loading spinner
  }

  return (
    <div
      className="flex mx-auto"
      style={{
        width: "100%",
        maxWidth: windowWidth < 768 ? "100%" : "1400px",
        padding: windowWidth < 768 ? "0 16px" : "0",
      }}
    >
      {result}
    </div>
  );
};

// Assume ps5Games array is defined elsewhere and imported

const AnimatedGameCard = ({ game: initialGame, columnIndex, totalColumns }) => {
  const [currentGame, setCurrentGame] = useState(initialGame);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Constants for animation timing
  const cycleInterval = totalColumns * 1000 + 1000;
  const columnDelay = 1000;

  useEffect(() => {
    // Initial fade-in animation for the card
    const visibilityTimer = setTimeout(
      () => setIsVisible(true),
      columnIndex * 200
    );

    // Filter games for this specific column
    const columnGames = ps5Games.filter(
      (_, index) => index % totalColumns === columnIndex
    );
    let currentGameIndex = columnGames.findIndex(
      (game) => game.id === currentGame.id
    );

    // Set up the interval to cycle through games
    const animationInterval = setInterval(() => {
      setTimeout(() => {
        setIsAnimating(true); // Start the fade-out/scale animation
        setTimeout(() => {
          // Update to the next game in the sequence
          currentGameIndex = (currentGameIndex + 1) % columnGames.length;
          setCurrentGame(columnGames[currentGameIndex]);
          setIsImageLoaded(false); // Reset for the new image
          setIsAnimating(false); // Start the fade-in animation
        }, 500); // Duration of the fade-out animation
      }, columnIndex * columnDelay);
    }, cycleInterval);

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(visibilityTimer);
      clearInterval(animationInterval);
    };
  }, [columnIndex, currentGame.id, totalColumns]);

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 transform bg-gray-900 border border-gray-800 hover:border-blue-500/50 group
       ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      style={{ transitionDelay: `${columnIndex * 200}ms` }}
    >
      <div className="aspect-[3/4] relative">
        <div
          className={`transform transition-all duration-500 w-full h-full ${
            isAnimating || !isImageLoaded
              ? "opacity-0 scale-110 blur-sm"
              : "opacity-100 scale-100 blur-0"
          }`}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-gray-900 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
            <Image
              src={currentGame.src}
              alt={currentGame.alt}
              fill
              className="object-cover"
              onLoad={() => setIsImageLoaded(true)}
              onError={() =>
                console.error(`Failed to load image: ${currentGame.src}`)
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            {/* <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-sm truncate">
                {currentGame.title}
              </h3>
              <p className="text-blue-300 text-xs">Available Now</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default function MainPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "PlayStation 5, Ready to Play",
    "No More Boring Weekends!",
    "Get PS5 with Latest Games Delivered",
    "Got No Plans? Rent PS5!",
    "Premium Gaming Experience",
    "Game Without Limits",
    "Your Next Gaming Adventure Awaits",
    "Epic Games, Zero Commitment",
    "Weekend Warriors Welcome",
    "Level Up Your Free Time",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen mt-8 bg-black mx-auto">
      <main className="overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold px-4 pb-8 mt-8 text-white">
            Premium PS5 Rentals
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mt-2">
              {slides[currentSlide]}
            </div>
          </h1>

          <div
            className="mt-[100px] overflow-hidden"
            style={{ margin: "0 auto", width: "100%", maxWidth: "1400px" }}
          >
            <div
              style={{
                width: "1400px",
                marginLeft: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <CurvedGrid>
                {ps5Games.map((game, index) => (
                  <AnimatedGameCard
                    key={game.id}
                    game={game}
                    columnIndex={index % 7}
                    totalColumns={9} // <-- Add this line
                  />
                ))}
              </CurvedGrid>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
