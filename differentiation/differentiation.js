/**
 * Simple data-driven page that shows a few classic differentiation examples.
 * The page uses MathJax to render LaTeX formulas.
 */

const examples = [
    {
        title: "Power Rule – \\(x^2\\)",
        expression: "f(x) = x^2",
        derivative: "f'(x) = 2x",
        description: "Using the power rule \\(\\frac{d}{dx}x^n = nx^{n-1}\\) with \\(n=2\\)."
    },
    {
        title: "Power Rule – \\(x^3\\)",
        expression: "f(x) = x^3",
        derivative: "f'(x) = 3x^2",
        description: "Applying the power rule with \\(n=3\\)."
    },
    {
        title: "Exponential – \\(e^x\\)",
        expression: "f(x) = e^{x}",
        derivative: "f'(x) = e^{x}",
        description: "The derivative of the natural exponential function is itself."
    },
    {
        title: "Sine – \\(\\sin x\\)",
        expression: "f(x) = \\sin{x}",
        derivative: "f'(x) = \\cos{x}",
        description: "Derivative of the sine function."
    },
    {
        title: "Cosine – \\(\\cos x\\)",
        expression: "f(x) = \\cos{x}",
        derivative: "f'(x) = -\\sin{x}",
        description: "Derivative of the cosine function."
    },
    {
        title: "Logarithm – \\(\\ln x\\)",
        expression: "f(x) = \\ln{x}",
        derivative: "f'(x) = \\frac{1}{x}",
        description: "Derivative of the natural logarithm."
    },
    {
        title: "Product Rule – \\(x\\sin x\\)",
        expression: "f(x) = x\\sin{x}",
        derivative: "f'(x) = \\sin{x} + x\\cos{x}",
        description: "Using the product rule \\((uv)' = u'v + uv'\\)."
    },
    {
        title: "Quotient Rule – \\(\\frac{x}{1+x^2}\\)",
        expression: "f(x) = \\frac{x}{1+x^{2}}",
        derivative: "f'(x) = \\frac{1 - x^{2}}{(1+x^{2})^{2}}",
        description: "Using the quotient rule \\((\\frac{u}{v})' = \\frac{u'v - uv'}{v^{2}}\\)."
    }
];

// Populate the list of examples
function populateList() {
    const listEl = document.getElementById('list');
    examples.forEach((ex, idx) => {
        const li = document.createElement('li');
        li.textContent = ex.title;
        li.className = 'example-item';
        li.dataset.index = idx;
        li.addEventListener('click', () => selectExample(idx));
        listEl.appendChild(li);
    });
}

// Show selected example
function selectExample(index) {
    const ex = examples[index];
    // Highlight active item
    document.querySelectorAll('.example-item').forEach(item => {
        item.classList.toggle('active', item.dataset.index == index);
    });

    // Fill display area
    document.getElementById('original').innerHTML = `\\[ ${ex.expression} \\]`;
    document.getElementById('derivative').innerHTML = `\\[ ${ex.derivative} \\]`;
    document.getElementById('description').textContent = ex.description;

    // Re‑render MathJax
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise();
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    populateList();
    // Optionally select the first example by default
    if (examples.length > 0) {
        selectExample(0);
    }
});
