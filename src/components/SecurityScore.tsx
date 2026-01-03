import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface SecurityScoreProps {
  score: number;
}

export const SecurityScore = ({ score }: SecurityScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-cyan-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-cyan-500/20 to-cyan-600/20';
    if (score >= 60) return 'from-yellow-500/20 to-yellow-600/20';
    return 'from-red-500/20 to-red-600/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'SECURE';
    if (score >= 60) return 'MODERATE';
    return 'VULNERABLE';
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`relative w-48 h-48 mx-auto bg-gradient-to-br ${getScoreGradient(score)} rounded-full border-4 border-cyan-900/30 flex items-center justify-center`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/5 to-transparent animate-pulse"></div>

      <div className="relative z-10 text-center">
        <Shield className="w-12 h-12 mx-auto mb-2 text-cyan-400" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-5xl font-bold ${getScoreColor(score)}`}
        >
          {score}
        </motion.div>
        <div className="text-xs text-gray-400 mt-1">{getScoreLabel(score)}</div>
      </div>

      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-800"
        />
        <motion.circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className={getScoreColor(score)}
          strokeLinecap="round"
          initial={{ strokeDashoffset: 553 }}
          animate={{ strokeDashoffset: 553 - (553 * score) / 100 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          style={{
            strokeDasharray: 553,
          }}
        />
      </svg>
    </motion.div>
  );
};
