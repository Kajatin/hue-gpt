"use client";

import { useEffect } from "react";

import { hexToRgb, isLight, cieToHex } from "@/helpers/colorConversion";

export type Bulb = {
  id: string;
  on: boolean;
  icon: string;
  name: string;
  archetype: string;
  color: string;
};

export default function Bulbs(props: {
  bulbs: Bulb[];
  setBulbs: any;
  selectedBulbs: Bulb[];
  setSelectedBulbs: (bulbs: Bulb[]) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
}) {
  const {
    bulbs,
    setBulbs,
    selectedBulbs,
    setSelectedBulbs,
    brightness,
    setBrightness,
  } = props;

  async function shuffleSelectedBulbs() {
    const shuffledBulbs = [...selectedBulbs];
    for (let i = shuffledBulbs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledBulbs[i], shuffledBulbs[j]] = [
        shuffledBulbs[j],
        shuffledBulbs[i],
      ];
    }
    setSelectedBulbs(shuffledBulbs);
  }

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

  async function turnLightsOnOff(on: boolean) {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    for (let index = 0; index < selectedBulbs.length; index++) {
      const bulb = selectedBulbs[index];

      await fetch(`/api/light/${bulb.id}/on`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ on }),
      });

      // Delay the next request
      await delay(100);
    }

    const bulbs = selectedBulbs.map((bulb) => {
      return {
        ...bulb,
        on,
      };
    });

    setSelectedBulbs([]);

    setBulbs((prevBulbs: Bulb[]) => {
      const newBulbs = [...prevBulbs];
      bulbs.forEach((bulb) => {
        const bulbIndex = newBulbs.findIndex((b) => b.id === bulb.id);
        newBulbs[bulbIndex] = bulb;
      });
      return newBulbs;
    });
  }

  return (
    <div className="flex flex-col gap-3 px-3 md:px-10 pt-3 pb-4 mt-1 sticky top-0 z-10 bg-[#202124] bg-opacity-80 backdrop-blur">
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

              <div className="whitespace-nowrap text-sm">
                {bulb.name.toLocaleLowerCase()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-row gap-2 self-end items-baseline">
        <div className="flex flex-row gap-[0.4rem] items-center place-self-center mr-3 mt-[0.2rem]">
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs opacity-60 self-end">{brightness}%</span>
        </div>

        <div>
          {selectedBulbs.length >= 0 ? (
            <span className="text-sm opacity-60 mr-3">
              {selectedBulbs.length} selected
            </span>
          ) : null}
        </div>

        <button
          className="hover:underline"
          onClick={async () => {
            await shuffleSelectedBulbs();
          }}
        >
          Shuffle
        </button>

        <div className="w-0.5 h-5 bg-white rounded-full opacity-50 self-center"></div>

        <button
          className="hover:underline"
          onClick={() => setSelectedBulbs([])}
        >
          Clear all
        </button>

        <div className="w-0.5 h-5 bg-white rounded-full opacity-50 self-center"></div>

        <button
          className="hover:underline"
          onClick={() => turnLightsOnOff(false)}
        >
          Turn off
        </button>
      </div>
    </div>
  );
}
