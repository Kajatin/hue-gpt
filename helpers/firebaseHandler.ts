import { getApp, initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Image } from "../app/Canvas";

function createFirebaseApp() {
  try {
    return getApp();
  } catch {
    return initializeApp(
      JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}")
    );
  }
}

// Initialize Firebase
const app = createFirebaseApp();

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Authentication and get a reference to the service
const auth = getAuth(app);

export async function getImages() {
  try {
    // Get all documents from "images"
    const querySnapshot = await getDocs(collection(db, "images"));

    const firebaseImages = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    // Sort firebaseImages by timestamp
    firebaseImages.sort((a: any, b: any) => {
      return b.timestamp - a.timestamp;
    });

    return firebaseImages;
  } catch (error) {
    console.error(error);
  }

  return [];
}

export async function deleteImage(id: string) {
  try {
    // Delete the image from Firebase Storage
    const imageRef = ref(storage, `images/${id}.png`);
    await deleteObject(imageRef);

    // Delete document from collection "images"
    const docRef = doc(db, "images", id as string);
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error(error);
  }

  return false;
}

export async function handleNewImage(
  data: string,
  colors: string[],
  prompt: string
) {
  try {
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

    return entry as Image | null;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export default app;
export { storage, db, auth };
