import { PhoneFrame } from "./PhoneFrame";
import { BottomTabBar } from "./BottomTabBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <div
        className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar"
        style={{ paddingBottom: 80 }}
      >
        {children}
      </div>
      <BottomTabBar />
    </PhoneFrame>
  );
}
