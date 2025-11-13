const personal = {};



const steps = document.querySelectorAll('.step');
const progress = document.getElementById('progress-line');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

//additional info button and div;
const additionalInfoBtnDiv = document.getElementById("additionalinfo__button--div");
const additionalInfoBtn = document.getElementById("additionalinfo--btn");
const additionalInfoDiv = document.getElementById("additionalinfo--div");
const additionalInfoCancelBtnDiv = document.getElementById("additionalinfocancel__button--div")
const additionalInfoCancelBtn = document.getElementById("additionalinfo__button__cancel")
const saveDescription = document.getElementById("save_description")

let currentStep = 0;

const Personal = document.getElementById("subsection").innerHTML;

nextBtn.addEventListener("click", () => {
    // If we're on the first step, validate the personal details before advancing
    if (currentStep === 0) {
        const ok = validateAllFields();
        if (!ok) {
            return;
        } savePersonalData();
    }

    // advance in 50% steps up to 100
    if (currentStep < 100) {
        currentStep += 50;
        progress.style.width = currentStep + '%';
    }
    if (currentStep === 50) {
        loadExperiences();
        // Persist Obj when we move to the next page (user requested behavior)
        try { persistObj(); } catch (e) { console.warn('persist on step change failed', e); }
    }
    if (currentStep === 100) {
        // Ensure all data is persisted before loading template
        persistObj();
        finalizeAndSaveAll();
        loadCVTemplate(); // This will inject the template and show it
    }

})
prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep -= 50;
        progress.style.width = currentStep + '%';
    }
    if (currentStep === 50) {
        loadExperiences();
    }
    if (currentStep === 0) {
        document.getElementById("subsection").innerHTML = Personal;
    }
})

// Load the CV template into #subsection and populate it from Obj/localStorage
function loadCVTemplate() {
    fetch("tempate_1.html").then(response => response.text()).then(html => {
        const container = document.getElementById("subsection");

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const scripts = doc.querySelectorAll('script');

        // Append external scripts (html2pdf) to body so they load
        scripts.forEach(script => {
            if (script.src) {
                const s = document.createElement('script');
                s.src = script.src;
                document.body.appendChild(s);
            }
        });

        // Remove scripts from the HTML before inserting
        scripts.forEach(s => s.remove());

        container.innerHTML = doc.body.innerHTML;

        // Ensure template visible and populate fields from Obj or localStorage
        setTimeout(() => {
            const data = (typeof Obj !== 'undefined' && Obj) ? Obj : (JSON.parse(localStorage.getItem('resumeData')) || {});

            const resumeHTML = (window.quillEditors && window.quillEditors.editor1 && window.quillEditors.editor1.root)
                ? window.quillEditors.editor1.root.innerHTML
                : (data.resume || '');
            const workDescHTML = (window.quillEditors && window.quillEditors.editor2 && window.quillEditors.editor2.root)
                ? window.quillEditors.editor2.root.innerHTML
                : (data.workExperience?.description || '');
            const eduDescHTML = (window.quillEditors && window.quillEditors.editor3 && window.quillEditors.editor3.root)
                ? window.quillEditors.editor3.root.innerHTML
                : (data.education?.description || '');

            const setText = (id, text) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.textContent = text || '';
            };

            setText('cv-name', `${data.personal?.fname || ''} ${data.personal?.lname || ''}`);
            setText('cv-email', data.personal?.email || '');
            setText('cv-phone', data.personal?.phone || '');
            setText('cv-address', data.personal?.address || '');
            setText('cv-city', data.personal?.city || '');
            setText('cv-nationality', data.personal?.nationality || '');

            const titleEl = document.getElementById('cv-title');
            if (titleEl) {
                if (resumeHTML && resumeHTML.trim()) titleEl.innerHTML = resumeHTML; else titleEl.textContent = (data.resume || '');
            }

            setText('cv-jobTitle', data.workExperience?.jobTitle || '');
            setText('cv-employer', data.workExperience?.employer || '');
            setText('cv-period', `${data.workExperience?.startDate || ''} - ${data.workExperience?.endDate || ''}`);
            const workEl = document.getElementById('cv-experience-desc');
            if (workEl) workEl.innerHTML = workDescHTML || '';

            setText('cv-degree', data.education?.degree || '');
            setText('cv-school', data.education?.school || '');
            setText('cv-edu-period', `${data.education?.startDate || ''} - ${data.education?.endDate || ''}`);
            const eduEl = document.getElementById('cv-edu-desc');
            if (eduEl) eduEl.innerHTML = eduDescHTML || '';

            setText('cv-interests', data.interests || '');
            setText('cv-skills', data.skills || '');

            // attach download handler
            const downloadBtn = document.getElementById("downloadPDF");
            if (downloadBtn) {
                downloadBtn.addEventListener("click", () => {
                    const element = document.getElementById("cv-content");
                    const opt = {
                        margin: 0.5,
                        filename: 'My_Resume.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                    };
                    // ensure html2pdf is available
                    if (typeof html2pdf === 'function' || (window.html2pdf && typeof window.html2pdf === 'function')) {
                        html2pdf().set(opt).from(element).save();
                    } else {
                        // try to load html2pdf script then run
                        const s = document.createElement('script');
                        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                        s.onload = () => html2pdf().set(opt).from(element).save();
                        document.body.appendChild(s);
                    }
                });
            }
        }, 120);
    }).catch(err => console.error('Failed to load template:', err));
}

