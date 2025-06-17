import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './RatingGraph.css';

const RatingGraph = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data && data.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => new Date(item.date).toLocaleDateString()),
          datasets: [
            {
              label: 'Rating',
              data: data.map(item => item.rating),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => `Rating: ${context.parsed.y}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="rating-graph">
      <canvas ref={chartRef} />
    </div>
  );
};

export default RatingGraph;