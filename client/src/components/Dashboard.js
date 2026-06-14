import React from 'react';
import Analysis from './Analysis';


export const Dashboard = () => {

  return (
    <div>
        <h1 className="font-condensed text-3xl font-bold mb-6 text-center text-custom-blue mt-6">
          Welcome to Your Dashboard
        </h1>
        <h2><Analysis/></h2>
        
    </div>
  );
};