function loadCVTemplate() {
    fetch("template_1.html")
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById("subsection");

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const scripts = doc.querySelectorAll("script");
            let scriptContent = "";

            scripts.forEach(script => {
                if (!script.src) {
                    scriptContent += script.textContent + "\n";
                } else {
                    const s = document.createElement("script");
                    s.src = script.src;
                    document.body.appendChild(s);
                }
            });

            scripts.forEach(s => s.remove());
            container.innerHTML = doc.body.innerHTML;

            setTimeout(() => {
                const cvTemplate = document.getElementById("cv-template");
                if (cvTemplate) cvTemplate.classList.remove("hidden");

                try {
                    const data = JSON.parse(localStorage.getItem("resumeData")) || {};

                    document.getElementById("cv-name").textContent =
                        `${data.personal?.fname || ""} ${data.personal?.lname || ""}`;
                    document.getElementById("cv-email").textContent = data.personal?.email || "";
                    document.getElementById("cv-phone").textContent = data.personal?.phone || "";
                    document.getElementById("cv-address").textContent = data.personal?.address || "";
                    document.getElementById("cv-city").textContent = data.personal?.city || "";
                    document.getElementById("cv-nationality").textContent = data.personal?.nationality || "";
                    document.getElementById("cv-title").textContent = data.resume || "";

                    document.getElementById("cv-jobTitle").textContent = data.workExperience?.jobTitle || "";
                    document.getElementById("cv-employer").textContent = data.workExperience?.employer || "";
                    document.getElementById("cv-period").textContent =
                        `${data.workExperience?.startDate || ""} - ${data.workExperience?.endDate || ""}`;
                    document.getElementById("cv-experience-desc").textContent =
                        data.workExperience?.description || "";

                    document.getElementById("cv-degree").textContent = data.education?.degree || "";
                    document.getElementById("cv-school").textContent = data.education?.school || "";
                    document.getElementById("cv-edu-period").textContent =
                        `${data.education?.startDate || ""} - ${data.education?.endDate || ""}`;
                    document.getElementById("cv-edu-desc").textContent =
                        data.education?.description || "";

                    document.getElementById("cv-interests").textContent = data.interests || "";
                    document.getElementById("cv-skills").textContent = data.skills || "";
                } catch (e) {
                    console.error("Error populating CV:", e);
                }

                // ===== FIXED BUTTON PDF HANDLER =====
                const downloadBtn = document.getElementById("downloadPDF");

                if (downloadBtn) {
                    // remove old listeners
                    const newBtn = downloadBtn.cloneNode(true);
                    downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);

                    newBtn.addEventListener("click", async () => {
                        const { jsPDF } = window.jspdf || {};
                        if (!jsPDF) {
                            alert("jsPDF library missing");
                            return;
                        }

                        const pdf = new jsPDF({
                            unit: "pt",
                            format: "a4",
                            orientation: "portrait"
                        });

                        const element = container;

                        await pdf.html(element, {
                            margin: 20,
                            autoPaging: "text",
                            html2canvas: { scale: 1, useCORS: true },
                            callback: doc => doc.save("My_Resume.pdf")
                        });
                    });
                }

                // ======================================
            }, 10);
        });
}





//                     downloadBtn.addEventListener("click", () => {
//                         const element = document.getElementById("cv-content");
//                         const opt = {
//                             margin: 0.5,
//                             filename: 'My_Resume.pdf',
//                             image: { type: 'jpeg', quality: 0.98 },
//                             html2canvas: { scale: 2 },
//                             jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
//                         };
//                         html2pdf().set(opt).from(element).save();
//                     });
//                 }
//             } catch (e) {
//                 console.warn('Error attaching download handler:', e);
//             }
//         }, 100);
//     }).catch(err => console.error('Failed to load template:', err));
// }

