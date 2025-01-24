import React from 'react'

const MachineModes = ({mode,setMode,isRunning}) => {
      
  return (
    <>
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Modes</h3>
          <select
            value={mode || ''}
            onChange={(e) => setMode(e.target.value)}
            disabled={isRunning}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>Select Mode</option>
            <option value="normal">Normal</option>
            <option value="quick">Quick</option>
            <option value="blanket">Blanket</option>
          </select>
        </div>
    </>
  )
}

export default MachineModes