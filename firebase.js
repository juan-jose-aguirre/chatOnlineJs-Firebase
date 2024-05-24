import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9YebfqovaMaTTBh78eB_x1xg4f70xDxE",
  authDomain: "chat-online-6fcae.firebaseapp.com",
  databaseURL: "https://chat-online-6fcae-default-rtdb.firebaseio.com",
  projectId: "chat-online-6fcae",
  storageBucket: "chat-online-6fcae.appspot.com",
  messagingSenderId: "144254847879",
  appId: "1:144254847879:web:1230ca99cb574f926a6122",
};

export const app = initializeApp(firebaseConfig);