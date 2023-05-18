import sharp from "sharp";
import kmeans from "node-kmeans";
import openai from "../../../helpers/openaiHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { storage, db } from "../../../helpers/firebaseHandler";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function rgbToHex(rgb: number[]): string {
  let hex = rgb.map((color) => {
    let hex = Math.round(color).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  });
  return "#" + hex.join("");
}

function luminance(color: number[]): number {
  return 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
}

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
    const completion = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "256x256",
      response_format: "b64_json",
    });

    const data = completion.data.data[0].b64_json;
    if (!data) {
      return res.status(500).json({ error: "No data returned" });
    }

    // Upload the image to Firebase Storage
    const randomImageName = Math.random().toString(36).substring(7);
    const binaryImage = Buffer.from(data, "base64");
    const imageRef = ref(storage, `images/${randomImageName}.png`);
    const url = await uploadBytes(imageRef, binaryImage).then(
      async (snapshot) => {
        // Get the URL of the image
        return await getDownloadURL(imageRef);
      }
    );

    // Get the dominant colors of the image
    const colors = await dominantColors(binaryImage, 5).then((colors) => {
      const sortedColors = colors.sort((a, b) => {
        return luminance(b) - luminance(a);
      });
      return sortedColors.map((color) => rgbToHex(color));
    });

    // Add a new document in collection "images"
    const docRef = doc(db, "images", randomImageName);
    const entry = await setDoc(docRef, {
      url: url,
      prompt: prompt,
      timestamp: Date.now(),
      colors: colors,
    }).then(async () => {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    });

    return res.status(200).json(entry);
  } catch (error) {
    console.error(error);
  }

  return res.status(500).json({ error: "An error occurred" });
}
