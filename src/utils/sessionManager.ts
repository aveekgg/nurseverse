// Session Management for Conversation History
// Each scenario interaction creates a unique session

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ConversationSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  messages: ConversationMessage[];
  objectives: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  startedAt: number;
  lastUpdated: number;
  turnCount: number;
  isComplete: boolean;
}

const SESSIONS_STORAGE_KEY = 'vivo_fluent_sessions';
const CURRENT_SESSION_KEY = 'vivo_fluent_current_session';

export class SessionManager {
  // Create a new session for a scenario
  static createSession(scenarioId: string, scenarioTitle: string): ConversationSession {
    const session: ConversationSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scenarioId,
      scenarioTitle,
      messages: [],
      objectives: [],
      startedAt: Date.now(),
      lastUpdated: Date.now(),
      turnCount: 0,
      isComplete: false
    };

    // Save as current session
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    
    // Add to sessions list
    this.saveSession(session);
    
    return session;
  }

  // Get the current active session
  static getCurrentSession(): ConversationSession | null {
    const sessionData = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!sessionData) return null;
    
    try {
      return JSON.parse(sessionData);
    } catch (error) {
      console.error('Failed to parse current session:', error);
      return null;
    }
  }

  // Update the current session
  static updateSession(updates: Partial<ConversationSession>): void {
    const currentSession = this.getCurrentSession();
    if (!currentSession) return;

    const updatedSession: ConversationSession = {
      ...currentSession,
      ...updates,
      lastUpdated: Date.now()
    };

    // Save updated session
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updatedSession));
    this.saveSession(updatedSession);
  }

  // Add a message to the current session
  static addMessage(role: 'user' | 'assistant', content: string): void {
    const currentSession = this.getCurrentSession();
    if (!currentSession) return;

    const message: ConversationMessage = {
      role,
      content,
      timestamp: Date.now()
    };

    currentSession.messages.push(message);
    
    // Increment turn count for user messages
    if (role === 'user') {
      currentSession.turnCount += 1;
    }

    this.updateSession({
      messages: currentSession.messages,
      turnCount: currentSession.turnCount
    });
  }

  // Update objectives progress
  static updateObjectives(objectives: ConversationSession['objectives']): void {
    this.updateSession({ objectives });
  }

  // Mark session as complete
  static completeSession(): void {
    this.updateSession({ isComplete: true });
  }

  // Save or update a session in the list
  static saveSession(session: ConversationSession): void {
    const sessions = this.getAllSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }

    // Keep only last 50 sessions
    const trimmedSessions = sessions.slice(-50);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(trimmedSessions));
  }

  // Get all saved sessions
  static getAllSessions(): ConversationSession[] {
    const sessionsData = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!sessionsData) return [];

    try {
      return JSON.parse(sessionsData);
    } catch (error) {
      console.error('Failed to parse sessions:', error);
      return [];
    }
  }

  // Get sessions for a specific scenario
  static getSessionsByScenario(scenarioId: string): ConversationSession[] {
    return this.getAllSessions().filter(s => s.scenarioId === scenarioId);
  }

  // Load a specific session
  static loadSession(sessionId: string): ConversationSession | null {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    }
    
    return session || null;
  }

  // Delete a session
  static deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions().filter(s => s.id !== sessionId);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));

    // Clear current session if it was deleted
    const currentSession = this.getCurrentSession();
    if (currentSession?.id === sessionId) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  }

  // Clear current session
  static clearCurrentSession(): void {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }

  // Get messages for VAPI context (only from current session)
  static getSessionMessagesForVAPI(): ConversationMessage[] {
    const currentSession = this.getCurrentSession();
    if (!currentSession) return [];

    // Return messages in VAPI format
    return currentSession.messages;
  }

  // Format session duration
  static formatSessionDuration(session: ConversationSession): string {
    const duration = session.lastUpdated - session.startedAt;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }

  // Get session statistics
  static getSessionStats(session: ConversationSession) {
    const userMessages = session.messages.filter(m => m.role === 'user').length;
    const assistantMessages = session.messages.filter(m => m.role === 'assistant').length;
    const completedObjectives = session.objectives.filter(o => o.completed).length;
    
    return {
      userMessages,
      assistantMessages,
      totalMessages: session.messages.length,
      completedObjectives,
      totalObjectives: session.objectives.length,
      duration: this.formatSessionDuration(session)
    };
  }
}
