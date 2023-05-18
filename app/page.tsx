"use client";

import { useState } from "react";

import Bulbs, { Bulb } from "./Bulbs";
import Canvas, { Image } from "./Canvas";
import ImageGenerator from "./ImageGenerator";

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [bulbs, setBulbs] = useState<Bulb[]>([]);
  const [selectedBulbs, setSelectedBulbs] = useState<Bulb[]>([]);

  return (
    <main className="flex flex-col gap-6 justify-center">
      <ImageGenerator images={images} setImages={setImages} />

      <Bulbs
        bulbs={bulbs}
        setBulbs={setBulbs}
        selectedBulbs={selectedBulbs}
        setSelectedBulbs={setSelectedBulbs}
      />

      <Canvas
        images={images}
        setImages={setImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        selectedBulbs={selectedBulbs}
        setBulbs={setBulbs}
      />
    </main>
  );
}
