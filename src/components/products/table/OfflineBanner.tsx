
import React from 'react';

const OfflineBanner = () => {
  return (
    <div className="bg-amber-50 p-3 border-b text-sm text-amber-800">
      <p className="flex items-center">
        <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
        Offline mode: Data may be outdated. Changes will be saved locally.
      </p>
    </div>
  );
};

export default OfflineBanner;
