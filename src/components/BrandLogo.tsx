import logo from "@/img/logo.png";

export function BrandLogo({
  size = "md",
  className = "",
  animate = false,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}) {
  const width = size === "sm" ? 120 : size === "lg" ? 280 : 200;
  const image = (
    <img
      src={logo}
      alt="SIH&S logo. Susan's Intercessory Hooks and Services. Standing in the Gap."
      width={width}
      height={width}
      className={`mx-auto h-auto w-full object-contain ${className}`}
      style={{ maxWidth: width }}
    />
  );

  if (!animate) return image;

  return (
    <div className="relative mx-auto" style={{ maxWidth: width }}>
      <style>{`
        @keyframes sihs-logo-fade {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .sihs-logo-fade { animation: sihs-logo-fade 900ms ease-out both; }
      `}</style>
      <div className="sihs-logo-fade">{image}</div>
    </div>
  );
}
