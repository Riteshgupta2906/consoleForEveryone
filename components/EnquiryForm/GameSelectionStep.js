"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const PS5_PS4_RENTAL_CATALOG = {
  All_Time_Favorites: [
    "God of War Ragnarök",
    "God of War Remastered",
    "God of War (2018)",
    "Spider-Man",
    "Spider-Man: Miles Morales",
    "Spider-Man 2",
    "Uncharted 4: A Thief's End",
    "Ghost of Tsushima",
    "Horizon Zero Dawn",
    "Horizon Forbidden West",
    "Ratchet & Clank: Rift Apart",
    "It Takes Two",
  ],
  Story_And_Adventure: [
    "The Last of Us Part I",
    "The Last of Us Part II",
    "Black Myth: Wukong",
    "Cyberpunk 2077",
    "Hogwarts Legacy",
    "Assassin's Creed Origins",
    "Assassin's Creed Mirage",
    "Assassin's Creed Odyssey",
    "Assassin's Creed Valhalla",
    "The Witcher 3: Wild Hunt",
    "Red Dead Redemption 2",
    "Red Dead Redemption",
    "Days Gone",
    "Rise of the Ronin",
    "Final Fantasy XVI",
    "Final Fantasy VII Rebirth",
  ],
  Action_And_Shooting: [
    "Call of Duty: Modern Warfare",
    "Call of Duty: Modern Warfare II",
    "Call of Duty: Modern Warfare III",
    "Grand Theft Auto V",
    "Warhammer",
  ],
  Fighting_And_Wrestling: [
    "Tekken 7",
    "Mortal Kombat",
    "WWE 2K25",
    "Dragon Ball: Sparking Zero",
  ],
  Racing_And_Speed: [
    "Gran Turismo 7",
    "F1 24",
    "Need for Speed: Unbound",
    "Dirt 5",
    "MotoGP 24",
  ],
  Sports_And_Competition: ["FIFA 25 (EA Sports FC 25)", "Cricket 24"],
  Horror_And_Thrillers: [
    "Resident Evil 4 Remake",
    "Silent Hill 2",
    "Sekiro: Shadows Die Twice",
    "Elden Ring",
    "Batman: Arkham Knight",
    "Batman: Arkham City",
    "Bloodborne",
  ],
};

