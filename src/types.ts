export interface ScanLog {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export interface SSLResult {
  valid: boolean;
  issuer: string;
  expiryDate: string;
  daysUntilExpiry: number;
  protocol: string;
  score: number;
}

export interface SecurityHeaders {
  hsts: boolean;
  csp: boolean;
  xFrameOptions: boolean;
  permissionsPolicy: boolean;
  xContentTypeOptions: boolean;
  referrerPolicy: boolean;
  score: number;
}

export interface TechStack {
  server: string;
  framework: string[];
  cms: string | null;
  score: number;
}

export interface Reputation {
  safe: boolean;
  threats: string[];
  score: number;
}

export interface ScanResults {
  url: string;
  ssl: SSLResult;
  headers: SecurityHeaders;
  techStack: TechStack;
  reputation: Reputation;
  overallScore: number;
  scanDate: string;
}

export type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';
