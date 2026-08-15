import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzC-okomVG-pe08RH-JPp0s6ng1BBGIEE",
  authDomain: "a-one-chat-e3642.firebaseapp.com",
  projectId: "a-one-chat-e3642",
  storageBucket: "a-one-chat-e3642.firebasestorage.app",
  messagingSenderId: "91366490582",
  appId: "1:91366490582:web:669e8a9bfc54f424a82477"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let mode = "login";

const form = document.querySelector("#authForm");
const msg = document.querySelector("#msg");
const submit = document.querySelector("#submitBtn");

document.querySelector("#loginTab").onclick = () => setMode("login");
document.querySelector("#signupTab").onclick = () => setMode("signup");

function setMode(next) {
  mode = next;
  document.querySelector("#loginTab").classList.toggle("active", mode === "login");
  document.querySelector("#signupTab").classList.toggle("active", mode === "signup");
  submit.textContent = mode === "login" ? "Login" : "Create account";
  msg.textContent = "";
}

onAuthStateChanged(auth, user => {
  if (user) location.href = "home.html";
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  msg.textContent = "Please wait…";
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;
  try {
    if (mode === "login") await signInWithEmailAndPassword(auth, email, password);
    else await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    msg.textContent = err.code?.replace("auth/", "").replaceAll("-", " ") || "Something went wrong";
  }
});
