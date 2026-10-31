const animals = [
  {id:"bruno",name:"Bruno",type:"Dog",age:"Young",ageText:"8 months",gender:"Male",location:"Vasai",image:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85",description:"A cheerful little explorer who loves gentle attention and playtime."},
  {id:"misty",name:"Misty",type:"Cat",age:"Adult",ageText:"2 years",gender:"Female",location:"Virar",image:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85",description:"A calm, curious companion who enjoys sunny spots and quiet cuddles."},
  {id:"cookie",name:"Cookie",type:"Dog",age:"Young",ageText:"5 months",gender:"Female",location:"Nalasopara",image:"https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=85",description:"A sweet and playful pup with a whole lot of love to give."}
];
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const store = {
  get(key, fallback=null){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}},
  set(key,value){localStorage.setItem(key,JSON.stringify(value))}
};
let currentUser = store.get("pawconnect-user");
let authMode = "login";
let toastTimer;
function toast(message){const node=$("#toast");node.textContent=message;node.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),3000)}
function animalCard(animal){return `<article class="animal-card"><div class="animal-photo"><img src="${animal.image}" alt="${escapeHTML(animal.name)}" loading="lazy"><span class="animal-tag">${escapeHTML(animal.type)} · ${escapeHTML(animal.gender)}</span></div><div class="animal-info"><div class="animal-title"><h3>${escapeHTML(animal.name)}</h3><span>${escapeHTML(animal.ageText)}</span></div><div class="animal-meta">⌖ ${escapeHTML(animal.location)} &nbsp; · &nbsp; ${escapeHTML(animal.age)}</div><p>${escapeHTML(animal.description)}</p><button class="btn btn-primary" data-interest="${escapeHTML(animal.id)}">Interested in adopting <span>→</span></button></div></article>`}
function renderAnimals(){
  const type=$("#typeFilter")?.value||"all", age=$("#ageFilter")?.value||"all", location=($("#locationFilter")?.value||"").trim().toLowerCase();
  const filtered=animals.filter(a=>(type==="all"||a.type===type)&&(age==="all"||a.age===age)&&(!location||a.location.toLowerCase().includes(location)));
  $("#allAnimals").innerHTML=filtered.map(animalCard).join("")||'<p class="empty-state">No animals match those filters yet. Try clearing a filter.</p>';
  $("#resultCount").textContent=`${filtered.length} lovely ${filtered.length===1?"animal":"animals"}`;
  $("#featuredAnimals").innerHTML=animals.slice(0,3).map(animalCard).join("");
}
function showModal(id){$("#"+id).hidden=false;document.body.style.overflow="hidden"}
function hideModal(id){$("#"+id).hidden=true;document.body.style.overflow=""}
function setAuthMode(mode){authMode=mode;$$("[data-auth]").forEach(b=>b.classList.toggle("active",b.dataset.auth===mode));$("#authNameWrap").hidden=mode==="login";$("#authNameWrap input").required=mode==="signup";$("#authSubmit").innerHTML=(mode==="login"?"Log in":"Create account")+' <span>→</span>'}
function updateProfile(){
  const initial=currentUser?.name?.trim()?.charAt(0)?.toUpperCase()||"♡";
  $("#avatarInitial").textContent=initial;$("#profileAvatar").textContent=initial;
  $("#profileTitle").textContent=currentUser?`Hello, ${currentUser.name}!`:"Hello, friend!";
  $("#profileEmail").textContent=currentUser?.email||"Log in to create a demo profile.";
  $("#loginOpen").textContent=currentUser?"Profile":"Log in";
  $("#profileLoginAction").style.display = currentUser ? "none" : "block";
}
function openProfile(){updateProfile();showModal("profileModal")}
function navigate(hash){
  const id=(hash||"#home").replace("#","");
  const valid=["home","explore","report","care","contact"];
  const target=valid.includes(id)?id:"home";
  $$(".screen").forEach(s=>s.classList.toggle("active",s.id===target));
  $$("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===target));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",event=>{
  const nav=event.target.closest('a[href^="#"]');
  if(nav){const hash=nav.getAttribute("href");if(hash&&hash.length>1){event.preventDefault();history.pushState(null,"",hash);navigate(hash)}}
  const close=event.target.closest("[data-close]");if(close)hideModal(close.dataset.close);
  const interest=event.target.closest("[data-interest]");if(interest){const animal=animals.find(a=>a.id===interest.dataset.interest);$("#interestAnimal").textContent=animal?.name||"this lovely soul";$("#interestForm").elements.animal.value=animal?.name||"";$("#interestForm").elements.name.value=currentUser?.name||"";showModal("interestModal")}
});
window.addEventListener("popstate",()=>navigate(location.hash));
$("#loginOpen").addEventListener("click",()=>currentUser?openProfile():(setAuthMode("login"),showModal("authModal")));
$("#profileOpen").addEventListener("click",openProfile);
$("#mobileProfile").addEventListener("click",openProfile);
$("#profileLoginAction").addEventListener("click",()=>{hideModal("profileModal");setAuthMode("login");showModal("authModal")});
$("#logoutButton").addEventListener("click",()=>{currentUser=null;localStorage.removeItem("pawconnect-user");updateProfile();hideModal("profileModal");toast("You have logged out.")});
$$("[data-auth]").forEach(button=>button.addEventListener("click",()=>setAuthMode(button.dataset.auth)));
$("#authForm").addEventListener("submit",event=>{
  event.preventDefault();const data=new FormData(event.currentTarget);
  const email=String(data.get("email")).trim().toLowerCase(),password=String(data.get("password"));
  if(authMode==="signup"&&!String(data.get("name")).trim()){toast("Please enter your name.");return}
  if(authMode==="signup"){currentUser={name:String(data.get("name")).trim(),email};store.set("pawconnect-user",currentUser);store.set("pawconnect-demo-password",password);toast("Your demo profile is ready!")}
  else{const saved=store.get("pawconnect-user");const savedPass=store.get("pawconnect-demo-password");if(!saved||saved.email!==email||savedPass!==password){toast("No matching local demo profile. Try signing up first.");return}currentUser=saved;toast("Welcome back!")}
  updateProfile();event.currentTarget.reset();hideModal("authModal");
});
["typeFilter","ageFilter","locationFilter"].forEach(id=>$("#"+id).addEventListener("input",renderAnimals));
$("#clearFilters").addEventListener("click",()=>{$("#typeFilter").value="all";$("#ageFilter").value="all";$("#locationFilter").value="";renderAnimals()});
$("#reportPhoto").addEventListener("change",event=>{const file=event.target.files[0];if(!file)return;if(file.size>3*1024*1024){toast("Please choose a photo smaller than 3 MB.");event.target.value="";return}$("#uploadText").textContent=file.name;const preview=$("#photoPreview");preview.src=URL.createObjectURL(file);preview.hidden=false});
function saveForm(key,record){const records=store.get(key,[]);records.push({...record,submittedAt:new Date().toISOString()});store.set(key,records)}
$("#reportForm").addEventListener("submit",event=>{
  event.preventDefault();const form=event.currentTarget;const data=Object.fromEntries(new FormData(form).entries());data.photoName=$("#reportPhoto").files[0]?.name||"";
  saveForm("pawconnect-reports",data);form.reset();$("#photoPreview").hidden=true;$("#uploadText").textContent="Choose a photo from your device";toast("Thank you! Your demo report was saved on this device.");
});
$("#contactForm").addEventListener("submit",event=>{event.preventDefault();saveForm("pawconnect-messages",Object.fromEntries(new FormData(event.currentTarget).entries()));event.currentTarget.reset();toast("Thanks for reaching out! Your demo message was saved on this device.")});
$("#interestForm").addEventListener("submit",event=>{event.preventDefault();saveForm("pawconnect-interests",Object.fromEntries(new FormData(event.currentTarget).entries()));event.currentTarget.reset();hideModal("interestModal");toast("Your demo adoption interest has been saved on this device.")});
["authModal","profileModal","interestModal"].forEach(id=>$("#"+id).addEventListener("click",event=>{if(event.target.id===id)hideModal(id)}));
renderAnimals();updateProfile();navigate(location.hash||"#home");
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(error=>console.log("Service worker unavailable:",error)))}
function renderAdminRecords(key, targetId, emptyMessage) {
  const records = store.get(key, []);
  const container = $("#" + targetId);

  if (!records.length) {
    container.textContent = emptyMessage;
    return;
  }

  container.innerHTML = records.slice().reverse().map(record => {
    const details = Object.entries(record)
      .filter(([key]) => key !== "submittedAt")
      .map(([key, value]) =>
        `<p><strong>${escapeHTML(key)}:</strong> ${escapeHTML(value)}</p>`
      ).join("");

    const date = record.submittedAt
      ? new Date(record.submittedAt).toLocaleString()
      : "";

    return `
      <article style="padding:14px;margin:12px 0;border:1px solid #ddd;border-radius:12px;">
        ${details}
        <small>${escapeHTML(date)}</small>
      </article>
    `;
  }).join("");
}

function openAdmin() {
  renderAdminRecords("pawconnect-reports", "adminReports", "No reports yet.");
  renderAdminRecords("pawconnect-interests", "adminInterests", "No adoption interests yet.");
  renderAdminRecords("pawconnect-messages", "adminMessages", "No messages yet.");
  showModal("adminModal");
}

$("#adminOpen").addEventListener("click", openAdmin);
$("#adminLogout").addEventListener("click", () => {
  hideModal("adminModal");
  $("#adminOpen").style.display = "none";
  $("#adminLoginOpen").style.display = "block";
  toast("You have logged out!");
});
$("#adminLoginOpen").addEventListener("click", () => {
  showModal("adminLoginModal");
});

$("#adminLoginForm").addEventListener("submit", event => {
  event.preventDefault();

  const password = $("#adminPassword").value;

  if (password === "PawPaws123") {
    $("#adminLoginOpen").style.display = "none";
    $("#adminOpen").style.display = "block";
    hideModal("adminLoginModal");
    event.currentTarget.reset();
    toast("Welcome, Admin!");
  } else {
    toast("Incorrect admin password!");
  }
});