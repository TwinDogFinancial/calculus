/**
 * Differential Equations Explorer
 * ---------------
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
    },
    {
        title: "dy/dx = \\cos(x)",
        ode: "\\frac{dy}{dx} = \\cos(x)",
        solution: "y = \\sin(x) + C",
        description: "Integrate: ∫dy = ∫cos(x)dx → y = sin(x) + C.",
        solFn: C => x => Math.sin(x) + C,
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = y^{2}",
        ode: "\\frac{dy}{dx} = y^{2}",
        solution: "y = \\frac{-1}{x + C}",
        description: "Separate variables: dy/y^{2} = dx → -1/y = x + C → y = -\\frac{1}{x + C}.",
        solFn: C => x => -1 / (x + C),
        // Avoid the singularity at x = -C by choosing constants that keep the plotted range safe
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = \\tan(x)",
        ode: "\\frac{dy}{dx} = \\tan(x)",
        solution: "y = -\\ln|\\cos(x)| + C",
        description: "Integrate: ∫dy = ∫tan(x)dx → y = -\\ln|\\cos(x)| + C.",
        solFn: C => x => -Math.log(Math.abs(Math.cos(x))) + C,
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = e^{x}",
        ode: "\\frac{dy}{dx} = e^{x}",
        solution: "y = e^{x} + C",
        description: "Integrate: ∫dy = ∫e^{x}dx → y = e^{x} + C.",
        solFn: C => x => Math.exp(x) + C,
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = \\ln(x)",
        ode: "\\frac{dy}{dx} = \\ln(x)",
        solution: "y = x\\ln(x) - x + C",
        description: "Integrate by parts: ∫ln(x)dx = x\\ln(x) - x + C.",
        solFn: C => x => x * Math.log(x) - x + C,
        constants: [-2, 0, 2]
    },
    // Additional equations
    {
        title: "dy/dx = x^{3}",
        ode: "\\frac{dy}{dx} = x^{3}",
        solution: "y = \\frac{x^{4}}{4} + C",
        description: "Integrate: ∫dy = ∫x^{3}dx → y = x^{4}/4 + C.",
        solFn: C => x => (x ** 4) / 4 + C,
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = \\frac{1}{x}",
        ode: "\\frac{dy}{dx} = \\frac{1}{x}",
        solution: "y = \\ln|x| + C",
        description: "Integrate: ∫dy = ∫\\frac{1}{x}dx → y = \\ln|x| + C.",
        solFn: C => x => Math.log(Math.abs(x)) + C,
        constants: [-2, -1, 1]
    },
    {
        title: "dy/dx = y - x",
        ode: "\\frac{dy}{dx} = y - x",
        solution: "y = C\\,e^{x} + x + 1",
        description: "Linear ODE: dy/dx - y = -x. Solution via integrating factor e^{-x}.",
        solFn: C => x => C * Math.exp(x) + x + 1,
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = x\\,y^{2}",
        ode: "\\frac{dy}{dx} = x\\,y^{2}",
        solution: "y = \\frac{-1}{\\frac{x^{2}}{2} + C}",
        description: "Separate: dy/y^{2} = x dx → -1/y = x^{2}/2 + C → y = -1/(x^{2}/2 + C).",
        solFn: C => x => -1 / (0.5 * x * x + C),
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = e^{-x}",
        ode: "\\frac{dy}{dx} = e^{-x}",
        solution: "y = -e^{-x} + C",
        description: "Integrate: ∫dy = ∫e^{-x}dx → y = -e^{-x} + C.",
        solFn: C => x => -Math.exp(-x) + C,
        constants: [-2, 0, 2]
    },
    // New equations added for richer exploration
    {
        title: "dy/dx = \\sin(x) + \\cos(x)",
        ode: "\\frac{dy}{dx} = \\sin(x) + \\cos(x)",
        solution: "y = -\\cos(x) + \\sin(x) + C",
        description: "Integrate term‑wise: ∫sin(x)dx = -cos(x), ∫cos(x)dx = sin(x).",
        solFn: C => x => -Math.cos(x) + Math.sin(x) + C,
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = x^{2} + 1",
        ode: "\\frac{dy}{dx} = x^{2} + 1",
        solution: "y = \\frac{x^{3}}{3} + x + C",
        description: "Integrate: ∫(x^{2}+1)dx = x^{3}/3 + x + C.",
        solFn: C => x => (x ** 3) / 3 + x + C,
        constants: [-2, 0, 2]
    },
    {
        title: "dy/dx = \\frac{1}{1+x^{2}}",
        ode: "\\frac{dy}{dx} = \\frac{1}{1+x^{2}}",
        solution: "y = \\arctan(x) + C",
        description: "Integral of 1/(1+x^{2}) is arctan(x).",
        solFn: C => x => Math.atan(x) + C,
        constants: [-2, 0, 2]
    },
    // --------------------------------------------------------------
    // NEW WORD PROBLEM ENTRY
    // --------------------------------------------------------------
    {
        title: "Mixing tank problem",
        ode: "\\frac{dy}{dt} = -\\frac{3}{100}\\,y",
        solution: "y = 5\\,e^{-0.03 t} + C",
        description: "Word problem: A tank initially contains 100 L of water with 5 kg of dissolved salt. Fresh water flows in at 3 L/min and the well‑mixed solution flows out at the same rate. Let y(t) be the amount of salt (kg) at time t (minutes). The rate of change of salt is dy/dt = (inflow rate)·(concentration in) – (outflow rate)·(concentration out) = 0 – (3 L/min)·(y/100 L) = -(3/100) y.\\n\\nSolution steps:\\n1. Write the ODE: dy/dt = -(3/100) y.\\n2. Separate variables: dy/y = -(3/100) dt.\\n3. Integrate: ln|y| = -(3/100) t + C.\\n4. Exponentiate: y = C' e^{-(3/100) t}.\\n5. Use the initial condition y(0)=5 kg to find C' = 5.\\nThus the particular solution is y(t) = 5 e^{-0.03 t}.",
        // For plotting we treat the independent variable as x (time) and use the particular solution (C = 0)
        solFn: C => t => 5 * Math.exp(-0.03 * t) + C,
        constants: [0] // single curve (the particular solution)
    },
    // ------ NEW WORD PROBLEM: Newton's Law of Cooling ------
    {
        title: "Newton's law of cooling",
        ode: "\\frac{dy}{dt} = -k\\,(y - T_{\\text{env}})",
        solution: "y(t) = T_{\\text{env}} + C\\,e^{-k t}",
        description: "Word problem: An object with temperature y(t) cools toward ambient temperature T_{\\text{env}}. The rate of change is proportional to the difference between the object's temperature and the environment.\\n\\nSolution steps:\\n1. Write ODE: dy/dt = -k (y - T_{\\text{env}}).\\n2. Separate variables: dy/(y - T_{\\text{env}}) = -k dt.\\n3. Integrate: \\ln|y - T_{\\text{env}}| = -k t + C'.\\n4. Exponentiate: y - T_{\\text{env}} = C e^{-k t}.\\n5. Solve for y: y(t) = T_{\\text{env}} + C e^{-k t}.\\n6. Use an initial condition (e.g., y(0)=80°C, T_{\\text{env}}=20°C) to find C = 60°C.",
        // For plotting we use k = 0.07 (per minute) and ambient temperature 20°C.
        // The constant C represents (y₀ - T_env). Here we plot the case y₀ = 80°C → C = 60.
        solFn: C => t => 20 + C * Math.exp(-0.07 * t),
        constants: [60] // example constant for an initial temperature of 80°C
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