function loadExperiences() {
    fetch("experiences.html").then(response => response.text()).then(html => {
        document.getElementById("subsection").innerHTML = html;
        // Initialize after content is loaded
        initQuills();
    });
    // initialize Quill editors and attach the save listener
    const initQuills = () => {
        window.quillEditors = {
            editor1: null,
            editor2: null,
            editor3: null
        };
        if (typeof Quill !== 'undefined') {
            try {
                window.quillEditors.editor1 = new Quill('#editor1', { theme: 'snow' });

            } catch (e) {
                console.warn('editor1 init failed', e);
            }
            try {
                window.quillEditors.editor2 = new Quill('#editor2', { theme: 'snow' });
            } catch (e) {
                console.warn('editor2 init failed', e);
            }
            try {
                window.quillEditors.editor3 = new Quill('#editor3', { theme: 'snow' });
            } catch (e) {
                console.warn('editor3 init failed', e);
            }
        }
    };

    if (typeof Quill !== 'undefined') {
        initQuills();
    } else {
        // load Quill dynamically and then init
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js';
        s.onload = initQuills;
        s.onerror = () => console.error('Failed to load Quill script');
        document.body.appendChild(s);
    }
};

// working on aditional info button display and hidden;

if (additionalInfoBtn) {
    additionalInfoBtn.addEventListener("click", (e) => {
        additionalInfoBtnDiv.classList.add("hidden");
        additionalInfoDiv.classList.remove("hidden");

    })
}

if (additionalInfoCancelBtn) {
    additionalInfoCancelBtn.addEventListener("click", (e) => {
        additionalInfoDiv.classList.add("hidden")
        additionalInfoBtnDiv.classList.remove("hidden")
    })
}

//validation form of the first Page:
//global variables:

const fnameInput = document.getElementById("fname");
const lnameInput = document.getElementById("lname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const photoFile = document.getElementById("photo");
const addressInput = document.getElementById("address");
const zipInput = document.getElementById("zip");
const cityInput = document.getElementById("city");
const birthInput = document.getElementById("birth");
const licenceInput = document.getElementById("licence");
const nationalityInput = document.getElementById("nationality");
const placeBirthInput = document.getElementById("place__birth");
const genderInput = document.getElementById("gender");
const linkedlnInput = document.getElementById("linkedln");

// Simplified and fixed regex patterns
const nameregex = /^[a-zA-Z\s'-]{2,}$/;
const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneregex = /^(\+\d{1,3}[-.\s]?)?\d{7,}$/;
const addressregex = /^[a-zA-Z0-9\s,\.\-']{5,}$/;
const linksRegex = /^https?:\/\/[^\s]+$/;


// function formValidationOfPerson() {
//     return valid;
// }

const fnameError = document.querySelector(".fname__error");
const lnameError = document.querySelector(".lname__error");
const emailError = document.querySelector(".email__error");
const phoneError = document.querySelector(".phone__error");
const imageError = document.querySelector(".image__error");
const addressError = document.querySelector(".address__error");
const cityError = document.querySelector(".city__error");
const birthError = document.querySelector(".birth__error");
const licenceError = document.querySelector(".licence__error");
const nationalityError = document.querySelector(".nationality__error");
const placeError = document.querySelector(".place__error");
const genderError = document.querySelector(".gender__error");
const linkedlnError = document.querySelector(".linkedln__error")

// verify the input;

document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "fname") {
        const fnameValue = fnameInput.value.trim();
        if (!nameregex.test(fnameValue) && fnameValue.length > 0) {
            fnameError.classList.remove("hidden");
        } else {
            fnameError.classList.add("hidden");
        }
    }

    if (e.target && e.target.id === "lname") {
        const lnameValue = lnameInput.value.trim();
        if (!nameregex.test(lnameValue) && lnameValue.length > 0) {
            lnameError.classList.remove("hidden");
        } else {
            lnameError.classList.add("hidden");
        }
    }

    if (e.target && e.target.id === "email") {
        const emailValue = emailInput.value.trim();
        if (!emailregex.test(emailValue) && emailValue.length > 0) {
            emailError.classList.remove("hidden");
        } else {
            emailError.classList.add("hidden");
        }
    }

    if (e.target && e.target.id === "phone") {
        const phoneValue = phoneInput.value.trim();
        if (!phoneregex.test(phoneValue) && phoneValue.length > 0) {
            phoneError.classList.remove("hidden");
        } else {
            phoneError.classList.add("hidden");
        }
    }

    if (e.target && e.target.id === "address") {
        const addressValue = addressInput.value.trim();
        if (!addressregex.test(addressValue) && addressValue.length > 0) {
            addressError.classList.remove("hidden");
        } else {
            addressError.classList.add("hidden");
        }
    }

    if (e.target && e.target.id === "city") {
        const cityValue = cityInput.value.trim();
        if (!nameregex.test(cityValue) && cityValue.length > 0) {
            cityError.classList.remove("hidden");
        } else {
            cityError.classList.add("hidden");
        }
    }
    if (e.target && e.target.id === "birth") {
        const birthValue = birthInput.value;
        if (birthValue.length === 0) {
            birthError.classList.remove("hidden");
        }
        else {
            birthError.classList.add("hidden")
        }
    }
    if (e.target && e.target.id === "licence") {
        const licenceValue = licenceInput.value.trim();
        if (!licenceValue) {
            licenceError.classList.remove("hidden");
        }
        else {
            licenceError.classList.add("hidden");
        }
    }
    if (e.target && e.target.id === "nationality") {
        const nationalityValue = nationalityInput.value.trim();
        if (!nationalityValue) {
            nationalityError.classList.remove("hidden");
        }
        else {
            nationalityError.classList.add("hidden");
        }
    }
    if (e.target && e.target.id === "place__birth") {
        const placeBirthValue = placeBirthInput.value.trim();
        if (!nameregex.test(placeBirthValue)) {
            placeError.classList.remove("hidden");
        }
        else {
            placeError.classList.add("hidden");
        }
    }
    if (e.target && e.target.id === "gender") {
        const genderValue = genderInput.value.trim();
        if (!nameregex.test(genderValue)) {
            genderError.classList.remove("hidden");
        }
        else {
            genderError.classList.add("hidden");
        }
    }
    if (e.target && e.target.id === "linkedln") {
        const linkedlnValue = linkedlnInput.value.trim();
        if (!linksRegex.test(linkedlnValue)) {
            linkedlnError.classList.remove("hidden");
        }
        else {
            linkedlnError.classList.add("hidden");
        }
    }
})

