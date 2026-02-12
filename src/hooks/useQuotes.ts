import { useState, useEffect, useCallback } from 'react';
import { Quote, QuoteResponse } from '../types/quote';
import quotesData from '../data/quotes.json';

export const useQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const getRandomQuote = useCallback(() => {
    const data = (quotesData as unknown as QuoteResponse).data;
    if (data && data.length > 0) {
      // Use a more random approach or avoid immediate repetition if possible
      // For true randomness on every call, Math.random() is fine.
      // If we wanted to avoid the SAME quote twice in a row:
      let randomIndex;
      // To avoid infinite loop or performance issue, we just pick random. 
      // The previous logic caused dependency cycle because currentQuote was in dependency array
      // but we need currentQuote inside to compare. 
      // Instead of complex check, let's just pick random. It's statistically unlikely to repeat often with many quotes.
      randomIndex = Math.floor(Math.random() * data.length);
      
      setCurrentQuote(data[randomIndex]);
    }
  }, []); // Remove currentQuote from dependency to avoid infinite loop

  useEffect(() => {
    getRandomQuote();
  }, [getRandomQuote]);

  return { currentQuote, refreshQuote: getRandomQuote };
};