export interface IMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface IChatSession {
  id: string;
  title: string;
  messages: IMessage[];
  grade: string | null;
  subject: string | null;
  createdAt: string;
}
