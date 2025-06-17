import React from 'react';
import { getHeatmapData } from '../utils/helpers';
import './Heatmap.css';

const Heatmap = ({ data, days }) => {
  const { heatmapData, weekdays, monthLabels } = getHeatmapData(data, days);

  const getColorIntensity = (count) => {
    if (!count) return 'color-0';
    if (count <= 2) return 'color-1';
    if (count <= 5) return 'color-2';
    if (count <= 10) return 'color-3';
    return 'color-4';
  };

  return (
    <div className="heatmap-container">
      <div className="heatmap">
        <div className="weekday-labels">
          {weekdays.map((day, i) => (
            <div key={i} className="weekday-label">
              {day}
            </div>
          ))}
        </div>
        <div className="heatmap-grid">
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap-week">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`heatmap-day ${getColorIntensity(day.count)}`}
                  title={`${day.count || 'No'} submissions on ${day.date.toLocaleDateString()}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="month-labels">
        {monthLabels.map((month, i) => (
          <div key={i} className="month-label">
            {month}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <div className="legend-item">
          <span className="color-box color-0" />
          <span>0</span>
        </div>
        <div className="legend-item">
          <span className="color-box color-1" />
          <span>1-2</span>
        </div>
        <div className="legend-item">
          <span className="color-box color-2" />
          <span>3-5</span>
        </div>
        <div className="legend-item">
          <span className="color-box color-3" />
          <span>6-10</span>
        </div>
        <div className="legend-item">
          <span className="color-box color-4" />
          <span>10+</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;