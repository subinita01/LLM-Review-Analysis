import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { UploadTimeline } from "./UploadTimeline";

interface FileUploadProps {
  onUploadSuccess: (batchId: string) => void;
}

export const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setUploadStatus("error");
      setErrorMessage("Please upload a valid CSV file");
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('https://llm-review-analysis.onrender.com/api/reviews/upload', formData);
      setUploadStatus("success");
      setTimeout(() => {
        onUploadSuccess(response.data.batchId);
      }, 900);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0c0d11]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl text-center"
      >
        {/* HEADER */}
        <div className="mb-12 space-y-3">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Sentiment Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Upload product reviews and let AI generate insights.
          </p>
        </div>

        {/* UPLOAD BOX */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative rounded-3xl p-12
            transition-all duration-300
            backdrop-blur-2xl
            border border-white/10
            bg-white/[0.03]
            shadow-[0_0_40px_rgba(0,0,0,0.45)]
            ${isDragging ? "scale-[1.02] border-blue-400/40 shadow-blue-500/20" : ""}
          `}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />

          <label htmlFor="file-upload" className="cursor-pointer">
            <AnimatePresence mode="wait">
              {/* ⏳ LOADING */}
              {isUploading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="flex flex-col items-center gap-6"
                >
                  <Loader2 className="w-14 h-14 text-blue-400 animate-spin" />
                  <div className="space-y-1">
                    <p className="text-xl font-semibold text-white">
                      Uploading & Processing…
                    </p>
                    <p className="text-slate-400 text-sm">
                      Please wait a moment
                    </p>
                  </div>

                  {/* TIMELINE */}
                  <UploadTimeline />
                </motion.div>
              ) : uploadStatus === "success" ? (
                /* ✅ SUCCESS */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="flex flex-col items-center gap-4 py-10"
                >
                  <CheckCircle className="w-16 h-16 text-green-400 drop-shadow-green" />
                  <p className="text-xl font-semibold text-green-400">
                    Upload Successful!
                  </p>
                  <p className="text-slate-400 text-sm">
                    Redirecting to dashboard…
                  </p>
                </motion.div>
              ) : uploadStatus === "error" ? (
                /* ❌ ERROR */
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="flex flex-col items-center gap-4 py-10"
                >
                  <AlertCircle className="w-16 h-16 text-red-400" />
                  <p className="text-red-400 font-medium text-lg">
                    {errorMessage}
                  </p>
                  <p className="text-slate-400 text-sm">Click to try again</p>
                </motion.div>
              ) : (
                /* 📁 DEFAULT STATE */
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Upload className="w-14 h-14 text-blue-400 opacity-80 mb-2" />
                  <p className="text-lg font-medium text-white">
                    Drag & drop your CSV file
                  </p>
                  <p className="text-slate-400 text-sm">
                    or click to browse files
                  </p>

                  {/* ACCEPTS CSV */}
                  <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-sm">CSV only</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </label>
        </motion.div>

        {/* SENTIMENT COLORS */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {["Positive", "Neutral", "Negative"].map((sent, idx) => (
            <div
              key={sent}
              className="rounded-2xl bg-white/[0.04] border border-white/10 py-4 flex flex-col items-center"
            >
              <div
                className={`w-3 h-3 rounded-full mb-2 ${
                  idx === 0
                    ? "bg-green-400"
                    : idx === 1
                    ? "bg-gray-300"
                    : "bg-rose-400"
                }`}
              />
              <p className="text-slate-300 text-sm">{sent}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
