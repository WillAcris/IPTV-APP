import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-300">About This IPTV Player</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          This application is a modern, web-based IPTV player built with the power and flexibility of React and TypeScript. 
          The user interface is crafted with Tailwind CSS to be sleek, responsive, and visually appealing across all devices.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-300">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li><strong>Live Channel Streaming:</strong> Watch your favorite channels with a clean and simple video player.</li>
          <li><strong>Electronic Program Guide (EPG):</strong> See what's on now and next for the currently playing channel.</li>
          <li><strong>Organized Channel List:</strong> Browse all available channels, conveniently grouped by category.</li>
          <li><strong>Modern Tech Stack:</strong> Built with React 18, TypeScript, and styled exclusively with Tailwind CSS.</li>
          <li><strong>Intuitive Navigation:</strong> A persistent sidebar makes it easy to switch between views.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-300">A Message from the Developer</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Thank you for using this IPTV Player application! I developed this project to explore modern frontend technologies and to create a functional, beautiful, and user-friendly media experience. It was a joy to build, and I hope it provides you with a seamless way to enjoy your content.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Continuous improvement is always the goal. If you have any feedback or suggestions, please feel free to reach out. Happy watching!
        </p>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 text-center text-gray-400 dark:text-gray-500">
            <p>Crafted with ❤️ and code.</p>
        </div>
      </div>
    </div>
  );
};