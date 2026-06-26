/**
 * 朦胧水彩感天空背景：渐变 + 极度模糊的椭圆云（非贴纸式 SVG）
 */
export default function CloudBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
      style={{
        background:
          "linear-gradient(160deg, #EEF2FF 0%, #F8F7F4 50%, #EDF4FF 100%)",
      }}
    >
      {/* 云1 — 左上 */}
      <div
        className="absolute rounded-[50%]"
        style={{
          width: "300px",
          height: "180px",
          top: "-60px",
          left: "-80px",
          background: "rgba(220, 228, 255, 0.5)",
          filter: "blur(70px)",
        }}
      />

      {/* 云2 — 左下 */}
      <div
        className="absolute rounded-[50%]"
        style={{
          width: "250px",
          height: "150px",
          bottom: "80px",
          left: "-60px",
          background: "rgba(210, 225, 255, 0.4)",
          filter: "blur(80px)",
        }}
      />

      {/* 云3 — 右上 */}
      <div
        className="absolute rounded-[50%]"
        style={{
          width: "200px",
          height: "120px",
          top: "40px",
          right: "-50px",
          background: "rgba(230, 235, 255, 0.4)",
          filter: "blur(60px)",
        }}
      />

      {/* 云4 — 右下 */}
      <div
        className="absolute rounded-[50%]"
        style={{
          width: "280px",
          height: "160px",
          bottom: "-40px",
          right: "-80px",
          background: "rgba(215, 230, 255, 0.35)",
          filter: "blur(90px)",
        }}
      />
    </div>
  );
}
