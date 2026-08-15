import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { supabase } from "./supabase.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzC-okomVG-pe08RH-JPp0s6ng1BBGIEE",
  authDomain: "a-one-chat-e3642.firebaseapp.com",
  projectId: "a-one-chat-e3642",
  storageBucket: "a-one-chat-e3642.firebasestorage.app",
  messagingSenderId: "91366490582",
  appId: "1:91366490582:web:669e8a9bfc54f424a82477"
};
const auth = getAuth(initializeApp(firebaseConfig));
let allProducts = [], activeCategory = "All";

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";
  await loadProducts();
});

document.querySelector("#logout").onclick = () => signOut(auth);

async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", {ascending:false});
  if (error) {
    document.querySelector("#status").textContent = "Products load ചെയ്യാൻ കഴിഞ്ഞില്ല. Supabase table/RLS പരിശോധിക്കുക.";
    console.error(error); return;
  }
  allProducts = data || [];
  renderCategories();
  render();
}

function renderCategories() {
  const cats = ["All", ...new Set(allProducts.map(p => p.category).filter(Boolean))];
  document.querySelector("#categories").innerHTML = cats.map(c =>
    `<button class="chip ${c===activeCategory?"selected":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  document.querySelectorAll(".chip").forEach(b => b.onclick = () => { activeCategory=b.dataset.cat; renderCategories(); render(); });
}

document.querySelector("#search").addEventListener("input", render);

function render() {
  const q = document.querySelector("#search").value.toLowerCase();
  const items = allProducts.filter(p =>
    (activeCategory==="All" || p.category===activeCategory) &&
    (`${p.name} ${p.category}`.toLowerCase().includes(q))
  );
  document.querySelector("#products").innerHTML = items.length ? items.map(p => `
    <article class="product card">
      <img src="${esc(p.image_url)}" alt="" loading="lazy" onerror="this.src='https://placehold.co/600x500?text=No+Image'">
      <div class="product-body">
        <span class="badge">${esc(p.category || "Other")}</span>
        <h3>${esc(p.name)}</h3>
        <strong class="price">₹${esc(String(p.price ?? ""))}</strong>
        <a class="primary btn" href="${safeUrl(p.product_url)}" target="_blank" rel="noopener noreferrer">View Product</a>
      </div>
    </article>`).join("") : `<p class="muted center">No products found.</p>`;
}

function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function safeUrl(v=""){try{const u=new URL(v); return ["http:","https:"].includes(u.protocol)?esc(u.href):"#"}catch{return "#"}}
