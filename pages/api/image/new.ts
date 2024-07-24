import sharp from "sharp";
import kmeans from "node-kmeans";
import openai from "../../../helpers/openaiHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { luminance, rgbToHex } from "@/helpers/colorConversion";

async function dominantColors(
  buffer: Buffer,
  count: number = 5
): Promise<number[][]> {
  // Convert image data to raw pixel data
  const rawPixelData = await sharp(buffer).ensureAlpha().raw().toBuffer();

  // Convert pixel data to an array of [R, G, B] arrays
  const data: number[][] = [];
  for (let i = 0; i < rawPixelData.length; i += 4) {
    data.push([rawPixelData[i], rawPixelData[i + 1], rawPixelData[i + 2]]);
  }

  return new Promise((resolve, reject) => {
    // Perform k-means clustering
    kmeans.clusterize(data, { k: count }, (err: any, res: any[]) => {
      if (err) {
        reject(err);
      } else {
        // Extract the centroid (dominant color) from each cluster
        const dominantColors: number[][] = res.map(
          (cluster) => cluster.centroid
        );
        resolve(dominantColors);
      }
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const completion = await openai.images.generate({
      prompt: prompt,
      model: "dall-e-3",
      n: 1,
      size: "1024x1024",
      style: "vivid",
      response_format: "b64_json",
    });

    const data = completion.data[0].b64_json;
    if (!data) {
      return res.status(500).json({ error: "No data returned" });
    }

    const binaryImage = Buffer.from(data, "base64");

    // Get the dominant colors of the image
    const colors = await dominantColors(binaryImage, 5).then((colors) => {
      const sortedColors = colors.sort((a, b) => {
        return luminance(b) - luminance(a);
      });
      return sortedColors.map((color) => rgbToHex(color));
    });

    return res.status(200).json({ data: data, colors: colors });
  } catch (error) {
    console.error(error);
  }

  return res.status(500).json({ error: "An error occurred" });
}
