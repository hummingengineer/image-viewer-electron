declare global {
  interface Window {
    api: {
      send: <T>(channel: string, data?: T) => void;
      receive: <T>(channel: string, func: (...args: T[]) => void) => void;
      remove: (channel: string) => void;
    };
  }
}

export {};
