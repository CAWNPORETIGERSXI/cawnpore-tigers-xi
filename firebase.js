import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqCbGl1R2JIcCVDKltft1jK06xW7AEMcY",
  authDomain: "cawnpore-tigers-xi.firebaseapp.com",
  projectId: "cawnpore-tigers-xi",
  storageBucket: "cawnpore-tigers-xi.firebasestorage.app",
  messagingSenderId: "46209940725",
  appId: "1:46209940725:web:5d0a4c0628de02fbc819bc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };