const menu=document.getElementById('menu'),nav=document.getElementById('nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const form=document.getElementById('form');form?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const msg=`Hello 5G Taxi,\n\nI would like to book a taxi.\n\nName: ${d.get('name')}\nMobile: ${d.get('mobile')}\nPickup: ${d.get('pickup')}\nDrop: ${d.get('drop')}\nDate: ${d.get('date')}\nTime: ${d.get('time')}\nPassengers: ${d.get('passengers')||'Not specified'}\nTrip Type: ${d.get('trip')}\nMessage: ${d.get('message')||'None'}`;window.open('https://wa.me/918148157275?text='+encodeURIComponent(msg),'_blank');});
const date=document.querySelector('input[name="date"]');if(date){const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());date.min=d.toISOString().split('T')[0];}

/* Vehicle selection */
document.querySelectorAll(".vehicle-book").forEach(link => {
  link.addEventListener("click", () => {
    sessionStorage.setItem("selectedVehicle", link.dataset.vehicle || "");
  });
});

/* Login + OTP frontend flow */
const loginModal = document.getElementById("loginModal");
const openLogin = () => { loginModal?.classList.add("open"); loginModal?.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; document.getElementById("loginName")?.focus(); };
const closeLogin = () => { loginModal?.classList.remove("open"); loginModal?.setAttribute("aria-hidden","true"); document.body.style.overflow=""; };
document.getElementById("openLogin")?.addEventListener("click", openLogin);
document.getElementById("openLoginDesktop")?.addEventListener("click", openLogin);
document.getElementById("closeLogin")?.addEventListener("click", closeLogin);
loginModal?.addEventListener("click", e => { if(e.target===loginModal) closeLogin(); });
document.addEventListener("keydown", e => { if(e.key==="Escape") closeLogin(); });

let generatedOtp="", otpExpiresAt=0;
function generateOtp(){ generatedOtp=String(Math.floor(100000+Math.random()*900000)); otpExpiresAt=Date.now()+300000; return generatedOtp; }

document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const phone=document.getElementById("loginPhone").value.trim();
  if(!/^\d{10}$/.test(phone)){ showToast("Enter a valid 10-digit phone number."); return; }
  const otp=generateOtp();
  document.getElementById("otpArea").hidden=false;
  document.getElementById("otpMessage").textContent=`Demo OTP: ${otp} • Valid for 5 minutes.`;
  document.getElementById("otpInput").focus();
});
document.getElementById("verifyOtp")?.addEventListener("click", () => {
  const input=document.getElementById("otpInput").value.trim();
  if(!generatedOtp){showToast("Generate an OTP first.");return;}
  if(Date.now()>otpExpiresAt){showToast("OTP expired. Generate a new OTP.");return;}
  if(input!==generatedOtp){showToast("Incorrect OTP. Please try again.");return;}
  const name=document.getElementById("loginName").value.trim();
  const phone=document.getElementById("loginPhone").value.trim();
  sessionStorage.setItem("5gTaxiUser",JSON.stringify({name,phone}));
  closeLogin();
  showToast(`Welcome, ${name}! Login successful.`);
});
document.getElementById("resendOtp")?.addEventListener("click",()=>{
  const otp=generateOtp();
  document.getElementById("otpMessage").textContent=`New demo OTP: ${otp} • Valid for 5 minutes.`;
});
window.addEventListener("load",()=>{
  const selected=sessionStorage.getItem("selectedVehicle");
  if(selected){const msg=document.querySelector('textarea[name="message"]');if(msg&&!msg.value)msg.value=`Preferred vehicle: ${selected}`;}
});
