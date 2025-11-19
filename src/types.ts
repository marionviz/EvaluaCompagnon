export type MessageRole = 'user' | 'model';

export type Feedback = 'thumbs-up' | 'thumbs-down';

export type MetacognitiveQuestionType = 
  | 'justification' 
  | 'strategy' 
  | 'reference' 
  | 'transfer' 
  | 'reflection';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  feedback?: Feedback;
  timestamp?: number; // Timestamp pour l'analyse
  metacognitiveType?: MetacognitiveQuestionType; // Type de question si c'est l'IA
}

export interface SessionMetadata {
  sessionId: string;
  week: number;
  startTime: number;
  endTime?: number;
  totalExchanges: number;
  metacognitiveQuestionsAsked: number;
  averageResponseTime?: number; // En secondes
}

export interface EvaluationReport {
  metadata: SessionMetadata;
  messages: ChatMessage[];
  analysis: {
    engagement: {
      totalMessages: number;
      averageLength: number;
      averageThinkingTime: number;
    };
    metacognition: {
      questionsAsked: number;
      responsesWithJustification: number;
      courseReferences: number;
      personalExamples: number;
    };
    linguistic: {
      structuresUsed: string[];
      selfCorrections: number;
      vocabularyRichness: number;
    };
  };
  qualitativeNotes: string[];
  recommendations: string[];
}
