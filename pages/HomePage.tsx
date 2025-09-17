import React, { useState, useEffect, useCallback } from 'react';
import type { Channel, EpgProgram } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';
import { getEpg } from '../services/iptvService';

interface HomePageProps {
  selectedChannel: Channel | null;
}

const EpgList: React.FC<{ programs: EpgProgram[], isLoading: boolean }> = ({ programs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-slate-800 rounded-lg">
        <p className="text-center text-gray-400">Loading EPG...</p>
      </div>
    );
  }

  if (programs.length === 0) {
      return (
          <div className="mt-6 bg-slate-800/50 rounded-lg shadow-inner p-4">
              <h2 className="text-xl font-semibold mb-2 text-blue-300">Program Guide</h2>
              <p className="text-gray-400">No program information available for this channel.</p>
          </div>
      )
  }

  return (
    <div className="mt-6 bg-slate-800/50 rounded-lg shadow-inner p-4 max-h-[50vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-blue-300 sticky top-0 bg-slate-800/50 backdrop-blur-sm py-2 -mx-4 px-4">Program Guide</h2>
      <ul className="space-y-3">
        {programs.map((program, index) => (
          <li key={index} className="p-3 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <p className="font-bold text-md text-white">{program.title}</p>
              <p className="text-xs sm:text-sm font-mono bg-slate-600 text-blue-200 px-2 py-1 rounded self-start sm:self-center shrink-0">{program.startTime} - {program.endTime}</p>
            </div>
            <p className="mt-2 text-gray-300 text-sm">{program.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ selectedChannel }) => {
  const [epg, setEpg] = useState<EpgProgram[]>([]);
  const [isLoadingEpg, setIsLoadingEpg] = useState<boolean>(true);

  const fetchEpg = useCallback(async (channelId: string) => {
    setIsLoadingEpg(true);
    try {
      const epgData = await getEpg(channelId);
      setEpg(epgData);
    } catch (error) {
      console.error("Failed to fetch EPG", error);
      setEpg([]);
    } finally {
      setIsLoadingEpg(false);
    }
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchEpg(selectedChannel.id);
    } else {
        setEpg([]);
        setIsLoadingEpg(false);
    }
  }, [selectedChannel, fetchEpg]);

  if (!selectedChannel) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-white">No Channel Selected</h3>
          <p className="mt-1 text-sm text-gray-400">Please select a channel from the list to start watching.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white truncate">Now Playing: {selectedChannel.name}</h1>
      <VideoPlayer src={selectedChannel.url} channelName={selectedChannel.name} />
      <EpgList programs={epg} isLoading={isLoadingEpg} />
    </div>
  );
};