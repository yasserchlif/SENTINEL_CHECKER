import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  icon: LucideIcon;
  score: number;
  children: ReactNode;
  delay?: number;
}

export const ResultCard = ({ title, icon: Icon, score, children, delay = 0 }: ResultCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'border-cyan-500/50 bg-cyan-500/5';
    if (score >= 60) return 'border-yellow-500/50 bg-yellow-500/5';
    return 'border-red-500/50 bg-red-500/5';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-black/40 backdrop-blur-sm border-2 ${getScoreColor(score)} rounded-lg p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Icon className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="text-2xl font-bold text-cyan-400">{score}%</div>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );
};

interface ResultItemProps {
  label: string;
  status: 'pass' | 'fail' | 'warning';
  value?: string;
}

export const ResultItem = ({ label, status, value }: ResultItemProps) => {
  const StatusIcon = status === 'pass' ? CheckCircle : status === 'fail' ? XCircle : AlertTriangle;
  const statusColor = status === 'pass' ? 'text-cyan-400' : status === 'fail' ? 'text-red-400' : 'text-yellow-400';

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
      <div className="flex items-center gap-2">
        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
        <span className="text-gray-300 text-sm">{label}</span>
      </div>
      {value && <span className="text-gray-400 text-xs font-mono">{value}</span>}
    </div>
  );
};