const GAME_IMAGES = {
  "God of War Ragnarök": "userGames/Image/god of war ragnarok.avif",
  "God of War Remastered": "userGames/Image/God of war remastered.jpg",
  "God of War (2018)": "userGames/Image/god of war.avif",
  "Spider-Man": "userGames/Image/spider man.webp",
  "Spider-Man: Miles Morales": "userGames/Image/spider man miles morales.webp",
  "Spider-Man 2": "userGames/Image/Spider man 2.avif",
  "Uncharted 4: A Thief's End": "userGames/Image/uncharted 4.webp",
  "Ghost of Tsushima": "userGames/Image/ghost of tsushima.webp",
  "Horizon Zero Dawn": "userGames/Image/horizon zero dawn.avif",
  "Horizon Forbidden West": "userGames/Image/horizon forbidden west.avif",
  "Ratchet & Clank: Rift Apart":
    "userGames/Image/Ratchet & Clank Rift Apart.avif",
  "It Takes Two": "userGames/Image/it takes two.webp",
  "The Last of Us Part I": "userGames/Image/last of us part 1.webp",
  "The Last of Us Part II": "userGames/Image/last of us part 2.avif",
  "Black Myth: Wukong": "userGames/Image/black myth wukong.avif",
  "Cyberpunk 2077": "userGames/Image/cyberpunk.webp",
  "Hogwarts Legacy": "userGames/Image/hogwarts legacy.avif",
  "Assassin's Creed Origins": "userGames/Image/Assassin creed origins.webp",
  "Assassin's Creed Mirage": "userGames/Image/Assassin creed mirage.avif",
  "Assassin's Creed Odyssey": "userGames/Image/Assassin creed odyssey.avif",
  "Assassin's Creed Valhalla": "userGames/Image/Assassin creed valhalla.avif",
  "The Witcher 3: Wild Hunt": "userGames/Image/witcher 3.avif",
  "Red Dead Redemption 2": "userGames/Image/rdr 2.avif",
  "Red Dead Redemption": "userGames/Image/rdr.avif",
  "Days Gone": "userGames/Image/days gone.webp",
  "Rise of the Ronin": "userGames/Image/ronin.webp",
  "Final Fantasy XVI": "userGames/Image/final fantasy 16.webp",
  "Final Fantasy VII Rebirth": "userGames/Image/Final Fantasy Rebirth.avif",
  "Call of Duty: Modern Warfare": "userGames/Image/cod mw.webp",
  "Call of Duty: Modern Warfare II": "userGames/Image/cod mw2.jpg",
  "Call of Duty: Modern Warfare III": "userGames/Image/COD MW3.avif",
  "Grand Theft Auto V": "userGames/Image/gta 5.webp",
  Warhammer: "userGames/Image/war hammer.avif",
  "Tekken 7": "userGames/Image/tekken.avif",
  "Mortal Kombat": "userGames/Image/mortal kombat.avif",
  "WWE 2K25": "userGames/Image/wwe 25.avif",
  "Dragon Ball: Sparking Zero": "userGames/Image/dragon ball.avif",
  "Gran Turismo 7": "userGames/Image/gran turismo.webp",
  "F1 24": "userGames/Image/f1 24.avif",
  "Need for Speed: Unbound": "userGames/Image/unbound.webp",
  "Dirt 5": "userGames/Image/dirt 5.avif",
  "MotoGP 24": "userGames/Image/motogp.avif",
  "FIFA 25 (EA Sports FC 25)": "userGames/Image/fifa.avif",
  "Cricket 24": "userGames/Image/cricket.avif",
  "Resident Evil 4 Remake": "userGames/Image/RE 4.avif",
  "Silent Hill 2": "userGames/Image/silent hill 2.avif",
  "Sekiro: Shadows Die Twice": "userGames/Image/sekiro.jpg",
  "Elden Ring": "userGames/Image/elden ring.webp",
  "Batman: Arkham Knight": "userGames/Image/batman arckhan knight.avif",
  "Batman: Arkham City": "userGames/Image/arkham city.webp",
  Bloodborne: "userGames/Image/bloodborne.jpg",
};

