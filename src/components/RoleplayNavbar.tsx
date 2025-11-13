import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, History, Lightbulb, X, ArrowLeft } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ResponseOption {
  german: string;
  english: string;
  pronunciation: string;
}

interface RoleplayNavbarProps {
  conversationHistory: Message[];
  responseOptions: ResponseOption[];
  onResponseSelect: (response: ResponseOption) => void;
  onBack: () => void;
  characterName: string;
  sceneName: string;
}

export function RoleplayNavbar({
  conversationHistory,
  responseOptions,
  onResponseSelect,
  onBack,
  characterName,
  sceneName,
}: RoleplayNavbarProps) {
  // Remove state for suggestions and history since they're handled by side buttons
  
  return (
    <>
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="font-semibold text-white text-sm">{sceneName}</h2>
              <p className="text-xs text-white/70">with {characterName}</p>
            </div>
          </div>

          {/* Empty space for balance - no more buttons */}
          <div className="w-10" />
        </div>
      </div>
    </>
  );
}