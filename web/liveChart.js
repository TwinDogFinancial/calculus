/**
 * Live chart displayed on the homepage.
 * Shows several classic calculus functions (x^2, sin(x), cos(x)) plotted together.
 * The chart updates every second with a new point to give a "live" feel.
 */

(function () {
    // Configuration
    const canvasId = 'liveChartCanvas';
    const updateInterval = 1000; // ms
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

    // Functions to plot
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
        }
    ];

    // Initial data
    const xs = generateXValues(pointCount);
    const datasets = functions.map(f => ({
        label: f.label,
        data: xs.map(x => f.fn(x)),
        borderColor: f.color,
        backgroundColor: f.color,
        fill: false,
        tension: 0.2,
        pointRadius: 0
    }));

    // Chart configuration
    const ctx = document.getElementById(canvasId).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xs.map(v => v.toFixed(2)),
            datasets: datasets
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

    // Live update: shift data left and append a new point at the right edge
    function updateChart() {
        // Shift x values
        xs.shift();
        const newX = xs[xs.length - 1] + (xRange.max - xRange.min) / (pointCount - 1);
        xs.push(newX);

        // Update each dataset
        chart.data.labels = xs.map(v => v.toFixed(2));
        chart.data.datasets.forEach((ds, idx) => {
            const fn = functions[idx].fn;
            ds.data.shift();
            ds.data.push(fn(newX));
        });

        chart.update('none');
    }

    // Start the interval timer
    setInterval(updateChart, updateInterval);
})();
