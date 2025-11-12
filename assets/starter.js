// canonical in-memory holders (kept lightweight; persisted to localStorage via helpers)
let resumeData = {};
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

    if (currentStep <= 50) {
        currentStep += 50;
        progress.style.width = currentStep + '%';
    }
    if (currentStep === 50) {
        loadExperiences();
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
        //add the correct parametre for this function to work.
        FileReader(e.target.files)
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

    const fnameValue = fnameInput.value.trim();
    if (isVisible(fnameInput)) {
        if (!fnameValue || !nameregex.test(fnameValue)) {
            fnameError.classList.remove('hidden');
            ok = false;
        } else {
            fnameError.classList.add('hidden');
        }
    } else {
        // hide error if field is not visible
        fnameError.classList.add('hidden');
    }

    const lnameValue = lnameInput.value.trim();
    if (isVisible(lnameInput)) {
        if (!lnameValue || !nameregex.test(lnameValue)) {
            lnameError.classList.remove('hidden');
            ok = false;
        } else {
            lnameError.classList.add('hidden');
        }
    } else {
        lnameError.classList.add('hidden');
    }

    const emailValue = emailInput.value.trim();
    if (isVisible(emailInput)) {
        if (!emailValue || !emailregex.test(emailValue)) {
            emailError.classList.remove('hidden');
            ok = false;
        } else {
            emailError.classList.add('hidden');
        }
    } else {
        emailError.classList.add('hidden');
    }

    const phoneValue = phoneInput.value.trim();
    if (isVisible(phoneInput)) {
        if (!phoneValue || !phoneregex.test(phoneValue)) {
            phoneError.classList.remove('hidden');
            ok = false;
        } else {
            phoneError.classList.add('hidden');
        }
    } else {
        phoneError.classList.add('hidden');
    }

    const addressValue = addressInput.value.trim();
    if (isVisible(addressInput)) {
        if (!addressValue || !addressregex.test(addressValue)) {
            addressError.classList.remove('hidden');
            ok = false;
        } else {
            addressError.classList.add('hidden');
        }
    } else {
        addressError.classList.add('hidden');
    }

    const cityValue = cityInput.value.trim();
    if (isVisible(cityInput)) {
        if (!cityValue || !nameregex.test(cityValue)) {
            cityError.classList.remove('hidden');
            ok = false;
        } else {
            cityError.classList.add('hidden');
        }
    } else {
        cityError.classList.add('hidden');
    }

    // Additional simple required checks
    const birthValue = birthInput.value;
    if (isVisible(birthInput)) {
        if (!birthValue) {
            birthError.classList.remove('hidden');
            ok = false;
        } else {
            birthError.classList.add('hidden');
        }
    } else {
        birthError.classList.add('hidden');
    }

    const licenceValue = licenceInput.value.trim();
    if (isVisible(licenceInput)) {
        if (!licenceValue) {
            licenceError.classList.remove('hidden');
            ok = false;
        } else {
            licenceError.classList.add('hidden');
        }
    } else {
        licenceError.classList.add('hidden');
    }

    const nationalityValue = nationalityInput.value.trim();
    if (isVisible(nationalityInput)) {
        if (!nationalityValue) {
            nationalityError.classList.remove('hidden');
            ok = false;
        } else {
            nationalityError.classList.add('hidden');
        }
    } else {
        nationalityError.classList.add('hidden');
    }

    const placeBirthValue = placeBirthInput.value.trim();
    if (isVisible(placeBirthInput)) {
        if (!placeBirthValue || !nameregex.test(placeBirthValue)) {
            placeError.classList.remove('hidden');
            ok = false;
        } else {
            placeError.classList.add('hidden');
        }
    } else {
        placeError.classList.add('hidden');
    }

    const genderValue = genderInput.value.trim();
    if (isVisible(genderInput)) {
        if (!genderValue) {
            genderError.classList.remove('hidden');
            ok = false;
        } else {
            genderError.classList.add('hidden');
        }
    } else {
        genderError.classList.add('hidden');
    }

    const linkedlnValue = linkedlnInput.value.trim();
    if (isVisible(linkedlnInput)) {
        if (linkedlnValue && !linksRegex.test(linkedlnValue)) {
            linkedlnError.classList.remove('hidden');
            ok = false;
        } else {
            linkedlnError.classList.add('hidden');
        }
    } else {
        linkedlnError.classList.add('hidden');
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
        upsertResumeData({ personal });
    } catch (e) {
        console.warn('localStorage setItem failed', e);
    }
}

// Merge partial data into resumeData in localStorage
function upsertResumeData(partial) {
    try {
        const existing = JSON.parse(localStorage.getItem('resumeData')) || {};
        const merged = Object.assign({}, existing, partial);
        localStorage.setItem('resumeData', JSON.stringify(merged));
        // keep a single canonical `resume` object in localStorage as well
        try {
            persistResumeObject();
        } catch (e) {
            console.warn('persistResumeObject failed after upsert', e);
        }
        return merged;
    } catch (e) {
        console.warn('upsertResumeData failed', e);
        throw e;
    }
}

