import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdYoHrYI9zQdxhQOdaVT7o1lIQg8SRwAg",
  authDomain: "attendance-2980e.firebaseapp.com",
  projectId: "attendance-2980e",
  storageBucket: "attendance-2980e.appspot.com",
  messagingSenderId: "545038671009",
  appId: "1:545038671009:web:05cd8f1490cf7d624164e0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
