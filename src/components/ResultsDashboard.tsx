import { motion } from 'framer-motion';
import { Lock, Shield, Server, AlertOctagon } from 'lucide-react';
import { ScanResults } from '../types';
import { ResultCard, ResultItem } from './ResultCard';
import { SecurityScore } from './SecurityScore';

interface ResultsDashboardProps {
  results: ScanResults;
}

export const ResultsDashboard = ({ results }: ResultsDashboardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <SecurityScore score={results.overallScore} />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-400"
        >
          Scan completed for <span className="text-cyan-400 font-mono">{results.url}</span>
        </motion.p>
        <p className="text-xs text-gray-500 mt-1">{new Date(results.scanDate).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultCard title="SSL/TLS Security" icon={Lock} score={results.ssl.score} delay={0.1}>
          <ResultItem
            label="Certificate Valid"
            status={results.ssl.valid ? 'pass' : 'fail'}
            value={results.ssl.valid ? 'Valid' : 'Invalid'}
          />
          <ResultItem
            label="Issuer"
            status="pass"
            value={results.ssl.issuer}
          />
          <ResultItem
            label="Expiry Date"
            status={results.ssl.daysUntilExpiry > 30 ? 'pass' : results.ssl.daysUntilExpiry > 7 ? 'warning' : 'fail'}
            value={`${results.ssl.expiryDate} (${results.ssl.daysUntilExpiry} days)`}
          />
          <ResultItem
            label="Protocol"
            status={results.ssl.protocol.includes('TLS 1.3') || results.ssl.protocol.includes('TLS 1.2') ? 'pass' : 'warning'}
            value={results.ssl.protocol}
          />
        </ResultCard>

        <ResultCard title="Security Headers" icon={Shield} score={results.headers.score} delay={0.2}>
          <ResultItem
            label="HSTS Enabled"
            status={results.headers.hsts ? 'pass' : 'fail'}
          />
          <ResultItem
            label="Content Security Policy"
            status={results.headers.csp ? 'pass' : 'fail'}
          />
          <ResultItem
            label="X-Frame-Options"
            status={results.headers.xFrameOptions ? 'pass' : 'fail'}
          />
          <ResultItem
            label="Permissions Policy"
            status={results.headers.permissionsPolicy ? 'pass' : 'warning'}
          />
          <ResultItem
            label="X-Content-Type-Options"
            status={results.headers.xContentTypeOptions ? 'pass' : 'warning'}
          />
          <ResultItem
            label="Referrer Policy"
            status={results.headers.referrerPolicy ? 'pass' : 'warning'}
          />
        </ResultCard>

        <ResultCard title="Technology Stack" icon={Server} score={results.techStack.score} delay={0.3}>
          <ResultItem
            label="Server"
            status="pass"
            value={results.techStack.server}
          />
          {results.techStack.framework.length > 0 && (
            <ResultItem
              label="Frameworks"
              status="pass"
              value={results.techStack.framework.join(', ')}
            />
          )}
          {results.techStack.cms && (
            <ResultItem
              label="CMS"
              status="pass"
              value={results.techStack.cms}
            />
          )}
        </ResultCard>

        <ResultCard title="Reputation & Safety" icon={AlertOctagon} score={results.reputation.score} delay={0.4}>
          <ResultItem
            label="Safety Status"
            status={results.reputation.safe ? 'pass' : 'fail'}
            value={results.reputation.safe ? 'Safe' : 'Threats Detected'}
          />
          {results.reputation.threats.length > 0 ? (
            results.reputation.threats.map((threat, index) => (
              <ResultItem
                key={index}
                label={threat}
                status="fail"
              />
            ))
          ) : (
            <ResultItem
              label="No Known Threats"
              status="pass"
            />
          )}
        </ResultCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/40 backdrop-blur-sm border border-cyan-900/30 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
        <div className="space-y-2 text-sm text-gray-300">
          {!results.headers.hsts && (
            <p className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Enable HTTP Strict Transport Security (HSTS) to enforce HTTPS connections</span>
            </p>
          )}
          {!results.headers.csp && (
            <p className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Implement Content Security Policy (CSP) to prevent XSS attacks</span>
            </p>
          )}
          {!results.headers.xFrameOptions && (
            <p className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Add X-Frame-Options header to prevent clickjacking attacks</span>
            </p>
          )}
          {results.ssl.daysUntilExpiry < 30 && (
            <p className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>SSL certificate expires soon. Renew immediately to avoid service disruption</span>
            </p>
          )}
          {!results.reputation.safe && (
            <p className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Domain flagged with security threats. Review and remediate immediately</span>
            </p>
          )}
          {results.overallScore >= 80 && (
            <p className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Excellent security posture. Maintain current configurations and monitor regularly</span>
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