export function GameSelectionStep({ form }) {
  const [selectedGames, setSelectedGames] = useState([]);

  const handleGameToggle = (game) => {
    const updatedGames = selectedGames.includes(game)
      ? selectedGames.filter((g) => g !== game)
      : [...selectedGames, game];
    setSelectedGames(updatedGames);
    form.setValue("selectedGames", updatedGames, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Convert category names for display with shorter titles
  const formatCategoryName = (category) => {
    const shortNames = {
      All_Time_Favorites: "Favorites",
      Story_And_Adventure: "Adventure",
      Action_And_Shooting: "Action",
      Fighting_And_Wrestling: "Fighting",
      Racing_And_Speed: "Racing",
      Sports_And_Competition: "Sports",
      Horror_And_Thrillers: "Horror",
    };
    return shortNames[category] || category.replace(/_/g, " ");
  };

  // Generate tab values from category keys
  const getTabValue = (category) => {
    return category.toLowerCase().replace(/_/g, "-");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
        Game & Controller Selection
      </h3>

      <FormField
        control={form.control}
        name="selectedGames"
        render={() => (
          <FormItem>
            <FormLabel className="text-base text-gray-300">
              Select Games *
            </FormLabel>
            <FormDescription className="text-xs text-gray-500">
              {`Choose the games you'd like to play`}
            </FormDescription>

            <Tabs
              defaultValue="all-time-favorites"
              className="w-full"
              orientation="vertical"
            >
              {/* Mobile & Tablet Layout - Fixed height container with tabs on left, scrollable images on right */}
              <div className="flex lg:block">
                {/* Mobile & Tablet: Fixed height tabs sidebar */}
                <div className="lg:hidden w-16 md:w-20 bg-gray-900 flex flex-col h-96">
                  <TabsList className="flex flex-col w-full h-full bg-gray-800 p-1 gap-1 rounded-l-lg rounded-r-none">
                    {Object.keys(PS5_PS4_RENTAL_CATALOG).map((category) => (
                      <TabsTrigger
                        key={category}
                        value={getTabValue(category)}
                        className="text-[9px] md:text-[10px] px-1 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors w-full justify-center text-center leading-tight h-auto flex-1 flex items-center"
                      >
                        <span className="transform -rotate-0 whitespace-nowrap">
                          {formatCategoryName(category)}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Desktop/Laptop tabs (lg and up) */}
                <TabsList className="hidden lg:grid w-full grid-cols-7 bg-gray-800 mb-4 h-auto p-1 gap-1">
                  {Object.keys(PS5_PS4_RENTAL_CATALOG).map((category) => (
                    <TabsTrigger
                      key={category}
                      value={getTabValue(category)}
                      className="text-sm px-2 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                      {formatCategoryName(category)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Content area - scrollable images on mobile/tablet, normal on desktop */}
                <div className="flex-1 lg:w-full">
                  {Object.entries(PS5_PS4_RENTAL_CATALOG).map(
                    ([category, games]) => (
                      <TabsContent
                        key={category}
                        value={getTabValue(category)}
                        className="mt-0 lg:mt-4"
                      >
                        {/* Mobile & Tablet: Fixed height scrollable container */}
                        <div className="lg:hidden h-96 overflow-y-auto bg-gray-800 rounded-r-lg p-2">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 pb-4">
                            {games.map((game) => (
                              <div
                                key={game}
                                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                                  selectedGames.includes(game)
                                    ? "ring-2 ring-blue-500 scale-105 shadow-lg shadow-blue-500/50"
                                    : "ring-1 ring-gray-700 hover:ring-blue-600 hover:scale-102"
                                }`}
                                onClick={() => handleGameToggle(game)}
                              >
                                <div className="w-full h-24 md:h-28">
                                  <img
                                    src={GAME_IMAGES[game]}
                                    alt={game}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>

                                {selectedGames.includes(game) && (
                                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                    <div className="bg-blue-500 rounded-full p-1">
                                      <span className="text-white text-xs font-bold">
                                        ✓
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Game title overlay for mobile/tablet */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-1">
                                  <p className="text-white text-[8px] md:text-[9px] font-medium line-clamp-2 leading-tight">
                                    {game}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Desktop/Laptop: Normal grid layout */}
                        <div className="hidden lg:grid grid-cols-5 xl:grid-cols-6 gap-4">
                          {games.map((game) => (
                            <div
                              key={game}
                              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                                selectedGames.includes(game)
                                  ? "ring-2 ring-blue-500 scale-105 shadow-lg shadow-blue-500/50"
                                  : "ring-1 ring-gray-700 hover:ring-blue-600 hover:scale-102"
                              }`}
                              onClick={() => handleGameToggle(game)}
                            >
                              <div className="aspect-[3/4] w-full">
                                <img
                                  src={GAME_IMAGES[game]}
                                  alt={game}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>

                              {selectedGames.includes(game) && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                  <div className="bg-blue-500 rounded-full p-2">
                                    <span className="text-white text-lg font-bold">
                                      ✓
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Tooltip for larger screens */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                                <p className="font-medium truncate">{game}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    )
                  )}
                </div>
              </div>
            </Tabs>

            {selectedGames.length > 0 && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">
                  Selected Games ({selectedGames.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedGames.map((game) => (
                    <span
                      key={game}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleGameToggle(game)}
                    >
                      {game}
                      <span className="text-blue-200">×</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <FormMessage className="text-red-400 text-sm" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customGames"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base text-gray-300">
              Other Games
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter other games you'd like"
                {...field}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              Optional - Specify games not in the list above
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numberOfControllers"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base text-gray-300">
              Number of Controllers *
            </FormLabel>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-10 w-10"
                onClick={() =>
                  field.onChange(Math.max(1, (field.value || 1) - 1))
                }
                disabled={field.value <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold text-white min-w-[2rem] text-center">
                {field.value || 1}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-10 w-10"
                onClick={() =>
                  field.onChange(Math.min(2, (field.value || 1) + 1))
                }
                disabled={field.value >= 2}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <FormMessage className="text-red-400 text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
}
