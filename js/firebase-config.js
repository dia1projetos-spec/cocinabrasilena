// =============================================
// FIREBASE CONFIGURATION
// Substitua com suas credenciais do Firebase
// =============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBfxMRk_UdCBZkg60omMZnh1WZH5FJ04FI",
  authDomain:        "cocina-brasilena.firebaseapp.com",
  projectId:         "cocina-brasilena",
  storageBucket:     "cocina-brasilena.firebasestorage.app",
  messagingSenderId: "807151796377",
  appId:             "1:807151796377:web:695aefc66e558952683808"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// =============================================
// CLOUDINARY CONFIGURATION
// =============================================
export const CLOUDINARY_CONFIG = {
  cloudName: "SEU_CLOUD_NAME",
  uploadPreset: "SEU_UPLOAD_PRESET" // unsigned preset
};
