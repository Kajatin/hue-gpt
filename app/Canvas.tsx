"use client";

import { useEffect, useState } from "react";

import Masonry from "react-masonry-css";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { hexToCie } from "@/helpers/colorConversion";
import LoadingDots from "./LoadingDots";
import { Bulb } from "./Bulbs";
import { deleteImage, getImages } from "@/helpers/firebaseHandler";

export type Image = {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  colors: string[];
};

const DominantColors = (props: {
  image: Image;
  setImages: (images: (prevImages: Image[]) => Image[]) => void;
}) => {
  const { image, setImages } = props;
  const [colors, setColors] = useState(image.colors);

  const handleColorChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const newColors = [...colors];
      newColors[index] = event.target.value;
      setColors(newColors);
      setImages((prevImages) =>
        prevImages.map((prevImage) =>
          prevImage.id === image.id
            ? { ...prevImage, colors: newColors }
            : prevImage
        )
      );
    };

  return (
    <div className="flex flex-row gap-2">
      {colors.map((color, index) => (
        <input
          key={index}
          type="color"
          value={color}
          className="cursor-pointer rounded-lg w-8 h-6 hover:scale-105"
          style={{ backgroundColor: color }}
          onChange={handleColorChange(index)}
        />
      ))}
    </div>
  );
};

export default function Canvas(props: {
  uid: string;
  images: Image[];
  setImages: any;
  selectedImage: Image | null;
  setSelectedImage: (image: Image | null) => void;
  selectedBulbs: Bulb[];
  setBulbs: (bulbs: (prevBulbs: Bulb[]) => Bulb[]) => void;
  brightness: number;
}) {
  const { uid, images, setImages, selectedImage, setSelectedImage, selectedBulbs, setBulbs, brightness } = props;

  const [generating, setGenerating] = useState(false);

  async function Paint() {
    if (!selectedBulbs || !selectedImage) {
      return;
    }

    setGenerating(true);

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let index = 0; index < selectedBulbs.length; index++) {
      const bulb = selectedBulbs[index];
      const color = selectedImage.colors[index % selectedImage.colors.length];
      const cie = hexToCie(color);

      await fetch(`/api/light/${bulb.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brightness: brightness,
          x: cie[0],
          y: cie[1],
        }),
      }).then((res) =>
        res.json().then(async (data) => {
          setBulbs((prevBulbs: Bulb[]) => {
            const newBulbs = [...prevBulbs];
            const bulbIndex = newBulbs.findIndex((b) => b.id === bulb.id);
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
  }

  useEffect(() => {
    const get = async () => {
      const newImages = await getImages(uid);
      setImages(newImages);
    };
    get();
  }, []);

  useEffect(() => {
    Paint();
  }, [selectedImage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      Paint();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [selectedBulbs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      Paint();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [brightness]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     Paint();
  //   }, 500);
  //   return () => clearTimeout(timeout);
  // }, [selectedBulbs]);

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
        {images.length > 0 &&
          images.map((image: Image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={
                  "my-masonry-grid_item flex flex-col bg-zinc-700 bg-opacity-40 gap-3 pb-2 shadow-md rounded-2xl cursor-pointer overflow-hidden hover:shadow-lg " +
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

                {generating && selectedImage?.id === image.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-1/3 left-1/2"
                  >
                    <div className="transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-3 rounded-xl backdrop-blur-md bg-opacity-60">
                      <LoadingDots />
                    </div>
                  </motion.div>
                )}

                <div
                  className="px-3 cursor-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DominantColors image={image} setImages={setImages} />
                </div>

                <div className="px-3 mb-[-0.6em] opacity-60 font-light">
                  {moment(image.timestamp).format("LL")}
                </div>

                <div className="px-3">{image.prompt}</div>

                {selectedImage?.id === image.id && (
                  <motion.button
                    initial={{ height: 0, scale: 0.9 }}
                    animate={{ height: "auto", scale: 1 }}
                    exit={{ height: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="px-3 opacity-50 hover:opacity-100 mb-1"
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

                      const deleted = await deleteImage(uid, image.id);
                      if (deleted) {
                        setSelectedImage(null);
                        setImages(images.filter((i) => i.id !== image.id));
                      }
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
