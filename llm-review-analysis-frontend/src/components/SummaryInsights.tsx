import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Lightbulb, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Theme {
  name: string;
  count: number;
}

interface SummaryInsightsProps {
  totalReviews: number;
  posCount: number;
  negCount: number;
  topPros: Theme[];
  topCons: Theme[];
}

export const SummaryInsights = ({ 
  totalReviews, 
  posCount, 
  negCount, 
  topPros, 
  topCons 
}: SummaryInsightsProps) => {

  if (totalReviews === 0) return null;

  // 1. Calculate The Verdict
  const posRatio = posCount / totalReviews;
  let verdict = "";
  let verdictColor = "";
  let verdictBg = "";

  if (posRatio >= 0.8) {
    verdict = "Highly Recommended";
    verdictColor = "text-emerald-400";
    verdictBg = "bg-emerald-500/10 border-emerald-500/20";
  } else if (posRatio >= 0.6) {
    verdict = "Generally Positive";
    verdictColor = "text-blue-400";
    verdictBg = "bg-blue-500/10 border-blue-500/20";
  } else if (posRatio >= 0.4) {
    verdict = "Mixed Feedback";
    verdictColor = "text-yellow-400";
    verdictBg = "bg-yellow-500/10 border-yellow-500/20";
  } else {
    verdict = "Not Recommended";
    verdictColor = "text-rose-400";
    verdictBg = "bg-rose-500/10 border-rose-500/20";
  }

  // 2. Generate Dynamic Summary Text
  const topProStr = topPros.slice(0, 2).map(p => p.name.toLowerCase()).join(" and ");
  const topConStr = topCons.slice(0, 2).map(c => c.name.toLowerCase()).join(" and ");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* LEFT: The Executive Summary */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`glass-card p-8 border ${verdictBg} relative overflow-hidden`}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className={`w-6 h-6 ${verdictColor}`} />
            <h3 className="text-lg font-semibold text-slate-200">AI Executive Summary</h3>
          </div>
          
          <div className="mb-6">
            <span className="text-sm text-slate-400 uppercase tracking-wider font-medium">Market Verdict</span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-1 ${verdictColor}`}>
              {verdict}
            </h2>
          </div>

          <p className="text-slate-300 leading-relaxed text-lg">
            Based on <span className="font-semibold text-white">{totalReviews}</span> customer reviews, 
            the sentiment is predominantly <span className={posRatio > 0.5 ? "text-emerald-400" : "text-rose-400"}>
              {posRatio > 0.5 ? "positive" : "negative"}
            </span>. 
            Customers frequently praise the <span className="text-emerald-300 font-medium">{topProStr || "features"}</span>. 
            {topConStr && (
              <>
                However, there are recurring concerns regarding <span className="text-rose-300 font-medium">{topConStr}</span> that may require attention.
              </>
            )}
          </p>
        </div>

        {/* Decorative Background Glow */}
        <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full blur-3xl opacity-10 ${verdictBg.split(' ')[0].replace('/10', '')}`}></div>
      </motion.div>


      {/* RIGHT: Key Highlights List */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-8 flex flex-col justify-between"
      >
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          Key Strategic Insights
        </h3>

        <div className="space-y-6">
          {/* Top Strength */}
          <div className="flex gap-4">
            <div className="mt-1">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <ThumbsUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h4 className="text-slate-200 font-medium text-lg">Main Strength</h4>
              <p className="text-slate-400">
                The most cited advantage is <span className="text-emerald-400 font-medium">{topPros[0]?.name || "N/A"}</span>, 
                mentioned by <span className="text-white">{topPros[0]?.count || 0}</span> users.
              </p>
            </div>
          </div>

          {/* Main Weakness */}
          <div className="flex gap-4">
            <div className="mt-1">
              <div className="p-2 rounded-lg bg-rose-500/20">
                <ThumbsDown className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <h4 className="text-slate-200 font-medium text-lg">Critical Issue</h4>
              <p className="text-slate-400">
                The primary complaint revolves around <span className="text-rose-400 font-medium">{topCons[0]?.name || "N/A"}</span>, 
                flagged by <span className="text-white">{topCons[0]?.count || 0}</span> users.
              </p>
            </div>
          </div>
          
          {/* Alert Box if Negatives are high */}
          {posRatio < 0.6 && (
             <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mt-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-200 text-sm">Action Required: Improve {topCons[0]?.name || "product quality"}</span>
             </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};