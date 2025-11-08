import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface TranscriptDisplayProps {
  messages: Message[];
  userTranscriptLive: string;
}

const TranscriptDisplay = ({ messages, userTranscriptLive }: TranscriptDisplayProps) => {
  if (messages.length === 0 && !userTranscriptLive) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-soft p-4 max-w-2xl mx-auto max-h-60 mb-4"
    >
      <div className="mb-2 text-xs uppercase font-medium text-muted-foreground tracking-wide">
        Conversation History
      </div>
      <ScrollArea className="h-40">
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-lg px-3 py-2 text-sm
                  ${msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                  }
                `}
              >
                <div className="text-xs opacity-70 mb-1">
                  {msg.role === 'user' ? 'You' : 'AI Instructor'}
                </div>
                <div>{msg.content}</div>
              </div>
            </motion.div>
          ))}
          {userTranscriptLive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-primary/50 text-primary-foreground border-2 border-primary">
                <div className="text-xs opacity-70 mb-1">You (speaking...)</div>
                <div>{userTranscriptLive}</div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default TranscriptDisplay;
