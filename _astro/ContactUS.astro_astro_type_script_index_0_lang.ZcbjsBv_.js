document.addEventListener("DOMContentLoaded",m);document.addEventListener("astro:page-load",m);document.addEventListener("astro:after-swap",m);function m(){const e=document.getElementById("contact-form");if(!e)return;const t=document.getElementById("name"),n=document.getElementById("email_address"),o=document.getElementById("message"),r=document.getElementById("form-result");if(!t||!n||!o||!r)return;const s=e.cloneNode(!0);e.parentNode.replaceChild(s,e);const i=document.getElementById("name"),l=document.getElementById("email_address"),d=document.getElementById("message");document.getElementById("submit-button");const v=document.getElementById("form-result");i.addEventListener("input",function(){a(i)}),l.addEventListener("input",function(){a(l,!0)}),d.addEventListener("input",function(){a(d)}),[i,l,d].forEach(c=>{c.addEventListener("focus",function(){this.parentElement.classList.add("focused")}),c.addEventListener("blur",function(){this.parentElement.classList.remove("focused")})}),s.addEventListener("submit",function(c){c.preventDefault();const u=a(i),f=a(l,!0),g=a(d);if(!u||!f||!g)return u?f?g||d.focus():l.focus():i.focus(),!1;w(s,v)})}function a(e,t=!1){const n=e.nextElementSibling,o=document.querySelector(".email-empty"),r=document.querySelector(".email-invalid");return e.classList.remove("border-red-500"),n&&(n.style.display="none"),t?e.value.trim()===""?(e.classList.add("border-red-500"),o&&(o.style.display="block"),r&&(r.style.display="none"),!1):p(e.value)?!0:(e.classList.add("border-red-500"),o&&(o.style.display="none"),r&&(r.style.display="block"),!1):e.value.trim()===""?(e.classList.add("border-red-500"),n&&(n.style.display="block"),!1):!0}function p(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}function w(e,t){t.innerHTML=`
      <div class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-3 text-[#D32F2F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
      </div>
    `,t.classList.remove("hidden","bg-green-100","bg-red-100","text-green-700","text-red-700"),t.classList.add("flex","bg-slate-100","text-slate-700");const n=new FormData(e),o=Object.fromEntries(n),r=JSON.stringify(o);fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:r}).then(async s=>{const i=await s.json();s.status===200?(t.classList.remove("bg-slate-100","text-slate-700"),t.classList.add("bg-green-100","text-green-700"),t.innerHTML=`
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            ${i.message||"Message sent successfully!"}
          </div>
        `,e.reset()):(console.error(s),t.classList.remove("bg-slate-100","text-slate-700"),t.classList.add("bg-red-100","text-red-700"),t.innerHTML=`
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            ${i.message||"Something went wrong!"}
          </div>
        `)}).catch(s=>{console.error(s),t.classList.remove("bg-slate-100","text-slate-700"),t.classList.add("bg-red-100","text-red-700"),t.innerHTML=`
        <div class="flex items-center">
          <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Something went wrong!
        </div>
      `}).finally(()=>{setTimeout(()=>{t.classList.add("hidden")},5e3)})}
