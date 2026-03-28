import { useEffect, useRef } from "react";

/**
 * Donut chart with center label text.
 * data: [{ label, value, color }]
 * centerText: string shown in the middle
 */
const DonutChart = ({ data = [], centerText = "", height = 200 }) => {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        import("chart.js/auto").then(({ default: Chart }) => {
            if (!canvasRef.current) return;
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }

            // Custom plugin to draw center text
            const centerTextPlugin = {
                id: "centerText",
                beforeDraw(chart) {
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return;
                    const cx = (chartArea.left + chartArea.right) / 2;
                    const cy = (chartArea.top + chartArea.bottom) / 2;
                    ctx.save();
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.font = "bold 26px Inter, sans-serif";
                    ctx.fillStyle = "#1a1a2e";
                    ctx.fillText(centerText, cx, cy - 8);
                    ctx.font = "12px Inter, sans-serif";
                    ctx.fillStyle = "#9ca3af";
                    ctx.fillText("online", cx, cy + 14);
                    ctx.restore();
                },
            };

            instanceRef.current = new Chart(canvasRef.current, {
                type: "doughnut",
                data: {
                    labels: data.map((d) => d.label),
                    datasets: [
                        {
                            data: data.map((d) => d.value),
                            backgroundColor: data.map((d) => d.color),
                            borderWidth: 3,
                            borderColor: "#fff",
                            hoverOffset: 6,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "68%",
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) =>
                                    ` ${ctx.label}: ${ctx.parsed}`,
                            },
                        },
                    },
                },
                plugins: [centerTextPlugin],
            });
        });
        return () => {
            instanceRef.current?.destroy();
            instanceRef.current = null;
        };
    }, [data, centerText]);

    return <div style={{ height }}><canvas ref={canvasRef} /></div>;
};

export default DonutChart;
