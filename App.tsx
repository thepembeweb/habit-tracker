import { HabitsProvider } from "./src/context/HabitsContext";
import HabitTracker from "./src/components/HabitTracker";

export default function App() {
  return (
    <HabitsProvider>
      <HabitTracker />
    </HabitsProvider>
  );
}
