"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Wand2, Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FACE_INDICES = [0, 1, 2, 3, 4];

const fetchImages = async () => {
  try {
    const response = await fetch("/api/cloudinary/faceChange");
    if (!response.ok) throw new Error("Network response was not ok");
    const resources = await response.json();

    const faceData = FACE_INDICES.map((index) => {
      const faceImage = resources.find(
        (img) =>
          img.asset_folder === "faceChange/faces" &&
          img.display_name === `face${index}`
      );
      const finalImage = resources.find(
        (img) =>
          img.asset_folder === "faceChange/finalImages" &&
          img.display_name === `face${index}`
      );

      if (!faceImage || !finalImage) {
        console.warn(`Missing images for face${index}`);
        return null;
      }

      return {
        id: index,
        name: `Face ${index}`,
        faceImage: faceImage.secure_url,
        finalImage: finalImage.secure_url,
      };
    }).filter(Boolean);

    if (!faceData.length) throw new Error("No face images found");
    return faceData;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

export default function ImageCustomizer() {
  const [selectedFace, setSelectedFace] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("face");

  const {
    data: faces,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faceChangeImages"],
    queryFn: fetchImages,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (faces?.length > 0 && !selectedFace) {
      setSelectedFace(faces[0]);
      setGeneratedImage(faces[0].finalImage);
    }
  }, [faces, selectedFace]);

  const handleFaceSelect = (face) => {
    setSelectedFace(face);
  };

  const handleGenerate = () => {
    if (!selectedFace) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedImage(selectedFace.finalImage);
      setIsGenerating(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <section className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-gray-200 rounded mb-12 mx-auto" />
          <div className=" mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className="bg-gray-200 rounded-lg"
                style={{ aspectRatio: "2/3" }}
              />
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="h-10 bg-gray-200 rounded mb-6" />
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-full"
                    />
                  ))}
                </div>
                <div className="h-40 bg-gray-200 rounded" />
                <div className="h-10 w-32 bg-gray-200 rounded mt-6 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error:{" "}
        {error.message || "Error loading images. Please try again later."}
      </div>
    );
  }

  const TabContent = ({ type }) => {
    if (type === "face") {
      return (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Select a Face</h3>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6">
            {faces?.map((face) => (
              <button
                key={face.id}
                onClick={() => handleFaceSelect(face)}
                className="relative group"
              >
                <div className="relative w-full aspect-square">
                  <div
                    className={`
                      relative w-full h-full rounded-full overflow-hidden
                      ${
                        selectedFace?.id === face.id
                          ? "ring-4 ring-[#E6E6FA] ring-offset-2"
                          : ""
                      }
                      transition-all duration-200 ease-in-out
                      transform hover:scale-105
                    `}
                  >
                    <Image
                      src={face.faceImage}
                      alt={face.name}
                      fill
                      className="object-cover w-10 h-10 md:w-12 md:h-12"
                    />
                  </div>
                  {selectedFace?.id === face.id && (
                    <div className="absolute -top-2 -right-2 bg-[#E6E6FA] text-white rounded-full p-1">
                      <Check size={12} className="text-gray-700" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (type === "clothes") {
      return (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Clothes Customization</h3>
          <p className="mb-6">
            Options for changing the clothes will appear here.
          </p>
        </div>
      );
    }
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Background Customization</h3>
        <p className="mb-6">
          Options for changing the background will appear here.
        </p>
      </div>
    );
  };

  return (
    <section id="how-it-works" className="container mx-auto py-6 md:py-12 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-purple-600">
          How It Works
        </h1>
      </div>

      <div className=" mx-auto  bg-white/50 rounded-2xl shadow-lg p-4 md:p-8 ">
        <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className=" mx-auto  relative w-full order-2 md:order-1">
            {isGenerating ? (
              <div
                className="rounded-lg mx-auto flex items-center justify-center bg-gradient-to-r from-gray-150 to-gray-250 bg-[length:400%_400%] animate-gradient"
                style={{ aspectRatio: "2/3", maxHeight: "600px" }}
              >
                <div className="text-center transform transition-transform animate-bounce-slow">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin mx-auto mb-2 md:mb-3" />
                  <p className="text-gray-600 font-medium text-base md:text-lg">
                    Generating Magic...
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">
                    Please wait
                  </p>
                </div>
              </div>
            ) : (
              generatedImage && (
                <div
                  className="mx-auto relative transition-opacity duration-300 ease-in-out shadow-lg rounded-xl"
                  style={{ aspectRatio: "2/3", maxHeight: "600px" }}
                >
                  <Image
                    src={generatedImage}
                    alt="Generated Image"
                    fill
                    className="rounded-xl object-cover animate-fadeIn"
                    priority
                  />
                </div>
              )
            )}
          </div>

          <div className="bg-background bg-white/50 p-4 md:p-6 rounded-lg shadow-lg order-1 md:order-2">
            {/* Mobile View */}
            <div className="md:hidden">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  className={`flex-1 justify-center ${
                    activeTab === activeTab
                      ? "bg-[#E6E6FA] text-purple-700"
                      : ""
                  }`}
                >
                  {activeTab === "face"
                    ? " Face"
                    : activeTab === "clothes"
                    ? " Clothes"
                    : " Background"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className={
                        activeTab === "face"
                          ? "bg-[#E6E6FA] text-purple-700"
                          : ""
                      }
                      onClick={() => setActiveTab("face")}
                    >
                      Face
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={
                        activeTab === "clothes"
                          ? "bg-[#E6E6FA] text-purple-700"
                          : ""
                      }
                      onClick={() => setActiveTab("clothes")}
                    >
                      Clothes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={
                        activeTab === "background"
                          ? "bg-[#E6E6FA] text-purple-700"
                          : ""
                      }
                      onClick={() => setActiveTab("background")}
                    >
                      Background
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Tab Content */}
              <TabContent type={activeTab} />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="face"
                    className="data-[state=active]:bg-[#E6E6FA] data-[state=active]:text-purple-700"
                  >
                    Face
                  </TabsTrigger>
                  <TabsTrigger
                    value="clothes"
                    className="data-[state=active]:bg-[#E6E6FA] data-[state=active]:text-purple-700"
                  >
                    Clothes
                  </TabsTrigger>
                  <TabsTrigger
                    value="background"
                    className="data-[state=active]:bg-[#E6E6FA] data-[state=active]:text-purple-700"
                  >
                    Background
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="face">
                  <TabContent type="face" />
                </TabsContent>
                <TabsContent value="clothes">
                  <TabContent type="clothes" />
                </TabsContent>
                <TabsContent value="background">
                  <TabContent type="background" />
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-[#9370DB] hover:bg-[#7B68EE] text-white px-6 md:px-8 py-2 text-base md:text-lg font-medium w-full md:w-auto"
                onClick={handleGenerate}
                disabled={!selectedFace || isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Wand2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Generate</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
