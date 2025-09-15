"use client";

import { Plus, Minus } from "lucide-react";

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
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

const GAMES = [
  "Ghost of Tsushima",
  "God of War Ragnarök",
  "FIFA 25",
  "Horizon Forbidden West",
  "Spider-Man 2",
  "Red Dead Redemption 2",
  "Assassin's Creed Valhalla",
  "Ratchet & Clank: Rift Apart",
  "Hogwarts Legacy",
  "Mortal Kombat 1",
  "Elden Ring",
  "The Last of Us Part II",
  "Days Gone",
  "Uncharted 4: A Thief's End",
];

// Game Selection Step Component
export function GameSelectionStep({ form, selectedGames, setSelectedGames }) {
  const handleGameToggle = (game, checked) => {
    let updatedGames;
    if (checked) {
      updatedGames = [...selectedGames, game];
    } else {
      updatedGames = selectedGames.filter((g) => g !== game);
    }
    setSelectedGames(updatedGames);
    form.setValue("selectedGames", updatedGames, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-3 md:space-y-6">
      <h3 className="text-base md:text-lg font-semibold text-white border-b border-gray-700 pb-1.5 md:pb-2">
        Game & Controller Selection
      </h3>

      <FormField
        control={form.control}
        name="selectedGames"
        render={() => (
          <FormItem>
            <FormLabel className="text-gray-300 text-sm md:text-base">
              Select Games *
            </FormLabel>
            <FormDescription className="text-gray-500 text-xs">
              {`Choose the games you'd like to play`}
            </FormDescription>
            {/* Mobile-optimized game list */}
            <div className="grid grid-cols-1 gap-1.5 md:gap-2 max-h-28 md:max-h-32 overflow-y-auto border border-gray-700 rounded-lg p-2 md:p-3 bg-gray-800/50">
              {GAMES.map((game) => (
                <div key={game} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={game}
                    checked={selectedGames.includes(game)}
                    onCheckedChange={(checked) =>
                      handleGameToggle(game, checked)
                    }
                    className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-3.5 w-3.5 md:h-4 md:w-4"
                  />
                  <label
                    htmlFor={game}
                    className="text-xs md:text-sm text-gray-300 cursor-pointer leading-tight flex-1"
                  >
                    {game}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage className="text-red-400 text-xs md:text-sm" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customGames"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300 text-sm md:text-base">
              Other Games
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter other games you'd like"
                {...field}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 h-9 md:h-10 text-sm md:text-base"
              />
            </FormControl>
            <FormDescription className="text-gray-500 text-xs">
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
            <FormLabel className="text-gray-300 text-sm md:text-base">
              Number of Controllers *
            </FormLabel>
            <div className="flex items-center space-x-3 md:space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-8 w-8 md:h-9 md:w-9"
                onClick={() => field.onChange(Math.max(1, field.value - 1))}
                disabled={field.value <= 1}
              >
                <Minus className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <span className="text-white text-base md:text-lg font-semibold w-6 md:w-8 text-center">
                {field.value}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-8 w-8 md:h-9 md:w-9"
                onClick={() => field.onChange(Math.min(4, field.value + 1))}
                disabled={field.value >= 4}
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
            <FormDescription className="text-gray-500 text-xs">
              Choose between 1-4 controllers (max 4 players)
            </FormDescription>
            <FormMessage className="text-red-400 text-xs md:text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
}
