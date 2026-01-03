import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, RefreshCw } from 'lucide-react';
import { TerminalLog } from './components/TerminalLog';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ScanLog, ScanResults, ScanStatus } from './types';
import { createLog, simulateScanProgress } from './utils/scanUtils';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [error, setError] = useState<string>('');

  const addLog = (log: ScanLog) => {
    setLogs((prev) => [...prev, log]);
  };

  const performScan = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    setError('');
    setStatus('scanning');
    setLogs([]);
    setResults(null);

    simulateScanProgress(addLog, async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/security-scanner`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error('Failed to perform security scan');
        }

        const data: ScanResults = await response.json();
        setResults(data);
        setStatus('complete');
      } catch (err) {
        addLog(createLog('Scan failed: ' + (err as Error).message, 'error'));
        setStatus('error');
        setError('Failed to complete security scan. Please try again.');
      }
    });
  };

  const resetScan = () => {
    setStatus('idle');
    setLogs([]);
    setResults(null);
    setError('');
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              SENTINEL
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Digital Command Center for Web Security & Infrastructure Diagnostics
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-black/40 backdrop-blur-sm border-2 border-cyan-900/30 rounded-lg p-8 shadow-2xl">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && performScan()}
                      placeholder="https://example.com"
                      className="w-full bg-black/50 border-2 border-cyan-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={performScan}
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/50"
                >
                  Initiate Security Scan
                </motion.button>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400">SSL/TLS</div>
                    <div className="text-xs text-gray-400 mt-1">Certificate Analysis</div>
                  </div>
                  <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400">Headers</div>
                    <div className="text-xs text-gray-400 mt-1">Security Audit</div>
                  </div>
                  <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400">Stack</div>
                    <div className="text-xs text-gray-400 mt-1">Tech Fingerprint</div>
                  </div>
                  <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400">Reputation</div>
                    <div className="text-xs text-gray-400 mt-1">Threat Intel</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(status === 'scanning' || status === 'error') && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-black/40 backdrop-blur-sm border-2 border-cyan-900/30 rounded-lg p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Scanning Target</h2>
                    <p className="text-cyan-400 font-mono text-sm mt-1">{url}</p>
                  </div>
                  {status === 'scanning' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <RefreshCw className="w-8 h-8 text-cyan-400" />
                    </motion.div>
                  )}
                </div>

                <TerminalLog logs={logs} />

                {status === 'error' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetScan}
                    className="mt-6 w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    Retry Scan
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {status === 'complete' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              <ResultsDashboard results={results} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetScan}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/50"
                >
                  Scan Another Target
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-mono">
        v1.0.0 | SENTINEL DIAGNOSTICS
      </div>
    </div>
  );
}

export default App;
