import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDaIfBrrVhqrJKJkEGse63Bs7T8Z6ntci8",
  // apiKey: "AIzaSyBp4VgFFPcgSaynZKnu1wFlG3x-tCIUxQc",
  authDomain: "test-ca754.firebaseapp.com",
  // authDomain: "dropagenthub-1b18e.firebaseapp.com",
  projectId: "test-ca754",
  // projectId: "dropagenthub-1b18e",
  storageBucket: "test-ca754.appspot.com",
  // storageBucket: "dropagenthub-1b18e.appspot.com",
  messagingSenderId: "836463618980",
  // messagingSenderId: "1077752913241",
  appId: "1:836463618980:web:6e061927b4f78493732f31",
  // appId: "1:1077752913241:web:aa5176c2d9ffce32aa4048",
  measurementId: "G-KJ45XBFEZK",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
