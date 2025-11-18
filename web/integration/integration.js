/**
 * Integration examples viewer.
 * This script populates the list of integration examples and displays the selected
 * integral together with its antiderivative using MathJax for LaTeX rendering.
 * It also draws a simple graph illustrating the area under the curve.
 */

const integrationExamples = [
    {
        title: "Power Rule – \\(\\int x^2\\,dx\\)",
        integral: "\\int x^{2}\\,dx",
        solution: "\\frac{x^{3}}{3}+C",
        description: "Using the power rule \\(\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1}+C\\) with \\(n=2\\).",
        // function to plot
        fn: x => x * x
    },
    {
        title: "Exponential – \\(\\int e^{x}\\,dx\\)",
        integral: "\\int e^{x}\\,dx",
        solution: "e^{x}+C",
        description: "The antiderivative of \\(e^{x}\\) is itself.",
        fn: x => Math.exp(x)
    },
    {
        title: "Sine – \\(\\int \\sin x\\,dx\\)",
        integral: "\\int \\sin x\\,dx",
        solution: "-\\cos x + C",
        description: "Since \\(\\frac{d}{dx}\\cos x = -\\sin x\\), the integral of \\(\\sin x\\) is \\(-\\cos x\\).",
        fn: x => Math.sin(x)
    },
    {
        title: "Cosine – \\(\\int \\cos x\\,dx\\)",
        integral: "\\int \\cos x\\,dx",
        solution: "\\sin x + C",
        description: "Derivative of \\(\\sin x\\) is \\(\\cos x\\).",
        fn: x => Math.cos(x)
    },
    {
        title: "Natural Log – \\(\\int \\frac{1}{x}\\,dx\\)",
        integral: "\\int \\frac{1}{x}\\,dx",
        solution: "\\ln|x| + C",
        description: "Integral of the reciprocal function.",
        // avoid singularity at 0; plot only for x>0
        fn: x => (x === 0 ? 0 : 1 / x)
    },
    {
        title: "Integration by Parts – \\(\\int x e^{x}\\,dx\\)",
        integral: "\\int x e^{x}\\,dx",
        solution: "x e^{x} - e^{x} + C",
        description: "Using \\(\\int u\\,dv = uv - \\int v\\,du\\) with \\(u = x,\\; dv = e^{x}dx\\).",
        fn: x => x * Math.exp(x)
    },
    {
        title: "Partial Fractions – \\(\\int \\frac{1}{x^{2}-1}\\,dx\\)",
        integral: "\\int \\frac{1}{x^{2}-1}\\,dx",
        solution: "\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right| + C",
        description: "Decompose \\(\\frac{1}{x^{2}-1}=\\frac{1}{2}\\left(\\frac{1}{x-1}-\\frac{1}{x+1}\\right)\\).",
        // plot the rational function, avoiding poles at x = ±1
        fn: x => {
            if (Math.abs(x - 1) < 1e-6 || Math.abs(x + 1) < 1e-6) return 0;
            return 1 / (x * x - 1);
        }
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
 * Draw a simple graph of the function and shade the area under the curve.
 * The graph is drawn on a canvas element that will be inserted into the display area.
 *
 * @param {Object} ex - The integration example object (must contain a `fn` property).
 */
function drawGraph(ex) {
    // Create or reuse a canvas element
    let canvas = document.getElementById('graphCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'graphCanvas';
        canvas.width = 500;
        canvas.height = 300;
        document.getElementById('display').appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);

    // Define the plotting range
    const xMin = -5;
    const xMax = 5;
    const yMin = -5;
    const yMax = 5;

    // Helper to convert from graph coordinates to canvas pixels
    const toCanvasX = x => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = y => height - ((y - yMin) / (yMax - yMin)) * height;

    // Draw axes
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    // X axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(xMin), toCanvasY(0));
    ctx.lineTo(toCanvasX(xMax), toCanvasY(0));
    ctx.stroke();
    // Y axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), toCanvasY(yMin));
    ctx.lineTo(toCanvasX(0), toCanvasY(yMax));
    ctx.stroke();

    // Plot the function
    ctx.strokeStyle = '#0066ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const step = (xMax - xMin) / width; // one pixel step
    let first = true;
    for (let x = xMin; x <= xMax; x += step) {
        let y = ex.fn(x);
        // Skip points that are NaN or infinite
        if (!isFinite(y)) {
            first = true;
            continue;
        }
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);
        if (first) {
            ctx.moveTo(cx, cy);
            first = false;
        } else {
            ctx.lineTo(cx, cy);
        }
    }
    ctx.stroke();

    // Shade area under the curve between x = 0 and x = 2 (if within range)
    const shadeStart = Math.max(0, xMin);
    const shadeEnd = Math.min(2, xMax);
    if (shadeEnd > shadeStart) {
        ctx.fillStyle = 'rgba(255, 165, 0, 0.4)'; // semi‑transparent orange
        ctx.beginPath();
        // Move to start point on the curve
        let yStart = ex.fn(shadeStart);
        if (!isFinite(yStart)) yStart = 0;
        ctx.moveTo(toCanvasX(shadeStart), toCanvasY(yStart));
        // Draw along the curve
        for (let x = shadeStart; x <= shadeEnd; x += step) {
            let y = ex.fn(x);
            if (!isFinite(y)) {
                // If the function blows up, break the shading
                break;
            }
            ctx.lineTo(toCanvasX(x), toCanvasY(y));
        }
        // Close the shape down to the x‑axis
        ctx.lineTo(toCanvasX(shadeEnd), toCanvasY(0));
        ctx.lineTo(toCanvasX(shadeStart), toCanvasY(0));
        ctx.closePath();
        ctx.fill();
    }
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

    // If the example provides a function, draw its graph
    if (typeof ex.fn === 'function') {
        // Append a canvas after the description and then draw
        const canvasContainer = document.createElement('div');
        canvasContainer.id = 'graphContainer';
        display.appendChild(canvasContainer);
        drawGraph(ex);
    }
}

/**
 * Initialise the page once the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    populateList();
});
