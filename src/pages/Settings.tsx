
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Settings | FinAI</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your account preferences</p>
        
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <p className="text-lg text-gray-600">Settings feature coming soon</p>
          <p className="mt-2 text-gray-500">This feature is under development</p>
        </div>
      </div>
    </>
  );
};

export default Settings;