document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "photo") {
        // show image preview if a file was selected
        const files = e.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                try {
                    const holder = document.getElementById('photo__holder');
                    const img = holder ? holder.querySelector('img') : null;
                    if (img) {
                        img.src = ev.target.result;
                        holder.classList.remove('hidden');
                    }
                } catch (err) {
                    console.warn('image preview failed', err);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    }
})
//chicking if all message error are hidden;
// helper to determine if an input (or its container) is visible
function isVisible(el) {
    if (!el) return false;
    try {
        if (el.closest && el.closest('.hidden')) return false;
    } catch (e) {
    }
    const cs = getComputedStyle(el);//========================================
    return cs.display !== 'none' && cs.visibility !== 'hidden';
}

// Run validation for all required fields and show/hide errors.
function validateAllFields() {
    let ok = true;

    const fnameValue = fnameInput ? fnameInput.value.trim() : '';
    if (fnameInput && isVisible(fnameInput)) {
        if (!fnameValue || !nameregex.test(fnameValue)) {
            fnameError && fnameError.classList.remove('hidden');
            ok = false;
        } else {
            fnameError && fnameError.classList.add('hidden');
        }
    } else {
        fnameError && fnameError.classList.add('hidden');
    }

    const lnameValue = lnameInput ? lnameInput.value.trim() : '';
    if (lnameInput && isVisible(lnameInput)) {
        if (!lnameValue || !nameregex.test(lnameValue)) {
            lnameError && lnameError.classList.remove('hidden');
            ok = false;
        } else {
            lnameError && lnameError.classList.add('hidden');
        }
    } else {
        lnameError && lnameError.classList.add('hidden');
    }

    const emailValue = emailInput ? emailInput.value.trim() : '';
    if (emailInput && isVisible(emailInput)) {
        if (!emailValue || !emailregex.test(emailValue)) {
            emailError && emailError.classList.remove('hidden');
            ok = false;
        } else {
            emailError && emailError.classList.add('hidden');
        }
    } else {
        emailError && emailError.classList.add('hidden');
    }

    const phoneValue = phoneInput ? phoneInput.value.trim() : '';
    if (phoneInput && isVisible(phoneInput)) {
        if (!phoneValue || !phoneregex.test(phoneValue)) {
            phoneError && phoneError.classList.remove('hidden');
            ok = false;
        } else {
            phoneError && phoneError.classList.add('hidden');
        }
    } else {
        phoneError && phoneError.classList.add('hidden');
    }

    const addressValue = addressInput ? addressInput.value.trim() : '';
    if (addressInput && isVisible(addressInput)) {
        if (!addressValue || !addressregex.test(addressValue)) {
            addressError && addressError.classList.remove('hidden');
            ok = false;
        } else {
            addressError && addressError.classList.add('hidden');
        }
    } else {
        addressError && addressError.classList.add('hidden');
    }

    const cityValue = cityInput ? cityInput.value.trim() : '';
    if (cityInput && isVisible(cityInput)) {
        if (!cityValue || !nameregex.test(cityValue)) {
            cityError && cityError.classList.remove('hidden');
            ok = false;
        } else {
            cityError && cityError.classList.add('hidden');
        }
    } else {
        cityError && cityError.classList.add('hidden');
    }

    // Additional simple required checks
    const birthValue = birthInput ? birthInput.value : '';
    if (birthInput && isVisible(birthInput)) {
        if (!birthValue) {
            birthError && birthError.classList.remove('hidden');
            ok = false;
        } else {
            birthError && birthError.classList.add('hidden');
        }
    } else {
        birthError && birthError.classList.add('hidden');
    }

    const licenceValue = licenceInput ? licenceInput.value.trim() : '';
    if (licenceInput && isVisible(licenceInput)) {
        if (!licenceValue) {
            licenceError && licenceError.classList.remove('hidden');
            ok = false;
        } else {
            licenceError && licenceError.classList.add('hidden');
        }
    } else {
        licenceError && licenceError.classList.add('hidden');
    }

    const nationalityValue = nationalityInput ? nationalityInput.value.trim() : '';
    if (nationalityInput && isVisible(nationalityInput)) {
        if (!nationalityValue) {
            nationalityError && nationalityError.classList.remove('hidden');
            ok = false;
        } else {
            nationalityError && nationalityError.classList.add('hidden');
        }
    } else {
        nationalityError && nationalityError.classList.add('hidden');
    }

    const placeBirthValue = placeBirthInput ? placeBirthInput.value.trim() : '';
    if (placeBirthInput && isVisible(placeBirthInput)) {
        if (!placeBirthValue || !nameregex.test(placeBirthValue)) {
            placeError && placeError.classList.remove('hidden');
            ok = false;
        } else {
            placeError && placeError.classList.add('hidden');
        }
    } else {
        placeError && placeError.classList.add('hidden');
    }

    const genderValue = genderInput ? genderInput.value.trim() : '';
    if (genderInput && isVisible(genderInput)) {
        if (!genderValue) {
            genderError && genderError.classList.remove('hidden');
            ok = false;
        } else {
            genderError && genderError.classList.add('hidden');
        }
    } else {
        genderError && genderError.classList.add('hidden');
    }

    const linkedlnValue = linkedlnInput ? linkedlnInput.value.trim() : '';
    if (linkedlnInput && isVisible(linkedlnInput)) {
        if (linkedlnValue && !linksRegex.test(linkedlnValue)) {
            linkedlnError && linkedlnError.classList.remove('hidden');
            ok = false;
        } else {
            linkedlnError && linkedlnError.classList.add('hidden');
        }
    } else {
        linkedlnError && linkedlnError.classList.add('hidden');
    }

    // focus first invalid field
    if (!ok) {
        const firstError = document.querySelector('.error:not(.hidden)');
        if (firstError) {
            const input = firstError.previousElementSibling || firstError.parentElement.querySelector('input,select,textarea');
            if (input && typeof input.focus === 'function') input.focus();
        }
    }

    return ok;
}
// collect visible personal fields and save to localStorage
function savePersonalData() {
    const personal = {};

    if (isVisible(fnameInput)) personal.fname = fnameInput.value.trim();
    if (isVisible(lnameInput)) personal.lname = lnameInput.value.trim();
    if (isVisible(emailInput)) personal.email = emailInput.value.trim();
    if (isVisible(phoneInput)) personal.phone = phoneInput.value.trim();
    if (isVisible(addressInput)) personal.address = addressInput.value.trim();
    if (zipInput) personal.zip = zipInput.value.trim();
    if (isVisible(cityInput)) personal.city = cityInput.value.trim();
    if (isVisible(birthInput)) personal.birth = birthInput.value;
    if (isVisible(licenceInput)) personal.licence = licenceInput.value.trim();
    if (isVisible(nationalityInput)) personal.nationality = nationalityInput.value.trim();
    if (isVisible(placeBirthInput)) personal.placeOfBirth = placeBirthInput.value.trim();
    if (isVisible(genderInput)) personal.gender = genderInput.value.trim();
    if (isVisible(linkedlnInput)) personal.linkedln = linkedlnInput.value.trim();

    try {
        updateObj({ personal });
        persistObj();
    } catch (e) {
        console.warn('localStorage setItem failed', e);
    }
}

