"use client";

import { useEffect } from "react";

import Masonry from "react-masonry-css";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";

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
}) {
  const { images, setImages, selectedImage, setSelectedImage } = props;

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
            </div>
          </motion.div>
        ))}
      </Masonry>
    </AnimatePresence>
  );
}
