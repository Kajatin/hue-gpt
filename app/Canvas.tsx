"use client";

import { useEffect, useState } from "react";

import Masonry from "react-masonry-css";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { hexToCie } from "@/helpers/colorConversion";
import LoadingDots from "./LoadingDots";
import { Bulb } from "./Bulbs";

export type Image = {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  colors: string[];
};

const DominantColors = (props: { colors: string[] }) => {
  const { colors } = props;

  return (
    <div className="flex flex-row gap-2">
      {colors.map((color, index) => (
        <div
          key={index}
          className="rounded-lg w-8 h-6"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default function Canvas(props: {
  images: Image[];
  setImages: (images: Image[]) => void;
  selectedImage: Image | null;
  setSelectedImage: (image: Image | null) => void;
  selectedBulbs: Bulb[];
  setBulbs: (bulbs: (prevBulbs: Bulb[]) => Bulb[]) => void;
}) {
  const {
    images,
    setImages,
    selectedImage,
    setSelectedImage,
    selectedBulbs,
    setBulbs,
  } = props;

  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      await fetch("/api/image").then((res) =>
        res.json().then((data) => {
          setImages(data);
        })
      );
    };
    getImages();
  }, []);

  return (
    <AnimatePresence>
      <Masonry
        breakpointCols={{
          default: 4,
          1100: 3,
          700: 2,
        }}
        className="my-masonry-grid px-3 md:px-10 py-3"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((image: Image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={
                "my-masonry-grid_item flex flex-col bg-zinc-700 bg-opacity-40 gap-3 pb-2 shadow-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg " +
                (selectedImage
                  ? selectedImage?.id === image.id
                    ? "scale-105"
                    : "opacity-60 scale-95"
                  : "opacity-95 hover:opacity-100")
              }
              onClick={() => {
                if (selectedImage?.id === image.id) {
                  setSelectedImage(null);
                } else {
                  setSelectedImage(image);
                }
              }}
            >
              <img className="rounded-xl" src={image.url} />

              <div className="px-3">
                <DominantColors colors={image.colors} />
              </div>

              <div className="px-3 mb-[-0.6em] opacity-60 font-light">
                {moment(image.timestamp).format("LL")}
              </div>

              <div className="px-3">{image.prompt}</div>

              {selectedImage?.id === image.id && (
                <motion.div
                  initial={{ height: 0, scale: 0.9 }}
                  animate={{ height: "auto", scale: 1 }}
                  exit={{ height: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 mt-1"
                >
                  <button
                    className="border opacity-60 hover:opacity-90 transition-all rounded-xl px-10 h-10 text-sm font-medium w-full self-center cursor-pointer"
                    disabled={!selectedBulbs}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (!selectedBulbs || !selectedImage) {
                        return;
                      }

                      setGenerating(true);

                      const delay = (ms: number) =>
                        new Promise((resolve) => setTimeout(resolve, ms));

                      for (
                        let index = 0;
                        index < selectedBulbs.length;
                        index++
                      ) {
                        const bulb = selectedBulbs[index];
                        const color =
                          selectedImage.colors[
                            index % selectedImage.colors.length
                          ];
                        const cie = hexToCie(color);

                        await fetch(`/api/light/${bulb.id}`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            brightness: 100,
                            x: cie[0],
                            y: cie[1],
                          }),
                        }).then((res) =>
                          res.json().then(async (data) => {
                            setBulbs((prevBulbs: Bulb[]) => {
                              const newBulbs = [...prevBulbs];
                              const bulbIndex = newBulbs.findIndex(
                                (b) => b.id === bulb.id
                              );
                              newBulbs[bulbIndex].on = true;
                              newBulbs[bulbIndex].color = color;
                              return newBulbs;
                            });
                          })
                        );

                        // Delay the next request
                        await delay(100);
                      }

                      setGenerating(false);
                    }}
                  >
                    <div className="flex flex-row gap-1 content-center justify-center">
                      {generating ? (
                        <LoadingDots />
                      ) : (
                        <>
                          <span className="material-symbols-outlined">
                            format_paint
                          </span>
                          <span className="self-center text-lg font-medium">
                            Paint
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                </motion.div>
              )}

              {selectedImage?.id === image.id && (
                <motion.button
                  initial={{ height: 0, scale: 0.9 }}
                  animate={{ height: "auto", scale: 1 }}
                  exit={{ height: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 opacity-50 hover:opacity-100"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (
                      !confirm(
                        "Are you sure you want to delete this image? This action cannot be undone."
                      )
                    ) {
                      return;
                    }

                    await fetch(`/api/image/${image.id}`, {
                      method: "DELETE",
                    }).then((res) => {
                      if (res.ok) {
                        setSelectedImage(null);
                        setImages(images.filter((i) => i.id !== image.id));
                      }
                    });
                  }}
                >
                  Delete
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </Masonry>
    </AnimatePresence>
  );
}