//  Unified LocalStorage System
let Obj = JSON.parse(localStorage.getItem("resumeData")) || {
    personal: {},
    resume: "",
    workExperience: {},
    education: {},
    interests: "",
    skills: ""
};


// -------------------------------
// Obj in-memory API
// -------------------------------
function updateObj(newData = {}) {
    Obj = { ...Obj, ...newData };
    // do NOT persist here — persistence controlled by caller (e.g., when moving to next page)
}

function persistObj() {
    try {
        localStorage.setItem("resumeData", JSON.stringify(Obj));
    } catch (e) {
        console.warn("persistObj failed", e);
    }
}

// keep saveToLocal as an alias that persists immediately (for backward compatibility)
function saveToLocal(newData = {}) {
    updateObj(newData);
    persistObj();
}

function persistResumeObject() {
    const resume = buildResumeObject();
    try {
        localStorage.setItem('resume', JSON.stringify(resume));
        return resume;
    } catch (e) {
        console.warn('persistResumeObject failed', e);
        throw e;
    }
}

// Finalize and save all current inputs into a single resumeData object
function finalizeAndSaveAll() {
    // Try to read from stored resumeData and enrich with current DOM values
    const stored = JSON.parse(localStorage.getItem('resumeData')) || {};
    const result = Object.assign({}, stored);

    // ensure personal is up to date
    try {
        if (fnameInput && isVisible(fnameInput)) personal.fname = fnameInput.value.trim();
        if (lnameInput && isVisible(lnameInput)) personal.lname = lnameInput.value.trim();
        if (emailInput && isVisible(emailInput)) personal.email = emailInput.value.trim();
        if (phoneInput && isVisible(phoneInput)) personal.phone = phoneInput.value.trim();
        if (addressInput && isVisible(addressInput)) personal.address = addressInput.value.trim();
        if (zipInput) personal.zip = zipInput.value.trim();
        if (cityInput && isVisible(cityInput)) personal.city = cityInput.value.trim();
        result.personal = Object.assign({}, result.personal || {}, personal);
    } catch (e) {
        // ignore
    }

    // quill editors
    try {
        if (window.quillEditors) {
            if (window.quillEditors.editor1) result.resume = window.quillEditors.editor1.getText().trim();
            if (window.quillEditors.editor2) result.workExperience = Object.assign({}, result.workExperience || {}, { description: window.quillEditors.editor2.getText().trim() });
            if (window.quillEditors.editor3) result.education = Object.assign({}, result.education || {}, { description: window.quillEditors.editor3.getText().trim() });
        }
    } catch (e) {
        // ignore
    }

    // persist final object
    try {
        updateObj(result); persistObj();
        return result;
    } catch (e) {
        console.warn('finalizeAndSaveAll failed', e);
        return null;
    }
}

