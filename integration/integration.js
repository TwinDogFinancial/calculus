/**
 * Integration examples viewer.
 * This script populates the list of integration examples and displays the selected
 * integral together with its antiderivative using MathJax for LaTeX rendering.
 */

const integrationExamples = [
    {
        title: "Power Rule – \\(\\int x^2\\,dx\\)",
        integral: "\\int x^{2}\\,dx",
        solution: "\\frac{x^{3}}{3}+C",
        description: "Using the power rule \\(\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1}+C\\) with \\(n=2\\)."
    },
    {
        title: "Exponential – \\(\\int e^{x}\\,dx\\)",
        integral: "\\int e^{x}\\,dx",
        solution: "e^{x}+C",
        description: "The antiderivative of \\(e^{x}\\) is itself."
    },
    {
        title: "Sine – \\(\\int \\sin x\\,dx\\)",
        integral: "\\int \\sin x\\,dx",
        solution: "-\\cos x + C",
        description: "Since \\(\\frac{d}{dx}\\cos x = -\\sin x\\), the integral of \\(\\sin x\\) is \\(-\\cos x\\)."
    },
    {
        title: "Cosine – \\(\\int \\cos x\\,dx\\)",
        integral: "\\int \\cos x\\,dx",
        solution: "\\sin x + C",
        description: "Derivative of \\(\\sin x\\) is \\(\\cos x\\)."
    },
    {
        title: "Natural Log – \\(\\int \\frac{1}{x}\\,dx\\)",
        integral: "\\int \\frac{1}{x}\\,dx",
        solution: "\\ln|x| + C",
        description: "Integral of the reciprocal function."
    },
    {
        title: "Integration by Parts – \\(\\int x e^{x}\\,dx\\)",
        integral: "\\int x e^{x}\\,dx",
        solution: "x e^{x} - e^{x} + C",
        description: "Using \\(\\int u\\,dv = uv - \\int v\\,du\\) with \\(u = x,\\; dv = e^{x}dx\\)."
    },
    {
        title: "Partial Fractions – \\(\\int \\frac{1}{x^{2}-1}\\,dx\\)",
        integral: "\\int \\frac{1}{x^{2}-1}\\,dx",
        solution: \"\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right| + C\",
        description: "Decompose \\(\\frac{1}{x^{2}-1}=\\frac{1}{2}\\left(\\frac{1}{x-1}-\\frac{1}{x+1}\\right)\\)."
    }
];

/**
 * Populate the left‑hand list with example titles.
 */
function populateList() {
    const listEl = document.getElementById('list');
    integrationExamples.forEach((ex, idx) => {
        const li = document.createElement('div');
        li.className = 'example-item';
        li.dataset.index = idx;
        li.innerHTML = ex.title;
        li.addEventListener('click', () => selectExample(idx));
        listEl.appendChild(li);
    });
}

/**
 * Display the selected example.
 */
function selectExample(index) {
    const ex = integrationExamples[index];

    // Highlight active list item
    document.querySelectorAll('.example-item').forEach(item => {
        item.classList.toggle('active', item.dataset.index == index);
    });

    const display = document.getElementById('display');
    display.innerHTML = `
        <h2>${ex.title}</h2>
        <p class="formula">Integral: \\[ ${ex.integral} \\]</p>
        <p class="formula">Solution: \\[ ${ex.solution} \\]</p>
        <p>${ex.description}</p>
    `;

    // Re‑render MathJax content
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise();
    }
}

/**
 * Initialise the page once the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    populateList();
});
