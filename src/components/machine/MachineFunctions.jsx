import React from "react";

const MachineFunctions = ({ isRunning, toggleFunction, functions }) => {
  return (
    <>
      {/* Functions */}
      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-700 mb-2">Functions</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={() => toggleFunction("wash")}
              checked={functions.includes("wash")}
              disabled={isRunning}
              className="mr-2"
            />
            Wash
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={() => toggleFunction("rinse")}
              checked={functions.includes("rinse")}
              disabled={isRunning}
              className="mr-2"
            />
            Rinse
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={() => toggleFunction("spin")}
              checked={functions.includes("spin")}
              disabled={isRunning}
              className="mr-2"
            />
            Spin
          </label>
        </div>
      </div>
    </>
  );
};

export default MachineFunctions;
