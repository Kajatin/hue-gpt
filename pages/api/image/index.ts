import { Image } from "@app/Canvas";
import { db } from "../../../helpers/firebaseHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // Get all documents from "images"
    const querySnapshot = await getDocs(collection(db, "images"));

    const images = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    // Sort images by timestamp
    images.sort((a: Image, b: Image) => {
      return b.timestamp - a.timestamp;
    });

    return res.status(200).json(images);
  } catch (error) {
    console.error(error);
  }

  return res.status(500).json({ error: "An error occurred" });
}
