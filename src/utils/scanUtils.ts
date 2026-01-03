import { ScanLog } from '../types';

export const generateScanId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createLog = (message: string, type: ScanLog['type'] = 'info'): ScanLog => {
  return {
    id: generateScanId(),
    message,
    type,
    timestamp: Date.now(),
  };
};

export const simulateScanProgress = (
  onLog: (log: ScanLog) => void,
  onComplete: () => void
) => {
  const stages = [
    { message: 'Initializing security scan...', type: 'info' as const, delay: 300 },
    { message: 'Resolving DNS and establishing connection...', type: 'info' as const, delay: 600 },
    { message: 'Fetching SSL/TLS certificate...', type: 'info' as const, delay: 900 },
    { message: 'Analyzing certificate chain and protocols...', type: 'success' as const, delay: 1200 },
    { message: 'Scanning security headers...', type: 'info' as const, delay: 1500 },
    { message: 'Evaluating Content Security Policy...', type: 'success' as const, delay: 1800 },
    { message: 'Fingerprinting technology stack...', type: 'info' as const, delay: 2100 },
    { message: 'Detecting server and framework signatures...', type: 'success' as const, delay: 2400 },
    { message: 'Performing reputation check...', type: 'info' as const, delay: 2700 },
    { message: 'Querying threat intelligence databases...', type: 'success' as const, delay: 3000 },
    { message: 'Calculating security score...', type: 'info' as const, delay: 3300 },
    { message: 'Scan complete. Generating report...', type: 'success' as const, delay: 3600 },
  ];

  stages.forEach((stage, index) => {
    setTimeout(() => {
      onLog(createLog(stage.message, stage.type));
      if (index === stages.length - 1) {
        setTimeout(onComplete, 500);
      }
    }, stage.delay);
  });
};
