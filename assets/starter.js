const steps = document.querySelectorAll('.step');
const progress = document.getElementById('progress-line');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
let currentStep = 1;

function updateSteps() {
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('bg-indigo-500', 'text-white');
            step.classList.remove('bg-green-300', 'text-green-800');
        } else {
            step.classList.add('bg-green-300', 'text-green-800');
            step.classList.remove('bg-indigo-500', 'text-white');
        }
    });
    progress.style.width = ((currentStep - 1) / (steps.length - 1)) * 100 + '%';
}

nextBtn.addEventListener('click', () => {
    if (currentStep < steps.length) {
        currentStep++;
        updateSteps();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
    }
});

