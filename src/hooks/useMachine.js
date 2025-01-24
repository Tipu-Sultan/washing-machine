import { Disc3, Droplet, WashingMachine } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import spin from '../assets/spin.mp3'
import wash from '../assets/wash.mp3'
import drainWater from '../assets/drain.mp3'



// Helper function to convert seconds into hh:mm:ss format
const formatTime = (totalSeconds) => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");

  return `${hrs}:${mins}:${secs}`;
};

// Helper function to get mode durations (in seconds)
const getModeDurations = (mode, waterLevel) => {
  const baseDurations = {
    normal: { wash: 20, rinse: 13, spin: 9, drain: 3, total: 45 },
    quick: { wash: 0.5, rinse: 0.5, spin: 0.5, drain: 0.5, total: 2 },
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
  if (audioRef.current) {
    audioRef.current.pause(); 
    audioRef.current.currentTime = 0;
  }
  audioRef.current = new Audio(src);
  audioRef.current.play();
};

export const useWashingMachine = () => {
  const audioRef = useRef(null);
  const [currentState, setCurrentState] = useState(null);
  const [Icon, setIcon] = useState(WashingMachine);
  const [mode, setMode] = useState("normal");
  const [functions, setFunctions] = useState([]);
  const [waterLevel, setWaterLevel] = useState(1);
  const [clothes, setClothes] = useState([]);
  const [timer, setTimer] = useState(0);
  const [displayTimer, setDisplayTimer] = useState("00:00:00");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("Machine is off.");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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

    const confirmedTimer =
      selectedTime + (realTimer.waterTime + realTimer.drain);
    setTimer(confirmedTimer * 60);
    setDisplayTimer(formatTime(confirmedTimer));
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
    setCurrentState(WashingMachine)
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
    setCurrentState(WashingMachine)
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
      const rinseEnd = functions.includes("rinse") ? washEnd + durations.rinse * 60 : washEnd;
      const drainEnd = rinseEnd + durations.drain * 60; // Drain is always included
      const spinEnd = functions.includes("spin") ? drainEnd + durations.spin * 60 : drainEnd;
      const totalTime = spinEnd; // Total time depends on the selected functions
  
      const elapsedTime = totalTime - timer; // Time elapsed in seconds
  
      // Determine the current stage based on elapsed time and selected functions
      if (elapsedTime < washEnd && functions.includes("wash")) {
        playAudio(wash,audioRef);
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
        playAudio(drainWater,audioRef);
        setCurrentState("drain");
        setIcon(Droplet);
        setMessage(
          `Water is draining. Time left: ${formatTime(drainEnd - elapsedTime)}`
        );
      } else if (elapsedTime < spinEnd && functions.includes("spin")) {
        playAudio(spin,audioRef);
        setCurrentState("spin");
        setIcon(Disc3);
        setMessage(
          `Machine is spinning. Time left: ${formatTime(spinEnd - elapsedTime)}`
        );
      } else if (elapsedTime >= totalTime - 3) {
        setMessage("Washing completed!");
        setCurrentState(WashingMachine);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    } else if (timer === 0 && isRunning) {
      setMessage("Washing completed!");
      setCurrentState(WashingMachine);
    }
      
  }, [isRunning, timer, functions, mode, waterLevel]);
  
  

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
