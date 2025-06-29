export type Habit = {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  completed: boolean;
};

export type HabitFormData = {
  icon: string;
  name: string;
  subtitle: string;
};
