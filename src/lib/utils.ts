export const highlightText = (text: string, keywords: string[]) => {
  if (!keywords || keywords.length === 0) return text;
  
  // Create a regex to match any of the keywords
  // Escape regex special characters just in case
  const escapedKeywords = keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'g');
  
  // Split the text by the regex
  const parts = text.split(regex);
  
  return parts;
};
