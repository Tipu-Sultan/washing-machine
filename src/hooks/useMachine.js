import { Disc3, Droplet, WashingMachine } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import spinAudio from "../assets/spin.mp3";
import washAudio from "../assets/wash.mp3";
import drainWater from "../assets/drain.mp3";

// Helper function to convert seconds into hh:mm:ss format
const formatTime = (totalSeconds) => {
  // Round the totalSeconds to remove any floating point precision errors
  const roundedTotalSeconds = Math.round(totalSeconds);

  const hrs = String(Math.floor(roundedTotalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((roundedTotalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(roundedTotalSeconds % 60).padStart(2, "0");

  return `${hrs}:${mins}:${secs}`;
};

// Helper function to get mode durations (in seconds)
const getModeDurations = (mode, waterLevel) => {
  const baseDurations = {
    normal: { wash: 20, rinse: 13, spin: 9, drain: 3, total: 45 },
    quick: { wash: 1, rinse: 1, spin: 1, drain: 1, total: 4 },
    blanket: { wash: 30, rinse: 15, spin: 9, drain: 6, total: 60 },
  };

  const additionalTime = {
    1: 0,
    2: 3,
    3: 5,
    4: 7,
    5: 9,
  };

  if (!baseDurations[mode]) return null;

  const durations = { ...baseDurations[mode] };
  const extraTime = additionalTime[waterLevel] || 0;

  return {
    ...durations,
    wash: durations.wash,
    rinse: durations.rinse,
    spin: durations.spin,
    drain: durations.drain,
    waterTime: extraTime,
    total: durations.total + extraTime,
  };
};

// Validation function
const validateInputs = (mode, waterLevel, clothes) => {
  if (!mode) return "Please select a mode.";
  if (!waterLevel) return "Please select a water level.";
  if (clothes.length === 0) return "Please add clothes.";
  return null;
};

const playAudio = (src, audioRef) => {
  if (audioRef.current.src !== src) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current.src = src; // Set the new source
  }
  audioRef.current.play();
};


export const useWashingMachine = () => {
  const storedState = JSON.parse(localStorage.getItem("machineState")) || {};
  const audioRef = useRef(new Audio());
  const [currentState, setCurrentState] = useState(storedState.currentState || null);
  const [Icon, setIcon] = useState(WashingMachine);
  const [mode, setMode] = useState(storedState.mode || "normal");
  const [functions, setFunctions] = useState(storedState.functions || []);
  const [waterLevel, setWaterLevel] = useState(storedState.waterLevel || 1);
  const [clothes, setClothes] = useState(storedState.clothes || []);
  const [timer, setTimer] = useState(storedState?.timer  ||0);
  const [displayTimer, setDisplayTimer] = useState("00:00:00");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(storedState.message || "Machine is off.");
  const [isRunning, setIsRunning] = useState(storedState.isRunning || false);
  const [isPaused, setIsPaused] = useState(storedState.isPaused || false);

  useEffect(() => {
    const machineState = {displayTimer,currentState,mode,functions,waterLevel,clothes,timer,message,isRunning,isPaused};
    localStorage.setItem("machineState", JSON.stringify(machineState));
  },[displayTimer,currentState, mode, functions, waterLevel, clothes, timer, message, isRunning, isPaused]);

  useEffect(() => {
    const realTimer = getModeDurations(mode, waterLevel);
    if (!realTimer) {
      setError("Invalid mode selected.");
      setTimer(0);
      return;
    }
  
    if (functions.length === 0) {
      setError("Please select at least one function.");
      setTimer(0);
      return;
    }
  
    setError(null);
  
    const selectedTime = functions.reduce((total, func) => {
      return total + (realTimer[func] || 0);
    }, 0);
  
    const confirmedTimer = selectedTime + realTimer.waterTime + realTimer.drain;
    const confirmedTimerSeconds = confirmedTimer * 60; // Convert minutes to seconds
  
    setTimer(confirmedTimerSeconds);
    setDisplayTimer(formatTime(confirmedTimerSeconds));
  }, [mode, functions, waterLevel]);

  const toggleFunction = (fn) => {
    setFunctions((prev) =>
      prev.includes(fn) ? prev.filter((func) => func !== fn) : [...prev, fn]
    );
  };

  const startAndResumeMachine = () => {
    const validationError = validateInputs(mode, waterLevel, clothes);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (error) return;

    setMessage("Machine is running.");
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseMachine = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(true);
      setMessage("Machine is paused.");
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIcon(WashingMachine);
  };

  const stopMachine = () => {
    setFunctions([]);
    setWaterLevel(1);
    setClothes([]);
    setTimer(0);
    setDisplayTimer("00:00:00");
    setIsRunning(false);
    setIsPaused(false);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentState(null);
    setIcon(WashingMachine);
  };

  const addClothes = (newClothes) => {
    if (isRunning) {
      setError("Cannot add clothes while machine is running.");
      return;
    }
    setClothes((prev) => Array.from(new Set([...prev, ...newClothes])));
  };

  const handleAddClothes = () => {
    const newClothes =
      prompt("Enter clothes (comma-separated):")?.split(",") || [];
    addClothes(newClothes.map((item) => item.trim()));
  };

  useEffect(() => {
    if (isRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      setMessage("Washing completed!");
      stopMachine();
    }
  }, [isRunning, timer]);

  useEffect(() => {
    setDisplayTimer(formatTime(timer));
  }, [timer]);

  useEffect(() => {
    if (isRunning && timer > 0) {
      const durations = getModeDurations(mode, waterLevel);
      if (!durations) return;

      // Convert durations from minutes to seconds
      const washEnd = functions.includes("wash") ? durations.wash * 60 : 0;
      const rinseEnd = functions.includes("rinse")
        ? washEnd + durations.rinse * 60
        : washEnd;
      const drainEnd = rinseEnd + durations.drain * 60; // Drain is always included
      const spinEnd = functions.includes("spin")
        ? drainEnd + durations.spin * 60
        : drainEnd;
      const totalTime = spinEnd; // Total time depends on the selected functions

      const elapsedTime = totalTime - timer; // Time elapsed in seconds

      // Determine the current stage based on elapsed time and selected functions
      if (elapsedTime < washEnd && functions.includes("wash")) {
        setCurrentState("wash");
        setIcon(WashingMachine);
        setMessage(
          `Machine is washing . Time left: ${formatTime(washEnd - elapsedTime)}`
        );
      } else if (elapsedTime < rinseEnd && functions.includes("rinse")) {
        setCurrentState("rinse");
        setIcon(WashingMachine);
        setMessage(
          `Machine is rinsing. Time left: ${formatTime(rinseEnd - elapsedTime)}`
        );
      } else if (elapsedTime < drainEnd) {
        playAudio(drainWater, audioRef);
        setCurrentState("drain");
        setIcon(Droplet);
        setMessage(
          `Water is draining. Time left: ${formatTime(drainEnd - elapsedTime)}`
        );
      } else if (elapsedTime < spinEnd && functions.includes("spin")) {
        setCurrentState("spin");
        setIcon(Disc3);
        setMessage(
          `Machine is spinning. Time left: ${formatTime(spinEnd - elapsedTime)}`
        );
      } else if (elapsedTime === totalTime && isRunning) {
        setMessage("Washing completed!");
        stopMachine()

      }
    } else if (timer === 0 && isRunning) {
      setMessage("Washing completed!");
      stopMachine();
    }
  }, [isRunning, timer, functions, mode, waterLevel]);

  useEffect(() => {
    if (currentState === "wash") {
      playAudio(washAudio, audioRef);
    } else if (currentState === "rinse") {
      playAudio(washAudio, audioRef);
    } else if (currentState === "spin") {
      playAudio(spinAudio, audioRef);
    } else if (currentState === "drain") {
      playAudio(drainWater, audioRef);
    } else {
      stopMachine();
    }
  }, [currentState, washAudio, spinAudio, drainWater]);
  

  return {
    mode,
    setMode,
    functions,
    toggleFunction,
    waterLevel,
    setWaterLevel,
    clothes,
    handleAddClothes,
    timer: displayTimer,
    Icon,
    isRunning,
    isPaused,
    currentState,
    startAndResumeMachine,
    pauseMachine,
    stopMachine,
    error,
    message,
  };
};
