"use client";

import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/helpers/firebaseHandler";

import Bulbs, { Bulb } from "./Bulbs";
import Canvas, { Image } from "./Canvas";
import ImageGenerator from "./ImageGenerator";
import Login from "./Login";

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [bulbs, setBulbs] = useState<Bulb[]>([]);
  const [selectedBulbs, setSelectedBulbs] = useState<Bulb[]>([]);
  const [brightness, setBrightness] = useState(75);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  if (!user) {
    return (
      <main className="flex justify-center items-center w-screen h-screen">
        <Login />
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 justify-center">
      <div className="absolute top-0 right-0 p-2 opacity-30 hover:opacity-60 transition-all">
        <button
          onClick={async () => {
            await signOut(auth);
          }}
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>

      <ImageGenerator
        images={images}
        setImages={setImages}
        selectedImage={selectedImage}
      />

      <Bulbs
        bulbs={bulbs}
        setBulbs={setBulbs}
        selectedBulbs={selectedBulbs}
        setSelectedBulbs={setSelectedBulbs}
        brightness={brightness}
        setBrightness={setBrightness}
      />

      <Canvas
        images={images}
        setImages={setImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        selectedBulbs={selectedBulbs}
        setBulbs={setBulbs}
        brightness={brightness}
      />
    </main>
  );
}
