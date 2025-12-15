import { motion } from "framer-motion";
import {
  Upload,
  Cog,
  BarChart2,
  BrainCircuit,
  CheckCircle,
} from "lucide-react";

export const UploadTimeline = () => {
  const steps = [
    { label: "Uploading", icon: Upload },
    { label: "Validating", icon: Cog },
    { label: "Extracting", icon: BarChart2 },
    { label: "AI Analysis", icon: BrainCircuit },
    { label: "Completed", icon: CheckCircle },
  ];

  return (
    <div className="w-full max-w-xl flex flex-col items-center mt-10 select-none">
      
      {/* ———————————— ICON STEPPER ———————————— */}
      <div className="relative flex items-center justify-between w-full px-6">
        
        {/* Progress Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-blue-400 to-pink-400 rounded-full opacity-60"
        />

        {/* Step Icons */}
        <div className="relative flex w-full justify-between z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0.3, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-full
                    backdrop-blur-xl border border-white/10 shadow-md
                    transition-all duration-300
                    ${
                      isLast
                        ? "bg-green-500/20 shadow-green-500/20 text-green-400"
                        : "bg-white/5 text-blue-300"
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ———————————— LABEL ROW ———————————— */}
      <div className="flex justify-between w-full px-4 mt-6">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <p
              key={index}
              className={`
                text-xs font-medium text-center w-20
                ${isLast ? "text-green-400" : "text-slate-400"}
              `}
            >
              {step.label}
            </p>
          );
        })}
      </div>
    </div>
  );
};