// experience detail hidden or display: use event delegation so it works when element is added dynamicall

//add experiences by adding the header of if -- if true => hidden ? false;
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "resume__object--btn") {
        if (document.getElementById("resume--detail").classList.contains("hidden")) {
            document.getElementById("resume--detail").classList.remove("hidden")
        }
        else {
            document.getElementById("resume--detail").classList.add("hidden")
        }
    }
});

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "experience__detail--btn") {
        if (document.getElementById("experience__detail--div").classList.contains("hidden")) {
            document.getElementById("experience__detail--div").classList.remove("hidden");
        }
        else {
            document.getElementById("experience__detail--div").classList.add("hidden");
        }
    }

    if (e.target && e.target.id === "education__detail--btn") {
        if (document.getElementById("education__detail--div").classList.contains("hidden")) {
            document.getElementById("education__detail--div").classList.remove("hidden")
        }
        else {
            document.getElementById("education__detail--div").classList.add("hidden")
        }
    }

    if (e.target && e.target.id === "interest__detail--btn") {
        if (document.getElementById("interest__detail--div").classList.contains("hidden")) {
            document.getElementById("interest__detail--div").classList.remove("hidden")
        }
        else {
            document.getElementById("interest__detail--div").classList.add("hidden");
        }
    }
})

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "skill__detail--btn") {
        if (document.getElementById("skills__detail--div").classList.contains("hidden")) {
            document.getElementById("skills__detail--div").classList.remove("hidden")
        }
        else {
            document.getElementById("skills__detail--div").classList.add("hidden")
        }
    }
})

