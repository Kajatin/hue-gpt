"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/helpers/firebaseHandler";

import Bulbs, { Bulb } from "./Bulbs";
import Canvas, { Image as ImageT } from "./Canvas";
import ImageGenerator from "./ImageGenerator";
import Login from "./Login";

function Header(props: { setShowHueConfigModal: (showHueConfigModal: boolean) => void }) {
  const { setShowHueConfigModal } = props;

  return (
    <>
      <div className="absolute top-0 left-0 p-2 opacity-90 hover:scale-110 ">
        <Image src="/light-bulb.png" width={40} height={40} alt={""} />
      </div>

      <div className="absolute flex flex-row gap-3 top-0 right-0 p-3">
        <button
          className="opacity-30 hover:opacity-60 transition-all"
          onClick={async () => {
            setShowHueConfigModal(true);
          }}
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        <button
          className="opacity-30 hover:opacity-60 transition-all"
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

function HueConfigModal(props: { setShowHueConfigModal: (showHueConfigModal: boolean) => void }) {
  const { setShowHueConfigModal } = props;

  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const hueBaseUrl = cookies.find((cookie) => cookie.startsWith("hue-gpt.base-url="));
    const hueApiKey = cookies.find((cookie) => cookie.startsWith("hue-gpt.api-key="));

    if (hueBaseUrl) {
      setBaseUrl(hueBaseUrl.split("=")[1]);
    }

    if (hueApiKey) {
      setApiKey(hueApiKey.split("=")[1]);
    }
  }, []);

  return (
    <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-50 backdrop-blur flex justify-center items-center">
      <div className="bg-[#202124] p-6 rounded-xl shadow-lg max-w-xl">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Hue Configuration</h1>

          <button className="opacity-30 hover:opacity-60 transition-all" onClick={() => setShowHueConfigModal(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <p className="opacity-70">
            Configure your Hue Bridge connection details to get access to your lights. You&apos;ll need to generate an API key for your Hue Bridge by following{" "}
            <a className="text-fuchsia-300/70" href="https://developers.meethue.com/develop/hue-api-v2/getting-started/" target="_blank" rel="noreferrer">
              these instructions
            </a>
            .
          </p>

          <form className="flex flex-col gap-2">
            <label htmlFor="baseUrl" className="block">
              Base URL:
            </label>
            <input
              id="baseUrl"
              type="text"
              name="baseUrl"
              className="block rounded-lg px-3 py-2 bg-zinc-700 outline-none"
              value={baseUrl}
              placeholder="https://192.169.1.102"
              onChange={(event) => setBaseUrl(event.target.value)}
            />

            <label htmlFor="apiKey" className="block mt-1">
              API Key:
            </label>
            <input
              id="apiKey"
              type="text"
              name="apiKey"
              className="block rounded-lg px-3 py-2 bg-zinc-700 outline-none"
              value={apiKey}
              placeholder="············"
              onChange={(event) => setApiKey(event.target.value)}
            />

            <button
              className="bg-fuchsia-900 hover:bg-opacity-80 bg-opacity-50 text-white w-full py-2 rounded-lg mt-4"
              onClick={(event: any) => {
                event.preventDefault();
                setShowHueConfigModal(false);

                // Save the configuration to cookies
                document.cookie = `hue-gpt.base-url=${baseUrl}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
                document.cookie = `hue-gpt.api-key=${apiKey}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
              }}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [images, setImages] = useState<ImageT[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageT | null>(null);
  const [bulbs, setBulbs] = useState<Bulb[]>([]);
  const [selectedBulbs, setSelectedBulbs] = useState<Bulb[]>([]);
  const [brightness, setBrightness] = useState(75);
  const [user, setUser] = useState<any>(null);
  const [showHueConfigModal, setShowHueConfigModal] = useState(false);

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
      {showHueConfigModal && <HueConfigModal setShowHueConfigModal={setShowHueConfigModal} />}

      <Header setShowHueConfigModal={setShowHueConfigModal} />

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
