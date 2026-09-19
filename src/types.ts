export interface SubTopic {
  id: string;
  title: string;
  tag?: string;
  content: string;
  highlightedKeywords: string[];
}

export interface Topic {
  id: string;
  title: string;
  badge?: string;
  icon: string;
  description?: string;
  subTopics: SubTopic[];
}
