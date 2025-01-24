import React from 'react';

const OtpButton = ({ submitOtp }) => {

  const handleKeyDown = (e) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      submitOtp();
    }
  };

  return (
    <div>
      <button
        onKeyDown={handleKeyDown}
        onClick={submitOtp}
        style={{ padding: '10px 20px', marginTop: '10px' }}
      >
        Verify
      </button>
    </div>
  );
};

export default OtpButton;
