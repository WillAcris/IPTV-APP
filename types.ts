
export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  group: string;
}

export interface EpgProgram {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
}

export enum Page {
  HOME = 'HOME',
  CHANNEL_LIST = 'CHANNEL_LIST',
  ABOUT = 'ABOUT',
}
