import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "../types/Habit";
import { mockHabits } from "../mocks/habits";

const INITIAL_HABITS: Habit[] = mockHabits;

interface HabitsState {
  habits: Habit[];
  loading: boolean;
}

interface HabitsContextType extends HabitsState {
  toggleHabit: (id: string) => void;
  getCompletedCount: () => number;
  getTotalCount: () => number;
}

type HabitsAction =
  | { type: "SET_HABITS"; payload: Habit[] }
  | { type: "TOGGLE_HABIT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const habitsReducer = (
  state: HabitsState,
  action: HabitsAction
): HabitsState => {
  switch (action.type) {
    case "SET_HABITS":
      return { ...state, habits: action.payload };
    case "TOGGLE_HABIT":
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === action.payload
            ? { ...habit, completed: !habit.completed }
            : habit
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

interface HabitsProviderProps {
  children: ReactNode;
}

export const HabitsProvider: React.FC<HabitsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(habitsReducer, {
    habits: INITIAL_HABITS,
    loading: true,
  });

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      saveHabits(state.habits);
    }
  }, [state.habits, state.loading]);

  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem("habits");
      if (savedHabits !== null) {
        const parsedHabits = JSON.parse(savedHabits);
        dispatch({ type: "SET_HABITS", payload: parsedHabits });
      }
    } catch (error) {
      console.error("Error loading habits:", error);
      dispatch({ type: "SET_HABITS", payload: INITIAL_HABITS });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const saveHabits = async (habits: Habit[]) => {
    try {
      await AsyncStorage.setItem("habits", JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits:", error);
    }
  };

  const toggleHabit = (id: string) => {
    dispatch({ type: "TOGGLE_HABIT", payload: id });
  };

  const getCompletedCount = useCallback(() => {
    return state.habits.filter((habit) => habit.completed).length;
  }, [state.habits]);

  const getTotalCount = useCallback(() => {
    return state.habits.length;
  }, [state.habits]);

  const value: HabitsContextType = useMemo(
    () => ({
      ...state,
      toggleHabit,
      getCompletedCount,
      getTotalCount,
    }),
    [getCompletedCount, getTotalCount, state]
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
};

export const useHabits = (): HabitsContextType => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return context;
};
