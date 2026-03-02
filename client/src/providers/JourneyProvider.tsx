import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { JourneyApi, JourneyNode } from "../services/journey.service";
import { useAuth } from "./AuthProvider";

/* ========================= */
/*        INTERFACES         */
/* ========================= */

/**
 * Journey Context Type
 */
interface JourneyContextType {
  journals: JourneyNode[];
  isLoading: boolean;
  error: string | null;
  refreshJourneys: () => Promise<void>;
}

/* ========================= */
/*       CONTEXT INIT        */
/* ========================= */

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

/* ========================= */
/*       PROVIDER            */
/* ========================= */

export const JourneyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [journals, setJournals] = useState<JourneyNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch journey timeline from backend
   */
  const loadJourneys = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📍 [JourneyProvider] Loading journey timeline...');
      const data = await JourneyApi.getTimeline();
      console.log('✅ [JourneyProvider] Journey loaded:', data.length, 'journals');
      
      setJournals(data);
    } catch (error: any) {
      console.error('❌ [JourneyProvider] Failed to load journey:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to load journey';
      setError(errorMessage);
      setJournals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load journeys when user is authenticated
   */
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadJourneys();
    } else if (!authLoading && !isAuthenticated) {
      // Clear journals when user logs out
      setJournals([]);
      setError(null);
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, loadJourneys]);

  /**
   * Exposed refresh function for manual reload
   */
  const refreshJourneys = useCallback(async (): Promise<void> => {
    if (isAuthenticated) {
      await loadJourneys();
    }
  }, [isAuthenticated, loadJourneys]);

  const value: JourneyContextType = {
    journals,
    isLoading,
    error,
    refreshJourneys,
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};

/* ========================= */
/*          HOOK             */
/* ========================= */

/**
 * Custom hook to use Journey Context
 * @throws Error if used outside JourneyProvider
 */
export const useJourney = (): JourneyContextType => {
  const context = useContext(JourneyContext);
  
  if (!context) {
    throw new Error("useJourney must be used within a JourneyProvider");
  }
  
  return context;
};
