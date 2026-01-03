import { motion, AnimatePresence } from 'framer-motion';
import { ScanLog } from '../types';

interface TerminalLogProps {
  logs: ScanLog[];
}

export const TerminalLog = ({ logs }: TerminalLogProps) => {
  const getLogColor = (type: ScanLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-cyan-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-cyan-900/30 rounded-lg p-6 h-64 overflow-y-auto font-mono text-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-900/30">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-cyan-400 text-xs">SECURITY_DIAGNOSTICS.sh</span>
      </div>

      <AnimatePresence mode="popLayout">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-2 ${getLogColor(log.type)}`}
          >
            <span className="text-cyan-500">[{'>'}]</span> {log.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
