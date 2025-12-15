import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Loader2,
  Sparkles,
  Upload,
  ChevronDown,
  Package,
} from "lucide-react";
import axios from "axios";
import { SentimentPieChart } from "./charts/SentimentPieChart";
import { ThemesBarChart } from "./charts/ThemesBarChart";
import { SummaryInsights } from "./SummaryInsights";
import { Button } from "./ui/button";

/* ---------------------------------------
   TYPES
----------------------------------------*/
interface Review {
  sentiment: string;
  summary: string;
  pros: string[];
  cons: string[];
  review: {
    productName: string;
    reviewText: string;
  };
}

interface DashboardProps {
  batchId: string;
  onReset: () => void;
}

/* ---------------------------------------
   DASHBOARD
----------------------------------------*/
export const Dashboard = ({ batchId, onReset }: DashboardProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [batchStatus, setBatchStatus] = useState<string>("PROCESSING");
  const [isPolling, setIsPolling] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<string>("All Products");

  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  /* ---------------------------------------
      FETCHING + POLLING
  ----------------------------------------*/
  const fetchData = async () => {
    try {
      const [statsRes, reviewsRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/dashboard/${batchId}/stats`),
        axios.get(`http://localhost:8080/api/dashboard/${batchId}/reviews`),
      ]);

      setReviews(reviewsRes.data || []);

      const currentStatus = statsRes.data.status || "PROCESSING";
      setBatchStatus(currentStatus);

      if (currentStatus === "COMPLETED") {
        setIsPolling(false);
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    pollingInterval.current = setInterval(() => isPolling && fetchData(), 2000);

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [batchId, isPolling]);

  const handleRefresh = () => {
    setIsPolling(true);
    fetchData();
  };

  /* ---------------------------------------
      PRODUCT DROPDOWN
  ----------------------------------------*/
  const productList = useMemo(() => {
    if (!reviews.length) return [];
    return Array.from(
      new Set(reviews.map((r) => r.review?.productName || "Unknown"))
    ).sort();
  }, [reviews]);

  useEffect(() => {
    if (productList.length === 1 && selectedProduct === "All Products") {
      setSelectedProduct(productList[0]);
    }
  }, [productList, selectedProduct]);

  const filteredReviews = useMemo(() => {
    if (selectedProduct === "All Products") return reviews;
    return reviews.filter((r) => r.review?.productName === selectedProduct);
  }, [reviews, selectedProduct]);

  /* ---------------------------------------
      SENTIMENT STATS
  ----------------------------------------*/
  const stats = useMemo(() => {
    let pos = 0,
      neg = 0,
      neu = 0;

    filteredReviews.forEach((r) => {
      const s = (r.sentiment || "").toLowerCase();
      if (s === "positive") pos++;
      else if (s === "negative") neg++;
      else neu++;
    });

    return {
      posCount: pos,
      negCount: neg,
      neuCount: neu,
      total: filteredReviews.length,
    };
  }, [filteredReviews]);

  /* ---------------------------------------
      THEMES
  ----------------------------------------*/
  const topThemes = useMemo(() => {
    if (!filteredReviews.length) return { pros: [], cons: [] };

    const prosCounts: Record<string, number> = {};
    const consCounts: Record<string, number> = {};

    filteredReviews.forEach((review) => {
      review.pros?.forEach((pro) => {
        prosCounts[pro] = (prosCounts[pro] || 0) + 1;
      });
      review.cons?.forEach((con) => {
        consCounts[con] = (consCounts[con] || 0) + 1;
      });
    });

    const top5 = (obj: Record<string, number>) =>
      Object.entries(obj)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    return { pros: top5(prosCounts), cons: top5(consCounts) };
  }, [filteredReviews]);

  /* ---------------------------------------
      LOADER (FIRST LOAD ONLY)
  ----------------------------------------*/
  if (reviews.length === 0 && batchStatus === "PROCESSING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f13]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10" />
          </div>
          <h3 className="text-xl font-semibold text-white">Starting Analysis</h3>
          <p className="text-slate-400">Connecting to AI engine...</p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------
      ANIMATION VARIANTS
  ----------------------------------------*/
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  /* ---------------------------------------
      DASHBOARD UI
  ----------------------------------------*/
  return (
    <div className="min-h-screen p-6 md:p-12 overflow-y-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* ---------------------------------------------------
            HEADER
        ----------------------------------------------------*/}
        <motion.div
          variants={itemVariants}
          className="glass-layer p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.07)]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

            {/* LEFT SIDE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-slate-400 uppercase tracking-wider">
                  AI Analysis Report
                </span>
              </div>

              {/* PRODUCT TITLE */}
              <div className="flex items-center gap-3">
                {productList.length > 1 ? (
                  <div className="relative group">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="bg-transparent text-4xl font-bold text-white border-b border-white/20 focus:border-blue-500 transition focus:outline-none pr-12 pb-1 cursor-pointer"
                    >
                      <option className="bg-slate-900" value="All Products">
                        All Products
                      </option>
                      {productList.map((p) => (
                        <option key={p} className="bg-slate-900" value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 bottom-2 w-6 h-6 text-slate-500 group-hover:text-blue-500 transition" />
                  </div>
                ) : (
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    {productList[0] || "Processing..."}
                  </h1>
                )}
              </div>

              {/* STATUS BAR */}
              <div className="flex items-center gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4" /> {stats.total} Total Reviews
                </span>

                {batchStatus === "PROCESSING" && (
                  <span className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-500/20 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Live Analysis Running
                  </span>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="glass-layer border border-white/10 hover:bg-white/10 text-white gap-2 h-12 px-6"
              >
                <RefreshCw className="w-4 h-4" /> Refresh Data
              </Button>

              <Button
                onClick={onReset}
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 gap-2 h-12 px-6 rounded-xl"
              >
                <Upload className="w-4 h-4" /> New Upload
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ---------------------------------------------------
            STATS CARDS
        ----------------------------------------------------*/}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* CARD 1 */}
          <div className="glass-layer rounded-3xl p-6 relative overflow-hidden group border border-white/10">
            <MessageSquare className="absolute right-0 top-0 opacity-10 w-24 h-24 text-blue-400 group-hover:opacity-20 transition" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-slate-400 font-medium">Filtered Volume</span>
            </div>
            <p className="text-4xl font-bold text-white">{stats.total}</p>
          </div>

          {/* CARD 2 */}
          <div className="glass-layer rounded-3xl p-6 relative overflow-hidden group border border-white/10">
            <TrendingUp className="absolute right-0 top-0 opacity-10 w-24 h-24 text-emerald-400 group-hover:opacity-20 transition" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-slate-400 font-medium">Positive Rate</span>
            </div>
            <p className="text-4xl font-bold text-emerald-400">
              {stats.total
                ? Math.round((stats.posCount / stats.total) * 100)
                : 0}
              %
            </p>
          </div>

          {/* CARD 3 — FIXED */}
          <div className="glass-layer rounded-3xl p-6 relative overflow-hidden group border border-white/10">
            <BarChart3
              className="absolute right-0 top-0 opacity-10 w-24 h-24 text-rose-400 group-hover:opacity-20 transition-all duration-300"
            />

            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-slate-400 font-medium">Negative Rate</span>
            </div>

            <p className="text-4xl font-bold text-rose-400">
              {stats.total
                ? Math.round((stats.negCount / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
        </motion.div>

        {/* ---------------------------------------------------
            CHARTS SECTION
        ----------------------------------------------------*/}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* PIE CHART */}
          <div className="glass-layer rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Sentiment Distribution
            </h3>
            <SentimentPieChart
              data={{
                Positive: stats.posCount,
                Negative: stats.negCount,
                Neutral: stats.neuCount,
              }}
            />
          </div>

          {/* THEMES CHART */}
          <div className="glass-layer rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Top Recurring Themes
            </h3>
            <ThemesBarChart
              pros={topThemes.pros}
              cons={topThemes.cons}
            />
          </div>
        </motion.div>

        {/* ---------------------------------------------------
            SUMMARY SECTION
        ----------------------------------------------------*/}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Summary & Recommendations
            </h2>
          </div>

          <SummaryInsights
            totalReviews={stats.total}
            posCount={stats.posCount}
            negCount={stats.negCount}
            topPros={topThemes.pros}
            topCons={topThemes.cons}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
