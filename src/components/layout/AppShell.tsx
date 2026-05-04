import { PhoneFrame } from "./PhoneFrame";
import { BottomTabBar } from "./BottomTabBar";
import { LogoBanner } from "./LogoBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      {/* Logo banner — fixed at the very top, does not scroll */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <LogoBanner />
      </div>
      {/* Scrollable content — padded below the banner (48px) and above the tab bar (80px) */}
      <div
        className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar"
        style={{ paddingTop: 48, paddingBottom: 80 }}
      >
        {children}
      </div>
      <BottomTabBar />
    </PhoneFrame>
  );
}
