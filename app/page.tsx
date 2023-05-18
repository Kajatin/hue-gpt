"use client";

import { useState } from "react";

import Bulbs, { Bulb } from "./Bulbs";
import Canvas, { Image } from "./Canvas";
import ImageGenerator from "./ImageGenerator";

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedBulbs, setSelectedBulbs] = useState<Bulb[]>([]);

  return (
    <main className="flex flex-col gap-8 justify-center">
      <Bulbs
        selectedImage={selectedImage}
        selectedBulbs={selectedBulbs}
        setSelectedBulbs={setSelectedBulbs}
      />

      <ImageGenerator images={images} setImages={setImages} />

      <Canvas
        images={images}
        setImages={setImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </main>
  );
}
