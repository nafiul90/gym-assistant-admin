import { useEffect, useRef } from "react";

const BarChart = ({ data = [], color = "#2758d1", height = 220 }) => {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        import("chart.js/auto").then(({ default: Chart }) => {
            if (!canvasRef.current) return;
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
            instanceRef.current = new Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels: data.map((d) => d.label),
                    datasets: [
                        {
                            data: data.map((d) => d.count),
                            backgroundColor: color,
                            borderRadius: 6,
                            borderSkipped: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { title: (i) => i[0].label } },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0, color: "#9ca3af" },
                            grid: { color: "rgba(0,0,0,0.04)" },
                            border: { dash: [4, 4] },
                        },
                        x: {
                            grid: { display: false },
                            ticks: { maxRotation: 45, font: { size: 11 }, color: "#9ca3af" },
                        },
                    },
                },
            });
        });
        return () => {
            instanceRef.current?.destroy();
            instanceRef.current = null;
        };
    }, [data, color]);

    return <div style={{ height }}><canvas ref={canvasRef} /></div>;
};

export default BarChart;
