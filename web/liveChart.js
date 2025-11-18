/**
 * Live chart displayed on the homepage.
 * Shows a single selected calculus function (e.g., x², sin(x), cos(x), tan(x), eˣ, ln(x))
 * The chart updates every second with a new point to give a "live" feel.
 * If the user does not select a function, the chart automatically cycles
 * through a predefined list of functions every 10 seconds.
 */

(function () {
    // Configuration
    const canvasId = 'liveChartCanvas';
    const updateInterval = 1000; // ms – add new point each second
    const cycleInterval = 10000; // ms – switch to next function every 10 seconds
    const xRange = { min: -5, max: 5 };
    const pointCount = 100; // total points to keep on the chart

    // Helper to generate x values evenly spaced across the range
    function generateXValues(count) {
        const xs = [];
        const step = (xRange.max - xRange.min) / (count - 1);
        for (let i = 0; i < count; i++) {
            xs.push(xRange.min + i * step);
        }
        return xs;
    }

    // Functions to plot – label, colour and the actual JavaScript function
    const functions = [
        {
            label: 'x²',
            color: 'rgba(54, 162, 235, 1)',
            fn: x => x * x
        },
        {
            label: 'sin(x)',
            color: 'rgba(255, 99, 132, 1)',
            fn: x => Math.sin(x)
        },
        {
            label: 'cos(x)',
            color: 'rgba(75, 192, 192, 1)',
            fn: x => Math.cos(x)
        },
        {
            label: 'tan(x)',
            color: 'rgba(255, 159, 64, 1)',
            fn: x => Math.tan(x)
        },
        {
            label: 'eˣ',
            color: 'rgba(153, 102, 255, 1)',
            fn: x => Math.exp(x)
        },
        {
            label: 'ln(x)',
            color: 'rgba(255, 206, 86, 1)',
            // Guard against non‑positive x (log undefined)
            fn: x => (x > 0 ? Math.log(x) : NaN)
        }
    ];

    // State
    let xs = generateXValues(pointCount);
    let currentFunctionIndex = 0; // starts with the first function
    let autoCycleTimer = null;
    let chart = null;

    // Initialise the Chart.js instance with the currently selected function
    function initChart() {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const func = functions[currentFunctionIndex];

        const dataset = {
            label: func.label,
            data: xs.map(x => func.fn(x)),
            borderColor: func.color,
            backgroundColor: func.color,
            fill: false,
            tension: 0.2,
            pointRadius: 0
        };

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xs.map(v => v.toFixed(2)),
                datasets: [dataset]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
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
                        position: 'top',
                        labels: {
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    }

    // Update the chart each second: shift data left and append a new point at the right edge
    function updateChart() {
        // Shift x values
        xs.shift();
        const newX = xs[xs.length - 1] + (xRange.max - xRange.min) / (pointCount - 1);
        xs.push(newX);

        // Update dataset
        const func = functions[currentFunctionIndex];
        chart.data.labels = xs.map(v => v.toFixed(2));
        const ds = chart.data.datasets[0];
        ds.label = func.label;
        ds.borderColor = func.color;
        ds.backgroundColor = func.color;
        ds.data.shift();
        ds.data.push(func.fn(newX));

        chart.update('none');
    }

    // Switch to a specific function (by index) and rebuild the chart data
    function switchFunction(idx) {
        if (idx < 0 || idx >= functions.length) return;
        currentFunctionIndex = idx;

        // Reset x‑values to the original range
        xs = generateXValues(pointCount);

        // Re‑initialise the chart with the new function
        if (chart) {
            chart.destroy();
        }
        initChart();
    }

    // Automatic cycling through the functions every `cycleInterval` ms
    function startAutoCycle() {
        // Clear any existing timer
        if (autoCycleTimer) clearInterval(autoCycleTimer);
        autoCycleTimer = setInterval(() => {
            const nextIdx = (currentFunctionIndex + 1) % functions.length;
            // Update the dropdown to reflect the new selection
            const selectEl = document.getElementById('equationSelect');
            if (selectEl) selectEl.value = nextIdx;
            switchFunction(nextIdx);
        }, cycleInterval);
    }

    // Hook up the dropdown so a user can manually pick a function
    function attachDropdownHandler() {
        const selectEl = document.getElementById('equationSelect');
        if (!selectEl) return;
        // Initialise dropdown to the default function
        selectEl.value = currentFunctionIndex;

        selectEl.addEventListener('change', (e) => {
            const chosenIdx = parseInt(e.target.value, 10);
            // Stop the auto‑cycle timer and restart it so the 10‑second timer restarts
            if (autoCycleTimer) clearInterval(autoCycleTimer);
            switchFunction(chosenIdx);
            startAutoCycle();
        });
    }

    // Initialise everything
    initChart();
    attachDropdownHandler();
    startAutoCycle();
    setInterval(updateChart, updateInterval);
})();
