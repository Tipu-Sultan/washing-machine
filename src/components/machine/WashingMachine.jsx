import React from "react";
import { useWashingMachine } from "../../hooks/useMachine";
import WaterLevelIndicator from "./WaterLevelIndicator";
import MachineFunctions from "./MachineFunctions";
import MachineButtons from "./MachineButtons";
import MachineModes from "./MachineModes";
import MachineDisplay from "./MachineDisplay";

export default function WashingMachine() {
  const {
    mode,
    setMode,
    waterLevel,
    setWaterLevel,
    clothes,
    handleAddClothes,
    timer,
    isRunning,
    isPaused,
    currentState,
    startAndResumeMachine,
    pauseMachine,
    stopMachine,
    toggleFunction,
    functions,
    error,
    message,
    Icon,
  } = useWashingMachine();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Homo Modern Washing Machine
      </h1>

      {/* Control Panel */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 md:w-1/2">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Control Panel
          </h2>
        </div>

        {/* Machine Display */}
        <MachineDisplay
          timer={timer}
          message={message}
          error={error}
          Icon={Icon}
          isRunning={isRunning}
          currentState={currentState}
        />

        {/* Buttons */}
        <div className="mb-6">
          <MachineButtons
            handleAddClothes={handleAddClothes}
            isRunning={isRunning}
            isPaused={isPaused}
            startAndResumeMachine={startAndResumeMachine}
            pauseMachine={pauseMachine}
            stopMachine={stopMachine}
          />
        </div>

        {/* Functions */}
        <div className="mb-6">
          <MachineFunctions
            isRunning={isRunning}
            toggleFunction={toggleFunction}
            functions={functions}
          />
        </div>

        {/* Water Level */}
        <div className="mb-6">
          <WaterLevelIndicator
            waterLevel={waterLevel}
            setWaterLevel={setWaterLevel}
          />
        </div>

        {/* Modes */}
        <div className="mb-6">
          <MachineModes mode={mode} setMode={setMode} isRunning={isRunning} />
        </div>

        {/* Clothes */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Clothes</h3>
          <ul className="list-disc list-inside text-gray-600">
            {clothes.length > 0 ? (
              clothes.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No clothes added</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
