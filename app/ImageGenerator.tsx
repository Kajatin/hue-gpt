"use client";

import { useEffect, useState } from "react";

import { Image } from "./Canvas";
import LoadingDots from "./LoadingDots";
import { hexToRgbA } from "@/helpers/colorConversion";
import { handleNewImage } from "@/helpers/firebaseHandler";

export default function ImageGenerator(props: {
  images: Image[];
  setImages: (images: Image[]) => void;
  selectedImage: Image | null;
}) {
  const { images, setImages, selectedImage } = props;

  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  async function generateImage() {
    if (generating || !prompt) {
      return;
    }

    setGenerating(true);

    await fetch("/api/image/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    }).then((res) =>
      res.json().then(async (response) => {
        const { data, colors } = response;
        const newImage = await handleNewImage(data, colors, prompt);
        if (!newImage) {
          return;
        }

        setImages([newImage, ...images]);
      })
    );

    setPrompt("");
    setGenerating(false);
  }

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        generateImage();
      }
    };

    window.addEventListener("keydown", handleEnter);

    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, [prompt]);

  return (
    <div
      className="flex flex-col w-full gap-8 py-14 shadow transition-all"
      style={{
        background: selectedImage?.colors[2]
          ? hexToRgbA(selectedImage?.colors[2], 0.05)
          : hexToRgbA("#f0abfc", 0.05),
      }}
    >
      <input
        className="mx-3 md:mx-20 mt-2 rounded-full text-center p-4 md:text-xl bg-zinc-700 bg-opacity-40 focus:bg-opacity-60 font-medium shadow-md outline-none scale-95 hover:scale-100 focus:scale-100 transition-all "
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Sunset over the ocean, watercolor painting"
      />

      <button
        className="border opacity-60 hover:opacity-90 transition-all rounded-xl px-16 h-12 text-sm font-medium w-fit self-center cursor-pointer"
        disabled={generating || !prompt}
        onClick={generateImage}
      >
        <div className="flex flex-row gap-2 content-center justify-center">
          {generating ? (
            <LoadingDots />
          ) : (
            <>
              <span className="material-symbols-outlined">
                temp_preferences_custom
              </span>
              <span className="self-center text-lg font-medium">Generate</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
