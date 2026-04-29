declare global {
  interface Window {
    AbaPayway: {
      checkout: () => void;
    };
  }
}

export {};