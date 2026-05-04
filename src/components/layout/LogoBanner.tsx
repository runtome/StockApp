import Image from "next/image";

export function LogoBanner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 48,
        background: "#FFFFFF",
        borderBottom: "1px solid #E8EAF0",
        flexShrink: 0,
      }}
    >
      <Image
        src="/logo-banner.png"
        alt="Thai Stock AI"
        width={180}
        height={45}
        style={{ objectFit: "contain", width: "auto", height: 34 }}
        priority
      />
    </div>
  );
}
