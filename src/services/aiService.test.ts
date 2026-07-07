import { analyzeTaskWithAI } from './aiService.js';

describe('AI Service Layer - Unit Tests', () => {
  
  it('should auto-assign HIGH priority for critical production bugs', () => {
    const result = analyzeTaskWithAI(
      'CRITICAL: Server crashed', 
      'The deployment server is down and broken. Fix ASAP!'
    );
    
    expect(result.suggestedPriority).toBe('high');
  });

  it('should auto-assign LOW priority for casual backlog ideas', () => {
    const result = analyzeTaskWithAI(
      'Future feature ideas', 
      'This is a casual feature backlog item to consider someday.'
    );
    
    expect(result.suggestedPriority).toBe('low');
  });

  it('should truncate summaries longer than 60 characters correctly', () => {
    const longDescription = 'This is an incredibly long descriptive sentence meant to exceed the target threshold limit.';
    const result = analyzeTaskWithAI('Test Title', longDescription);
    
    expect(result.summary.length).toBeLessThanOrEqual(60);
    expect(result.summary.endsWith('...')).toBe(true);
  });
  
});