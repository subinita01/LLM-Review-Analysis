import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileUpload } from '@/components/FileUpload';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const [batchId, setBatchId] = useState<string | null>(null);

  const handleUploadSuccess = (id: string) => {
    setBatchId(id);
  };

  const handleReset = () => {
    setBatchId(null);
  };

  return (
    <AnimatePresence mode="wait">
      {batchId ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Dashboard batchId={batchId} onReset={handleReset} />
        </motion.div>
      ) : (
        <motion.div
          key="upload"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
        >
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
