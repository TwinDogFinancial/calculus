/**
 * Simple data-driven page that shows a few classic differentiation examples.
 * The page uses MathJax to render LaTeX formulas and Chart.js to plot
 * the function together with its derivative (rate of change) at a sample point.
 */

const examples = [
    {
        title: "Power Rule – \\(x^2\\)",
        expression: "f(x) = x^2",
        derivative: "f'(x) = 2x",
        description: "Using the power rule \\(\\frac{d}{dx}x^n = nx^{n-1}\\) with \\(n=2\\).",
        // function and derivative for numeric evaluation
        fn: x => x * x,
        dfn: x => 2 * x
    },
    {
        title: "Power Rule – \\(x^3\\)",
        expression: "f(x) = x^3",
        derivative: "f'(x) = 3x^2",
        description: "Applying the power rule with \\(n=3\\).",
        fn: x => x * x * x,
        dfn: x => 3 * x * x
    },
    {
        title: "Exponential – \\(e^x\\)",
        expression: "f(x) = e^{x}",
        derivative: "f'(x) = e^{x}",
        description: "The derivative of the natural exponential function is itself.",
        fn: x => Math.exp(x),
        dfn: x => Math.exp(x)
    },
    {
        title: "Sine – \\(\\sin x\\)",
        expression: "f(x) = \\sin{x}",
        derivative: "f'(x) = \\cos{x}",
        description: "Derivative of the sine function.",
        fn: x => Math.sin(x),
        dfn: x => Math.cos(x)
    },
    {
        title: "Cosine – \\(\\cos x\\)",
        expression: "f(x) = \\cos{x}",
        derivative: "f'(x) = -\\sin{x}",
        description: "Derivative of the cosine function.",
        fn: x => Math.cos(x),
        dfn: x => -Math.sin(x)
    },
    {
        title: "Logarithm – \\(\\ln x\\)",
        expression: "f(x) = \\ln{x}",
        derivative: "f'(x) = \\frac{1}{x}",
        description: "Derivative of the natural logarithm.",
        fn: x => Math.log(x),
        dfn: x => 1 / x
    },
    {
        title: "Product Rule – \\(x\\sin x\\)",
        expression: "f(x) = x\\sin{x}",
        derivative: "f'(x) = \\sin{x} + x\\cos{x}",
        description: "Using the product rule \\((uv)' = u'v + uv'\\).",
        fn: x => x * Math.sin(x),
        dfn: x => Math.sin(x) + x * Math.cos(x)
    },
    {
        title: "Quotient Rule – \\(\\frac{x}{1+x^2}\\)",
        expression: "f(x) = \\frac{x}{1+x^{2}}",
        derivative: "f'(x) = \\frac{1 - x^{2}}{(1+x^{2})^{2}}",
        description: "Using the quotient rule \\((\\frac{u}{v})' = \\frac{u'v - uv'}{v^{2}}\\).",
        fn: x => x / (1 + x * x),
        dfn: x => (1 - x * x) / Math.pow(1 + x * x, 2)
    }
];

// Global reference to the Chart instance so we can update it later
let chartInstance = null;

/**
 * Populate the list of examples in the sidebar.
 */
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

/**
 * Render the selected example: LaTeX formulas, description, and a graph.
 * @param {number} index - Index of the example in the `examples` array.
 */
function selectExample(index) {
    const ex = examples[index];

    // Highlight active item
    document.querySelectorAll('.example-item').forEach(item => {
        item.classList.toggle('active', item.dataset.index == index);
    });

    // Fill display area with LaTeX
    document.getElementById('original').innerHTML = `\\[ ${ex.expression} \\]`;
    document.getElementById('derivative').innerHTML = `\\[ ${ex.derivative} \\]`;
    document.getElementById('description').textContent = ex.description;

    // Re‑render MathJax
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise();
    }

    // Draw the graph for this example
    drawGraph(ex);
}

/**
 * Generate data points for the function and its derivative and render them
 * using Chart.js.
 * @param {Object} ex - The example object containing `fn` and `dfn`.
 */
function drawGraph(ex) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    // Define the range and step for x-values
    const xMin = -5;
    const xMax = 5;
    const step = 0.1;
    const xs = [];
    const fVals = [];
    const dVals = [];

    for (let x = xMin; x <= xMax; x += step) {
        // Guard against domain errors (e.g., log of negative numbers)
        try {
            const y = ex.fn(x);
            const dy = ex.dfn(x);
            if (Number.isFinite(y) && Number.isFinite(dy)) {
                xs.push(x.toFixed(2));
                fVals.push(y);
                dVals.push(dy);
            }
        } catch (e) {
            // Skip points where the function is undefined
        }
    }

    const data = {
        labels: xs,
        datasets: [
            {
                label: 'Function',
                data: fVals,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false,
                tension: 0.1
            },
            {
                label: 'Derivative (rate)',
                data: dVals,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.1
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'y'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    };

    // If a chart already exists, destroy it before creating a new one
    if (chartInstance) {
        chartInstance.destroy();
    }
    // Ensure the canvas has a reasonable height
    canvas.style.height = '400px';
    chartInstance = new Chart(ctx, config);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    populateList();
    // Optionally select the first example by default
    if (examples.length > 0) {
        selectExample(0);
    }
});
