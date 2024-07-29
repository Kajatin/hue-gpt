"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/helpers/firebaseHandler";

import Bulbs, { Bulb } from "./Bulbs";
import Canvas, { Image as ImageT } from "./Canvas";
import ImageGenerator from "./ImageGenerator";
import Login from "./Login";

function Header() {
  return (
    <>
      <div className="absolute top-0 left-0 p-2 opacity-90 hover:scale-110 ">
        <Image src="/light-bulb.png" width={40} height={40} alt={""} />
      </div>

      <div className="absolute top-0 right-0 p-3 opacity-30 hover:opacity-60 transition-all">
        <button
          onClick={async () => {
            await signOut(auth);
          }}
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </>
  );
}

export default function Home() {
  const [images, setImages] = useState<ImageT[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageT | null>(null);
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
      <Header />

      <ImageGenerator uid={user.uid} images={images} setImages={setImages} selectedImage={selectedImage} />

      <Bulbs bulbs={bulbs} setBulbs={setBulbs} selectedBulbs={selectedBulbs} setSelectedBulbs={setSelectedBulbs} brightness={brightness} setBrightness={setBrightness} />

      <Canvas
        uid={user.uid}
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
