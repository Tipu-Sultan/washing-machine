import React, { useState } from "react";

const WaterLevelIndicator = ({waterLevel,setWaterLevel}) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium text-gray-700 mb-2">Water Level</h3>
      <input
        type="range"
        min="1"
        max="5"
        value={waterLevel}
        onChange={(e) => setWaterLevel(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Low</span>
        <span>High</span>
      </div>
      <div className="text-sm text-gray-600 mt-2 text-center">
        Current Level: {waterLevel}
      </div>
    </div>
  );
};

export default WaterLevelIndicator;
