import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from './ui/badge';

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

interface ReviewListProps {
  reviews: Review[];
}

const SentimentBadge = ({ sentiment }: { sentiment: string }) => {
  const normalized = sentiment.toLowerCase();
  
  if (normalized === 'positive') {
    return (
      <Badge variant="outline" className="sentiment-positive border">
        Positive
      </Badge>
    );
  }
  if (normalized === 'negative') {
    return (
      <Badge variant="outline" className="sentiment-negative border">
        Negative
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="sentiment-neutral border">
      Neutral
    </Badge>
  );
};

export const ReviewList = ({ reviews }: ReviewListProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No reviews available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass-card-hover overflow-hidden"
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full p-4 flex items-center gap-4 text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-medium text-foreground truncate">
                  {review.review.productName}
                </h4>
                <SentimentBadge sentiment={review.sentiment} />
              </div>
              <p className="text-muted-foreground text-sm line-clamp-1">
                {review.summary}
              </p>
            </div>
            <motion.div
              animate={{ rotate: expandedIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-2 border-t border-border/50">
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">
                      Full Review
                    </h5>
                    <p className="text-foreground text-sm leading-relaxed">
                      {review.review.reviewText}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {review.pros.length > 0 && (
                      <div className="p-3 rounded-lg bg-positive/10 border border-positive/20">
                        <div className="flex items-center gap-2 mb-2">
                          <ThumbsUp className="w-4 h-4 text-positive" />
                          <span className="text-positive text-sm font-medium">Pros</span>
                        </div>
                        <ul className="space-y-1">
                          {review.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-foreground/80">
                              • {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {review.cons.length > 0 && (
                      <div className="p-3 rounded-lg bg-negative/10 border border-negative/20">
                        <div className="flex items-center gap-2 mb-2">
                          <ThumbsDown className="w-4 h-4 text-negative" />
                          <span className="text-negative text-sm font-medium">Cons</span>
                        </div>
                        <ul className="space-y-1">
                          {review.cons.map((con, i) => (
                            <li key={i} className="text-sm text-foreground/80">
                              • {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};
