import React, { createContext, useContext, useState } from "react";
import { fetchGoalsApi } from "./goal.api";

/* ========================= */
/*        INTERFACES         */
/* ========================= */

export interface DraftStage {
  title: string;
  description: string;
  order: number;
}

export interface DraftGoal {
  title: string;
  description: string;
  stages: DraftStage[];
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  stages: Stage[];
}

/* ========================= */
/*       CONTEXT TYPE        */
/* ========================= */

interface GoalContextType {
  draftGoal: DraftGoal | null;
  setDraftGoal: (goal: DraftGoal | null) => void;

  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  fetchGoals: () => Promise<void>;
  loading: boolean;

  currentGoal: Goal | null;
  setCurrentGoal: (goal: Goal | null) => void;
}

/* ========================= */
/*       CONTEXT INIT        */
/* ========================= */

const GoalContext = createContext<GoalContextType | undefined>(undefined);

/* ========================= */
/*       PROVIDER            */
/* ========================= */

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [draftGoal, setDraftGoal] = useState<DraftGoal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await fetchGoalsApi();

      setGoals(data);
    } catch (error) {
      console.log("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoalContext.Provider
      value={{
        draftGoal,
        setDraftGoal,
        goals,
        setGoals,
        currentGoal,
        setCurrentGoal,
        fetchGoals,
        loading,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

/* ========================= */
/*       CUSTOM HOOK         */
/* ========================= */

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoal must be used inside GoalProvider");
  }
  return context;
};
