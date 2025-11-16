export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  group: string;
}

export interface ChatMessage {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

export enum Page {
  HOME = 'HOME',
  CHANNEL_LIST = 'CHANNEL_LIST',
  SETTINGS = 'SETTINGS',
}