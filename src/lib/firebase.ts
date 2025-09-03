
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCzALpUYx4X7xXrX1OXy-NRVDtdA_b16Q8",
  authDomain: "surebet-d7d10.firebaseapp.com",
  projectId: "surebet-d7d10",
  storageBucket: "surebet-d7d10.appspot.com",
  messagingSenderId: "590360869636",
  appId: "1:590360869636:web:fc8eeb556c6052d4926e51",
  measurementId: "G-B2FG7XDY03"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

export { app, auth };