//handel data in the experiences fase;

// Validate work experience fields
function validateExperience() {
    const jobTitleInput = document.getElementById("job__title");
    const cityTownInput = document.getElementById("city__town");
    const employerInput = document.getElementById("employer");
    const startMonth = document.getElementById("start__month");
    const startYear = document.getElementById("start__year");
    const endMonth = document.getElementById("end__month");
    const endYear = document.getElementById("end__year");

    // check required fields
    if (!jobTitleInput.value.trim()) return false;
    if (!cityTownInput.value.trim()) return false;
    if (!employerInput.value.trim()) return false;
    if (startMonth.value === '') return false;
    if (startYear.value === '') return false;
    if (endMonth.value === '') return false;
    if (endYear.value === '') return false;

    // check quill editor has content
    if (!window.quillEditors || !window.quillEditors.editor2) return false;
    const description = window.quillEditors.editor2.getText().trim();
    if (description.length === 0) return false;

    return true;
}

// Save work experience data to localStorage
function saveExperienceData() {
    const workExperience = {
        jobTitle: jobTitleInput.value.trim(),
        city: cityTownInput.value.trim(),
        employer: employerInput.value.trim(),
        startDate: `${startMonth.value}. ${startYear.value}`,
        endDate: `${endMonth.value}. ${endYear.value}`,
        description: window.quillEditors.editor2.getText().trim()
    };

    try {
        updateObj({ workExperience });
        persistObj();
    } catch (e) {
        saveMessage[1].classList.remove("text-green-500")
        saveMessage[1].classList.add("text-red-500")
        saveMessage[1].textContent = "please complete all fields"
    }
}

// Validate education fields
function validateEducation() {
    const degreeInput = document.getElementById("degree");
    const cityEducationInput = document.getElementById("city__education");
    const schoolInput = document.getElementById("school");
    const startMonthEducationInput = document.getElementById("start__month--education");
    const startYearEducationInput = document.getElementById("start__year--education");
    const endMonthEducationInput = document.getElementById("end__month--education");
    const endYearEducationInput = document.getElementById("end__year--education");

    // check required fields
    if (!degreeInput || !degreeInput.value.trim()) return false;
    if (!cityEducationInput || !cityEducationInput.value.trim()) return false;
    if (!schoolInput || !schoolInput.value.trim()) return false;
    if (!startMonthEducationInput || startMonthEducationInput.value === '') return false;
    if (!startYearEducationInput || startYearEducationInput.value === '') return false;
    if (!endMonthEducationInput || endMonthEducationInput.value === '') return false;
    if (!endYearEducationInput || endYearEducationInput.value === '') return false;

    // check quill editor has content
    if (!window.quillEditors || !window.quillEditors.editor3) return false;
    const description = window.quillEditors.editor3.getText().trim();
    if (description.length === 0) return false;

    return true;
}

// Save education data to localStorage
function saveEducationData() {
    const degreeInput = document.getElementById("degree");
    const cityEducationInput = document.getElementById("city__education");
    const schoolInput = document.getElementById("school");
    const startMonthEducationInput = document.getElementById("start__month--education");
    const startYearEducationInput = document.getElementById("start__year--education");
    const endMonthEducationInput = document.getElementById("end__month--education");
    const endYearEducationInput = document.getElementById("end__year--education");

    const educationData = {
        degree: degreeInput.value.trim(),
        city: cityEducationInput.value.trim(),
        school: schoolInput.value.trim(),
        startDate: `${startMonthEducationInput.value} ${startYearEducationInput.value}`,
        endDate: `${endMonthEducationInput.value} ${endYearEducationInput.value}`,
        description: window.quillEditors.editor3.getText().trim()
    };

    try {
        updateObj({ education: educationData });
        persistObj();
    } catch (e) {
        console.warn('Failed to save education data to localStorage', e);
    }
}

