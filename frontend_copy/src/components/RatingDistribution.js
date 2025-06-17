import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './RatingDistribution.css';

const RatingDistribution = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data && data.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.ratingRange),
          datasets: [
            {
              label: 'Problems Solved',
              data: data.map(item => item.count),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Problems Solved',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Problem Rating',
              },
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
    <div className="rating-distribution-chart">
      <canvas ref={chartRef} />
    </div>
  );
};

export default RatingDistribution;