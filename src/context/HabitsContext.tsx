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
import { Habit, HabitFormData } from "../types/Habit";
import { mockHabits } from "../mocks/habits";

const INITIAL_HABITS: Habit[] = mockHabits;

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  lastResetDate: string | null;
}

interface HabitsContextType extends HabitsState {
  toggleHabit: (id: string) => void;
  addHabit: (habitData: HabitFormData) => void;
  updateHabit: (id: string, habitData: HabitFormData) => void;
  deleteHabit: (id: string) => void;
  getCompletedCount: () => number;
  getTotalCount: () => number;
}

type HabitsAction =
  | { type: "SET_HABITS"; payload: Habit[] }
  | { type: "TOGGLE_HABIT"; payload: string }
  | { type: "ADD_HABIT"; payload: Habit }
  | { type: "UPDATE_HABIT"; payload: { id: string; habitData: HabitFormData } }
  | { type: "DELETE_HABIT"; payload: string }
  | { type: "RESET_HABITS" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LAST_RESET_DATE"; payload: string };

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

const getTodayDateString = (): string => {
  return new Date().toDateString();
};

const shouldResetHabits = (lastResetDate: string | null): boolean => {
  if (!lastResetDate) return true;
  return lastResetDate !== getTodayDateString();
};

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
    case "ADD_HABIT":
      return {
        ...state,
        habits: [...state.habits, action.payload],
      };
    case "UPDATE_HABIT":
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.habitData }
            : habit
        ),
      };
    case "DELETE_HABIT":
      return {
        ...state,
        habits: state.habits.filter((habit) => habit.id !== action.payload),
      };
    case "RESET_HABITS":
      return {
        ...state,
        habits: state.habits.map((habit) => ({ ...habit, completed: false })),
        lastResetDate: getTodayDateString(),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_LAST_RESET_DATE":
      return { ...state, lastResetDate: action.payload };
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
    lastResetDate: null,
  });

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      saveHabits(state.habits);
    }
  }, [state.habits, state.loading]);

  useEffect(() => {
    if (!state.loading && state.lastResetDate) {
      saveLastResetDate(state.lastResetDate);
    }
  }, [state.lastResetDate, state.loading]);

  const loadHabits = async () => {
    try {
      const [savedHabits, savedLastResetDate] = await Promise.all([
        AsyncStorage.getItem("habits"),
        AsyncStorage.getItem("lastResetDate"),
      ]);

      let habitsToLoad = INITIAL_HABITS;
      let lastResetDate = savedLastResetDate;

      if (savedHabits !== null) {
        habitsToLoad = JSON.parse(savedHabits);
      }

      dispatch({ type: "SET_HABITS", payload: habitsToLoad });

      if (lastResetDate) {
        dispatch({ type: "SET_LAST_RESET_DATE", payload: lastResetDate });
      }

      if (shouldResetHabits(lastResetDate)) {
        dispatch({ type: "RESET_HABITS" });
      }
    } catch (error) {
      console.error("Error loading habits:", error);
      dispatch({ type: "SET_HABITS", payload: INITIAL_HABITS });
      dispatch({ type: "RESET_HABITS" });
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

  const saveLastResetDate = async (date: string) => {
    try {
      await AsyncStorage.setItem("lastResetDate", date);
    } catch (error) {
      console.error("Error saving last reset date:", error);
    }
  };

  const toggleHabit = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_HABIT", payload: id });
  }, []);

  const addHabit = useCallback((habitData: HabitFormData) => {
    const newHabit: Habit = {
      id: generateId(),
      ...habitData,
      completed: false,
    };
    dispatch({ type: "ADD_HABIT", payload: newHabit });
  }, []);

  const updateHabit = useCallback((id: string, habitData: HabitFormData) => {
    dispatch({ type: "UPDATE_HABIT", payload: { id, habitData } });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    dispatch({ type: "DELETE_HABIT", payload: id });
  }, []);

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
      addHabit,
      updateHabit,
      deleteHabit,
      getCompletedCount,
      getTotalCount,
    }),
    [
      state,
      toggleHabit,
      addHabit,
      updateHabit,
      deleteHabit,
      getCompletedCount,
      getTotalCount,
    ]
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
