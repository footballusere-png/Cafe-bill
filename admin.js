import { supabase } from "./supabase.js";

const ADMIN_PASSWORD = "risham0043"; // NOT secure for production; move auth to server/Edge Function.

const gate = document.querySelector("#gate");
const panel = document.querySelector("#panel");
document.querySelector("#unlock").onclick = () => {
  if (document.querySelector("#adminPass").value === ADMIN_PASSWORD) {
    gate.hidden = true; panel.hidden = false; loadProducts();
  } else document.querySelector("#gateMsg").textContent = "Wrong password.";
};

document.querySelector("#productForm").addEventListener("submit", async e => {
  e.preventDefault();
  const product = {
    name: document.querySelector("#name").value.trim(),
    category: document.querySelector("#category").value.trim(),
    price: Number(document.querySelector("#price").value),
    image_url: document.querySelector("#image_url").value.trim(),
    product_url: document.querySelector("#product_url").value.trim()
  };
  const { error } = await supabase.from("products").insert(product);
  document.querySelector("#formMsg").textContent = error ? error.message : "Product added.";
  if (!error) { e.target.reset(); loadProducts(); }
});

async function loadProducts(){
  const {data,error}=await supabase.from("products").select("*").order("created_at",{ascending:false});
  const el=document.querySelector("#adminList");
  if(error){el.textContent=error.message;return;}
  el.innerHTML=(data||[]).map(p=>`
    <div class="admin-row">
      <div><strong>${esc(p.name)}</strong><small>${esc(p.category)} • ₹${esc(String(p.price))}</small></div>
      <button data-id="${esc(p.id)}" class="danger">Delete</button>
    </div>`).join("") || "<p class='muted'>No products.</p>";
  el.querySelectorAll(".danger").forEach(b=>b.onclick=async()=>{
    if(!confirm("Delete this product?")) return;
    const {error}=await supabase.from("products").delete().eq("id",b.dataset.id);
    if(error) alert(error.message); else loadProducts();
  });
}
function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
