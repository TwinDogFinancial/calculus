/**
 * Differential Equations Explorer
 * ---------------------------------
 * Shows a list of first‑order ODEs, their general solutions,
 * and plots several solution curves (different integration constants).
 *
 * Uses MathJax for LaTeX rendering and Chart.js for the graphs.
 */

const deExamples = [
    {
        title: "dy/dx = x",
        ode: "\\frac{dy}{dx} = x",
        solution: "y = \\frac{x^{2}}{2} + C",
        description: "Integrate both sides: ∫dy = ∫x dx → y = x²/2 + C.",
        // solution function: returns y for a given x and constant C
        solFn: C => x => 0.5 * x * x + C,
        // constants to display
        constants: [-5, 0, 5]
    },
    {
        title: "dy/dx = y",
        ode: "\\frac{dy}{dx} = y",
        solution: "y = C\\,e^{x}",
        description: "Separate variables: dy/y = dx → ln|y| = x + C → y = Ce^{x}.",
        solFn: C => x => C * Math.exp(x),
        constants: [0.5, 1, 2]
    },
    {
        title: "dy/dx = \\sin(x)",
        ode: "\\frac{dy}{dx} = \\sin(x)",
        solution: "y = -\\cos(x) + C",
        description: "Integrate: ∫dy = ∫sin(x)dx → y = -cos(x) + C.",
        solFn: C => x => -Math.cos(x) + C,
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = x\\,y",
        ode: "\\frac{dy}{dx} = x\\,y",
        solution: "y = C\\,e^{x^{2}/2}",
        description: "Separate: dy/y = x dx → ln|y| = x²/2 + C → y = Ce^{x²/2}.",
        solFn: C => x => C * Math.exp(0.5 * x * x),
        constants: [0.5, 1, 2]
    },
    {
        title: "dy/dx = x^{2}",
        ode: "\\frac{dy}{dx} = x^{2}",
        solution: "y = \\frac{x^{3}}{3} + C",
        description: "Integrate: ∫dy = ∫x²dx → y = x³/3 + C.",
        solFn: C => x => (x * x * x) / 3 + C,
        constants: [-3, 0, 3]
    }
];

// Global Chart instance
let chartInstance = null;

/**
 * Populate the list of ODE examples.
 */
function populateList() {
    const listEl = document.getElementById('list');
    deExamples.forEach((ex, idx) => {
        const li = document.createElement('li');
        li.textContent = ex.title;
        li.className = 'example-item';
        li.dataset.index = idx;
        li.addEventListener('click', () => selectExample(idx));
        listEl.appendChild(li);
    });
}

/**
 * Render the selected example: ODE, solution, description, and graph.
 */
function selectExample(index) {
    const ex = deExamples[index];

    // Highlight active list item
    document.querySelectorAll('.example-item').forEach(item => {
        item.classList.toggle('active', item.dataset.index == index);
    });

    // Fill LaTeX fields
    document.getElementById('ode').innerHTML = `\\[ ${ex.ode} \\]`;
    document.getElementById('solution').innerHTML = `\\[ ${ex.solution} \\]`;
    document.getElementById('description').textContent = ex.description;

    // Re‑render MathJax
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise();
    }

    // Draw graph with several solution curves
    drawGraph(ex);
}

/**
 * Draw the solution curves for the given example.
 */
function drawGraph(ex) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    const xMin = -5;
    const xMax = 5;
    const step = 0.05;
    const xs = [];
    for (let x = xMin; x <= xMax; x += step) {
        xs.push(parseFloat(x.toFixed(5)));
    }

    // Build datasets for each constant
    const datasets = ex.constants.map((C, i) => {
        const fn = ex.solFn(C);
        const ys = xs.map(x => fn(x));
        const colors = [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)'
        ];
        return {
            label: `C = ${C}`,
            data: ys,
            borderColor: colors[i % colors.length],
            backgroundColor: colors[i % colors.length],
            fill: false,
            tension: 0.1,
            pointRadius: 0
        };
    });

    const data = {
        labels: xs.map(v => v.toFixed(2)),
        datasets: datasets
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'x' }
                },
                y: {
                    title: { display: true, text: 'y' }
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    };

    // Destroy previous chart if any
    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, config);
}

// Initialise page
document.addEventListener('DOMContentLoaded', () => {
    populateList();
    // Auto‑select first example
    if (deExamples.length > 0) {
        selectExample(0);
    }
});
