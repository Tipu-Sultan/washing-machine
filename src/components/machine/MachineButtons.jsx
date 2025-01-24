import React from "react";

const MachineButtons = ({ handleAddClothes, isRunning, isPaused, startAndResumeMachine, pauseMachine, stopMachine }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      {isRunning ? (
        <button
          onClick={pauseMachine}
          className="py-2 px-4 rounded text-white bg-yellow-400 hover:bg-yellow-600"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={startAndResumeMachine}
          className="py-2 px-4 rounded text-white bg-green-500 hover:bg-green-600"
        >
          Start
        </button>
      )}
      <button
        onClick={stopMachine}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Stop
      </button>
      <button
        onClick={handleAddClothes}
        disabled={isRunning}
        className={`py-2 px-4 rounded text-white ${
          isRunning
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        Add Clothes
      </button>
    </div>
  );
};

export default MachineButtons;
