interface Window {
  requestIdleCallback: (callback: Function, opts: { timeout: number }) => void;
}

