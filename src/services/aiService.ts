export interface AISuggestions {
    suggestedPriority: 'low' | 'medium' | 'high';
    summary: string;
  }
  
  
  export const analyzeTaskWithAI = (title: string, description: string): AISuggestions => {
    const fullText = `${title} ${description}`.toLowerCase();
    
    let suggestedPriority: 'low' | 'medium' | 'high' = 'medium'; 
    
    const highUrgencyKeywords = ['asap', 'urgent', 'critical', 'production', 'fix', 'broken', 'deadline', 'client', 'stop'];
    const lowUrgencyKeywords = ['backlog', 'someday', 'whenever', 'optional', 'casual', 'low priority', 'extra'];
  
    if (highUrgencyKeywords.some(keyword => fullText.includes(keyword))) {
      suggestedPriority = 'high';
    } else if (lowUrgencyKeywords.some(keyword => fullText.includes(keyword))) {
      suggestedPriority = 'low';
    }
  
    let summary = description;
    if (description.length > 60) {
      summary = description.substring(0, 57) + '...';
    } else if (!description) {
      summary = `Action item to complete: "${title}"`;
    }
  
    return {
      suggestedPriority,
      summary
    };
  };