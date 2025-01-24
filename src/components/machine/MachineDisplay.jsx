const MachineDisplay = ({currentState, isRunning,Icon,timer, message, error }) => {
  return (
    <div className="bg-black text-white p-4 rounded-lg mb-6">
      {/* Timer Display */}
      {timer && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Time Remaining</h3>
          <div className="text-xl font-bold">
            {timer}
            <Icon size={24}               
            className={currentState === "spin" ? "animate-spin" : ""}
            color={isRunning ? "green" : "gray"} />
          </div>
        </div>
      )}

      {/* Status Messages */}
      {message && (
        <div className="text-blue-400 text-sm font-medium mb-2">{message}</div>
      )}

      {error && <div className="text-red-400 text-sm font-medium">{error}</div>}
    </div>
  );
};

export default MachineDisplay;