// Build a single resume object from resumeData + current DOM/quill state
function buildResumeObject() {
    const stored = JSON.parse(localStorage.getItem('resumeData')) || {};
    const resume = {};

    // Personal
    resume.personal = Object.assign({}, stored.personal || {});
    // If DOM has visible personal values, prefer them
    try {
        if (fnameInput && isVisible(fnameInput)) resume.personal.fname = fnameInput.value.trim();
        if (lnameInput && isVisible(lnameInput)) resume.personal.lname = lnameInput.value.trim();
        if (emailInput && isVisible(emailInput)) resume.personal.email = emailInput.value.trim();
        if (phoneInput && isVisible(phoneInput)) resume.personal.phone = phoneInput.value.trim();
        if (addressInput && isVisible(addressInput)) resume.personal.address = addressInput.value.trim();
        if (zipInput) resume.personal.zip = zipInput.value.trim();
        if (cityInput && isVisible(cityInput)) resume.personal.city = cityInput.value.trim();
        if (birthInput && isVisible(birthInput)) resume.personal.birth = birthInput.value;
        if (licenceInput && isVisible(licenceInput)) resume.personal.licence = licenceInput.value.trim();
        if (nationalityInput && isVisible(nationalityInput)) resume.personal.nationality = nationalityInput.value.trim();
        if (placeBirthInput && isVisible(placeBirthInput)) resume.personal.placeOfBirth = placeBirthInput.value.trim();
        if (genderInput && isVisible(genderInput)) resume.personal.gender = genderInput.value.trim();
        if (linkedlnInput && isVisible(linkedlnInput)) resume.personal.linkedln = linkedlnInput.value.trim();
    } catch (e) {
        // ignore DOM read failures
    }

    // Resume objective and editors
    try {
        if (window.quillEditors && window.quillEditors.editor1) resume.resume = window.quillEditors.editor1.getText().trim();
        if (stored.workExperience) resume.workExperience = Object.assign({}, stored.workExperience);
        if (window.quillEditors && window.quillEditors.editor2) {
            resume.workExperience = Object.assign({}, resume.workExperience || {}, {
                description: window.quillEditors.editor2.getText().trim()
            });
        }
        if (stored.education) resume.education = Object.assign({}, stored.education);
        if (window.quillEditors && window.quillEditors.editor3) {
            resume.education = Object.assign({}, resume.education || {}, {
                description: window.quillEditors.editor3.getText().trim()
            });
        }
    } catch (e) {
        // ignore quill/read errors
    }

    // Other stored keys (interests, skills) - copy as-is
    if (stored.interests) resume.interests = stored.interests;
    if (stored.skills) resume.skills = stored.skills;

    return resume;
}

// Persist the single `resume` object into localStorage under key 'resume'
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
        localStorage.setItem('resumeData', JSON.stringify(result));
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
    const jobTitleInput = document.getElementById("job__title");
    const cityTownInput = document.getElementById("city__town");
    const employerInput = document.getElementById("employer");
    const startMonth = document.getElementById("start__month");
    const startYear = document.getElementById("start__year");
    const endMonth = document.getElementById("end__month");
    const endYear = document.getElementById("end__year");

    const workExperience = {
        jobTitle: jobTitleInput.value.trim(),
        city: cityTownInput.value.trim(),
        employer: employerInput.value.trim(),
        startDate: `${startMonth.value}. ${startYear.value}`,
        endDate: `${endMonth.value}. ${endYear.value}`,
        description: window.quillEditors.editor2.getText().trim()
    };

    try {
        upsertResumeData({ workExperience });
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
        upsertResumeData({ education: educationData });
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
    // const 
    if (e.target && e.target.id === "save__interest--btn") {
        const hobby = document.getElementById("hobby");
        if (validInterest()) {
            saveMessage[3].classList.add("text-green-500");
            saveMessage[3].classList.remove("text-red-500");
            saveMessage[3].textContent = "✓ Saved Successfully";
            // store the value (not the element)
            localStorage.setItem("interests", JSON.stringify(hobby.value.trim()));
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
            experiences.resume = text1.trim();

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
    // respond to the save button for skills (not the input itself)
    if (e.target && e.target.id === "save__skills--btn") {
        const skillsInput = document.getElementById("skills");
        const levelInput = document.getElementById("level");
        const skillsInputValue = skillsInput.value.trim()
        if (validSkills() && levelInput.value) {
            saveMessage[4].classList.add("text-green-500");
            saveMessage[4].classList.remove("text-red-500");
            saveMessage[4].textContent = "✓ Saved Successfully";
            localStorage.setItem("skills", JSON.stringify(skillsInputValue,levelInput.value));
        } else {
            saveMessage[4].classList.remove("text-green-500");
            saveMessage[4].classList.add("text-red-500");
            saveMessage[4].textContent = "This field is required";


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
// })
