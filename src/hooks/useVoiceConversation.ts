import { useState, useRef, useEffect } from 'react';
import { AudioRecorder, encodeAudioForAPI, playAudioData, clearAudioQueue } from '@/utils/RealtimeAudio';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UseVoiceConversationReturn {
  isConnected: boolean;
  isAISpeaking: boolean;
  messages: Message[];
  userTranscriptLive: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendTextMessage: (text: string) => void;
}

export const useVoiceConversation = (): UseVoiceConversationReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userTranscriptLive, setUserTranscriptLive] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentTranscriptRef = useRef('');
  const { toast } = useToast();

  const connect = async () => {
    try {
      // Get project ref from env
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];
      
      if (!projectRef) {
        throw new Error('Could not determine project reference');
      }

      const wsUrl = `wss://${projectRef}.supabase.co/functions/v1/realtime-chat`;
      console.log('Connecting to:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Initialize audio context
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        }

        // Start recording
        recorderRef.current = new AudioRecorder((audioData) => {
          if (ws.readyState === WebSocket.OPEN) {
            const encoded = encodeAudioForAPI(audioData);
            ws.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: encoded
            }));
          }
        });

        await recorderRef.current.start();
        
        toast({
          title: "Connected",
          description: "Voice conversation started",
        });
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received:', data.type);

        switch (data.type) {
          case 'session.created':
            console.log('Session created');
            break;

          case 'session.updated':
            console.log('Session configured');
            break;

          case 'response.audio.delta':
            setIsAISpeaking(true);
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            if (audioContextRef.current) {
              await playAudioData(audioContextRef.current, bytes);
            }
            break;

          case 'response.audio.done':
            setIsAISpeaking(false);
            break;

          case 'response.audio_transcript.delta':
            currentTranscriptRef.current += data.delta;
            break;

          case 'response.audio_transcript.done':
            if (currentTranscriptRef.current) {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: currentTranscriptRef.current,
                timestamp: Date.now()
              }]);
              currentTranscriptRef.current = '';
            }
            break;

          case 'conversation.item.input_audio_transcription.completed':
            const userText = data.transcript;
            setUserTranscriptLive('');
            setMessages(prev => [...prev, {
              role: 'user',
              content: userText,
              timestamp: Date.now()
            }]);
            break;

          case 'input_audio_buffer.speech_started':
            console.log('User started speaking');
            break;

          case 'input_audio_buffer.speech_stopped':
            console.log('User stopped speaking');
            break;

          case 'error':
            console.error('AI Error:', data);
            toast({
              title: "Error",
              description: data.message || "An error occurred",
              variant: "destructive",
            });
            break;
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice service",
          variant: "destructive",
        });
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsAISpeaking(false);
      };

    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    clearAudioQueue();
    setIsConnected(false);
    setIsAISpeaking(false);
    setUserTranscriptLive('');
  };

  const sendTextMessage = (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Not connected",
        description: "Please connect first",
        variant: "destructive",
      });
      return;
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    };

    wsRef.current.send(JSON.stringify(event));
    wsRef.current.send(JSON.stringify({ type: 'response.create' }));

    setMessages(prev => [...prev, {
      role: 'user',
      content: text,
      timestamp: Date.now()
    }]);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    isAISpeaking,
    messages,
    userTranscriptLive,
    connect,
    disconnect,
    sendTextMessage,
  };
};
