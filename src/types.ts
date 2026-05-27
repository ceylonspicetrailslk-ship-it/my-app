export interface AssessmentState {
  citizenship?: string;
  residence?: string;
  age?: number | string;
  education?: string;
  language?: string;
  businessExperience?: string | number;
  managementExperience?: string | number;
  netWorth?: number;
  investment?: number;
  industry?: string;
  province?: string;
  family?: string;
  refusals?: string;
  buyOrStart?: string;
  timeline?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
