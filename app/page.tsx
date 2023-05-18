"use client";

import { useState } from "react";

import Canvas, { Image } from "./Canvas";
import LoadingDots from "./LoadingDots";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [selected, setSelected] = useState<Image | null>(null);

  return (
    <main className="flex flex-col gap-8 justify-center">
      <div className="flex flex-col w-full gap-8 bg-fuchsia-300 bg-opacity-5 py-10 shadow transition-all">
        <input
          className="mx-20 mt-2 rounded-full text-center p-4 text-xs sm:text-sm md:text-xl bg-zinc-700 bg-opacity-40 focus:bg-opacity-60 font-medium shadow-md outline-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Sunset over the ocean, watercolor painting"
        />

        <button
          className="border opacity-60 hover:opacity-90 transition-all rounded-xl px-16 h-12 text-sm font-medium w-fit self-center cursor-pointer"
          disabled={generating || !prompt}
          onClick={async () => {
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
              res.json().then((data) => {
                setImages([data, ...images]);
              })
            );

            setGenerating(false);
          }}
        >
          <div className="flex flex-row gap-2 content-center justify-center">
            {generating ? (
              <LoadingDots />
            ) : (
              <>
                <span className="material-symbols-outlined">
                  temp_preferences_custom
                </span>
                <span className="self-center text-lg font-medium">
                  Generate
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      <div className="flex flex-row gap-2 overflow-scroll p-3">
        <Canvas
          images={images}
          setImages={setImages}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </main>
  );
}
