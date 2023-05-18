"use client";

import { useState, useEffect } from "react";

import { Image } from "./Canvas";
import {
  hexToCie,
  hexToRgb,
  isLight,
  cieToHex,
} from "@/helpers/colorConversion";
import LoadingDots from "./LoadingDots";

export type Bulb = {
  id: string;
  on: boolean;
  icon: string;
  name: string;
  archetype: string;
  color: string;
};

export default function Bulbs(props: {
  selectedImage: Image | null;
  selectedBulbs: Bulb[];
  setSelectedBulbs: (bulbs: Bulb[]) => void;
}) {
  const { selectedImage, selectedBulbs, setSelectedBulbs } = props;

  const [bulbs, setBulbs] = useState<Bulb[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const getBulbs = async () => {
      await fetch("/api/light").then((res) =>
        res.json().then((data) => {
          const bulbs = data.map((bulb: any) => {
            const bulbColor = bulb.color?.xy
              ? cieToHex([bulb.color.xy.x, bulb.color.xy.y])
              : "#52525b";

            return {
              id: bulb.id,
              on: bulb.on.on,
              icon: "lightbulb",
              name: bulb.metadata.name,
              archetype: bulb.metadata.archetype,
              color: bulbColor,
            };
          });

          bulbs.sort((a: Bulb, b: Bulb) => {
            if (a.archetype < b.archetype) {
              return -1;
            }
            if (a.archetype > b.archetype) {
              return 1;
            }
            return 0;
          });

          setBulbs(bulbs);
        })
      );
    };
    getBulbs();
  }, []);

  return (
    <div className="flex flex-col gap-6 px-3 md:px-10 py-3">
      <div className="flex flex-row gap-3 px-2 h-fit overflow-x-scroll no-scrollbar">
        {bulbs.map((bulb: Bulb) => {
          const isBgLight = bulb.on ? isLight(hexToRgb(bulb.color)) : false;

          return (
            <div
              key={bulb.id}
              className={
                "flex flex-row gap-1 items-center pl-3 pr-4 py-2 rounded-full bg-zinc-700 bg-opacity-40 hover:scale-105 transition-all cursor-pointer " +
                (selectedBulbs.length > 0
                  ? selectedBulbs.includes(bulb)
                    ? "scale-105"
                    : "opacity-60 scale-95"
                  : "opacity-95 hover:opacity-100") +
                (isBgLight ? " text-[#202124]" : " text-[#e1e1e1]")
              }
              style={{
                backgroundColor: bulb.on ? bulb.color : "",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (selectedBulbs.includes(bulb)) {
                  setSelectedBulbs(selectedBulbs.filter((b) => b !== bulb));
                } else {
                  setSelectedBulbs([...selectedBulbs, bulb]);
                }
              }}
            >
              <div
                className={
                  "material-symbols-outlined rounded w-fit p-0.5 border border-opacity-0 hover:border-opacity-100 transition-all " +
                  (isBgLight ? " border-[#202124]" : " border-[#e1e1e1]")
                }
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // turn the light on/off
                  await fetch(`/api/light/${bulb.id}/on`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      on: !bulb.on,
                    }),
                  }).then((res) => {
                    if (!res.ok) {
                      return;
                    }

                    setBulbs(
                      bulbs.map((b) => {
                        if (b.id === bulb.id) {
                          return {
                            ...b,
                            on: !b.on,
                          };
                        }
                        return b;
                      })
                    );
                  });
                }}
              >
                {bulb.icon}
              </div>

              <div className="whitespace-nowrap">
                {bulb.name.toLocaleLowerCase()}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="border opacity-60 hover:opacity-90 transition-all rounded-xl px-16 h-12 text-sm font-medium w-fit self-center cursor-pointer"
        disabled={!selectedBulbs}
        onClick={async () => {
          if (!selectedBulbs || !selectedImage) {
            return;
          }

          setGenerating(true);

          const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

          for (let index = 0; index < selectedBulbs.length; index++) {
            const bulb = selectedBulbs[index];
            const color =
              selectedImage.colors[index % selectedImage.colors.length];
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
                setBulbs((prevBulbs) => {
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
              <span className="self-center text-lg font-medium">Apply</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
