import { NextApiRequest, NextApiResponse } from "next";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { storage, db } from "../../../../helpers/firebaseHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Prompt is required" });
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // Delete the image from Firebase Storage
    const imageRef = ref(storage, `images/${id}.png`);
    await deleteObject(imageRef);

    // Delete document from collection "images"
    const docRef = doc(db, "images", id as string);
    await deleteDoc(docRef);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }

  return res.status(500).json({ error: "An error occurred" });
}
