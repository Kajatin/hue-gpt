import { getApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function createFirebaseApp() {
  try {
    return getApp();
  } catch {
    return initializeApp(
      JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}")
    );
  }
}

const app = createFirebaseApp();
// Initialize Firebase

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

export default app;
export { storage, db, auth };