function validInterest() {
    const hobby = document.getElementById("hobby");
    if (!hobby.value.trim()) return false;
    return true;
}

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "save__interest--btn") {
        const hobby = document.getElementById("hobby");
        if (validInterest()) {
            updateObj({ interests: hobby.value.trim() });
            persistObj();
            saveMessage[3].classList.add("text-green-500");
            saveMessage[3].classList.remove("text-red-500");
            saveMessage[3].textContent = "✓ Saved Successfully";
        }
        else {
            saveMessage[3].classList.add("text-red-500");
            saveMessage[3].classList.remove("text-green-500");
            saveMessage[3].textContent = "This field is required";
        }
    }
})

const saveResumeBtn = document.getElementById("save__resume--btn");
const saveExperienceBtn = document.getElementById("save__experience--btn");
const saveEducationBtn = document.getElementById("save__education--btn");
const saveInterestBtn = document.getElementById("save__interest--btn");
const saveSkillsBtn = document.getElementById("save__skills--btn");

// const text2 = window.quillEditors.editor2.getText();
// const text3 = window.quillEditors.editor3.getText();
// Get HTML content use this method later to get the text as it look like

// const html1 = window.quillEditors.editor1.root.innerHTML;
// const html2 = window.quillEditors.editor2.root.innerHTML;
// const html3 = window.quillEditors.editor3.root.innerHTML;
const saveMessage = document.getElementsByClassName('save__message');
const experiences = {};
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "save__resume--btn") {
        const text1 = window.quillEditors.editor1.getText();
        if (text1.trim().length > 0) {
            updateObj({ resume: text1.trim() });
            persistObj();
            saveMessage[0].classList.remove("text-red-500")
            saveMessage[0].classList.add("text-green-500")
            saveMessage[0].textContent = "✓ Saved Successfully"
        }
        else {
            saveMessage[0].classList.remove("text-green-500")
            saveMessage[0].classList.add("text-red-500")
            saveMessage[0].textContent = "This field is required"
        }
    }
    if (e.target && e.target.id === "save__experience--btn") {
        if (validateExperience()) {
            saveExperienceData();
            saveMessage[1].classList.remove("text-red-500")
            saveMessage[1].classList.add("text-green-500")
            saveMessage[1].textContent = "✓ Saved Successfully"
        }
        else {
            saveMessage[1].classList.remove("text-green-500")
            saveMessage[1].classList.add("text-red-500")
            saveMessage[1].textContent = "This field is required"
        }
    }
    if (e.target && e.target.id === "save__education--btn") {
        if (validateEducation()) {
            saveEducationData();
            saveMessage[2].classList.remove("text-red-500")
            saveMessage[2].classList.add("text-green-500")
            saveMessage[2].textContent = "✓ Saved Successfully"
        }
        else {
            saveMessage[2].classList.remove("text-green-500")
            saveMessage[2].classList.add("text-red-500")
            saveMessage[2].textContent = "This field is required"
        }
    }
})

function validSkills() {
    const skillsInput = document.getElementById("skills");
    if (!skillsInput || !skillsInput.value.trim()) return false;
    return true
}
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "save__skills--btn") {
        const skillsInputValue = document.getElementById("skills").value.trim();
        if (!validSkills()) {
            saveMessage[4].classList.remove("text-green-500")
            saveMessage[4].classList.add("text-red-500");
            saveMessage[4].textContent = "This field is required";
        }
        else {
            updateObj({ skills: skillsInputValue });
            persistObj();
            saveMessage[4].classList.add("text-green-500")
            saveMessage[4].classList.remove("text-red-500");
            saveMessage[4].textContent = "✓ Saved Successfully";
        }
    }
})

// save data and show message:

// let resumeData = {
//     resume: "",
//     work: {
//         jobtitle: "",
//         cityOrtown: "",
//         employer: "",
//         startdate: "",
//         enddate: "",
//         description: ""
//     },
//     education: "",
//     interests: "",
//     skills: ""
// }


// document.addEventListener("click", (e) => {
//     if (e.target && e.target.id === "save__resume--btn" && window.quillEditors) {
//         saveMessage[0].textContent = "✓ Saved Successfully";
//         if (window.quillEditors.editor1) {
//             resumeData.resume = window.quillEditors.editor1.getText();
//         }
//     }
// })

// // work experience data save:

// document.addEventListener("click", (e) => {
//     if (e.target && e.target.id === "save__experience--btn") {
//         saveMessage[1].textContent = "✓ Saved Successfully"
//         // experiences.w
//     }
// }
