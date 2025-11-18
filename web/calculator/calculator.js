/**
 * Scientific Graphing Calculator
 * -------------------------------------------------
 * Features:
 *  - Parse a user‑provided expression in terms of `x`.
 *  - Plot the function, its derivative, or a numerical integral.
 *  - Uses Math.js for parsing / differentiation.
 *  - Uses Chart.js for rendering the graph.
 */

let chartInstance = null;

// Configuration for the graph
const X_MIN = -10;
const X_MAX = 10;
const STEP = 0.05; // finer step gives smoother curves

/**
 * Generate an array of x values from X_MIN to X_MAX.
 */
function generateXValues() {
    const xs = [];
    for (let x = X_MIN; x <= X_MAX; x += STEP) {
        xs.push(parseFloat(x.toFixed(5)));
    }
    return xs;
}

/**
 * Evaluate a compiled Math.js function over an array of x values.
 * Returns an array of y values (NaN for points where evaluation fails).
 */
function evaluateFunction(compiledFn, xs) {
    return xs.map(x => {
        try {
            const y = compiledFn.evaluate({ x });
            return Number.isFinite(y) ? y : NaN;
        } catch (e) {
            return NaN;
        }
    });
}

/**
 * Compute a numerical integral of `fn` using the trapezoidal rule.
 * Returns an array of cumulative integral values at each x.
 */
function computeIntegral(fn, xs) {
    const integralVals = [];
    let cumulative = 0;
    for (let i = 0; i < xs.length; i++) {
        if (i === 0) {
            integralVals.push(0);
            continue;
        }
        const x0 = xs[i - 1];
        const x1 = xs[i];
        const y0 = fn(x0);
        const y1 = fn(x1);
        // If either endpoint is NaN, treat the area as 0 for that slice
        const area = (Number.isFinite(y0) && Number.isFinite(y1))
            ? ((y0 + y1) / 2) * (x1 - x0)
            : 0;
        cumulative += area;
        integralVals.push(cumulative);
    }
    return integralVals;
}

/**
 * Render the chart using Chart.js.
 * `xs` – array of x coordinates (as strings for labels)
 * `ys` – array of y coordinates (numbers, NaN will be skipped by Chart.js)
 * `label` – dataset label
 * `color` – line colour
 */
function renderChart(xs, ys, label, color) {
    const ctx = document.getElementById('graphCanvas').getContext('2d');

    const data = {
        labels: xs.map(v => v.toFixed(2)),
        datasets: [{
            label,
            data: ys,
            borderColor: color,
            backgroundColor: color,
            fill: false,
            tension: 0.1,
            pointRadius: 0
        }]
    };

    const config = {
        type: 'line',
        data,
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

    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, config);
}

/**
 * Main handler for the Plot button.
 */
function plot() {
    const exprInput = document.getElementById('exprInput').value.trim();
    const operation = document.getElementById('operationSelect').value;
    const formulaDiv = document.getElementById('displayFormula');

    if (!exprInput) {
        alert('Please enter a function of x.');
        return;
    }

    // Parse the expression with Math.js
    let node;
    try {
        node = math.parse(exprInput);
    } catch (e) {
        alert('Invalid expression: ' + e.message);
        return;
    }

    // Prepare x values
    const xs = generateXValues();

    // Determine what to plot
    let ys, label, color = 'rgba(54, 162, 235, 1)';

    if (operation === 'function') {
        const compiled = node.compile();
        ys = evaluateFunction(compiled, xs);
        label = `f(x) = ${exprInput}`;
        formulaDiv.innerHTML = `\\[ f(x) = ${math.parse(exprInput).toTex()} \\]`;
    } else if (operation === 'derivative') {
        // Compute symbolic derivative
        let derivativeNode;
        try {
            derivativeNode = math.derivative(node, 'x');
        } catch (e) {
            alert('Could not compute derivative: ' + e.message);
            return;
        }
        const compiled = derivativeNode.compile();
        ys = evaluateFunction(compiled, xs);
        label = `f'(x) = ${derivativeNode.toString()}`;
        formulaDiv.innerHTML = `\\[ f'(x) = ${derivativeNode.toTex()} \\]`;
        color = 'rgba(255, 99, 132, 1)';
    } else if (operation === 'integral') {
        // Numerical integral of the original function
        const compiled = node.compile();
        const fn = x => {
            try {
                const y = compiled.evaluate({ x });
                return Number.isFinite(y) ? y : NaN;
            } catch {
                return NaN;
            }
        };
        ys = computeIntegral(fn, xs);
        label = `∫ f(x) dx (numerical)`;
        formulaDiv.innerHTML = `\\[ \\int ${math.parse(exprInput).toTex()}\\,dx \\]`;
        color = 'rgba(75, 192, 192, 1)';
    }

    // Render the chart
    renderChart(xs, ys, label, color);

    // Re‑render MathJax (if present)
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise();
    }
}

// Attach event listener
document.getElementById('plotBtn').addEventListener('click', plot);
