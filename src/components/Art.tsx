export function Art({
  kind,
  className = "",
}: {
  kind: "tow" | "lock" | "jump" | "fuel" | "vial" | "dna" | "docs" | "notary" | "night" | "map" | "empty";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 360 180" role="img" aria-label={label(kind)} className={className}>
      <rect width="360" height="180" fill="#001e16" />
      {kind === "night" || kind === "tow" ? <TowScene /> : null}
      {kind === "lock" ? <LockScene /> : null}
      {kind === "jump" ? <JumpScene /> : null}
      {kind === "fuel" ? <FuelScene /> : null}
      {kind === "vial" ? <VialScene /> : null}
      {kind === "dna" ? <DnaScene /> : null}
      {kind === "docs" ? <DocsScene /> : null}
      {kind === "notary" ? <NotaryScene /> : null}
      {kind === "map" ? <MapScene /> : null}
      {kind === "empty" ? <EmptyScene /> : null}
    </svg>
  );
}

function label(kind: string) {
  const map: Record<string, string> = {
    tow: "Illustration of a light-duty tow truck",
    night: "Tow truck at night outside a facility",
    lock: "Illustration of a vehicle door lock",
    jump: "Illustration of jumper cables",
    fuel: "Illustration of a fuel can",
    vial: "Illustration of specimen vials",
    dna: "Illustration of a DNA double helix",
    docs: "Illustration of a documentation clipboard",
    notary: "Illustration of a notary seal",
    map: "Map of Delaware with Northern New Castle County marked",
    empty: "Illustration of an empty clipboard",
  };
  return map[kind] ?? "Illustration";
}

function TowScene() {
  return (
    <g>
      <rect x="0" y="110" width="360" height="70" fill="#0c3328" />
      <rect x="40" y="48" width="90" height="62" fill="#14382c" />
      <rect x="52" y="58" width="22" height="16" fill="#5fbb3f" opacity="0.35" />
      <rect x="210" y="36" width="110" height="74" fill="#14382c" />
      <rect x="224" y="48" width="28" height="18" fill="#8fd86f" opacity="0.45" />
      <g transform="translate(70,92)">
        <rect x="20" y="18" width="120" height="36" rx="2" fill="#d7dde0" />
        <rect x="128" y="28" width="48" height="26" fill="#5fbb3f" />
        <circle cx="52" cy="58" r="12" fill="#001e16" stroke="#5fbb3f" strokeWidth="3" />
        <circle cx="150" cy="58" r="12" fill="#001e16" stroke="#5fbb3f" strokeWidth="3" />
        <path d="M140 22 L168 22 L176 34 L140 34 Z" fill="#c5d0c8" />
      </g>
    </g>
  );
}

function LockScene() {
  return (
    <g transform="translate(150,36)">
      <rect x="10" y="40" width="50" height="40" rx="2" fill="#5fbb3f" />
      <path d="M20 40 V28 a15 15 0 0 1 30 0 V40" fill="none" stroke="#8fd86f" strokeWidth="6" />
    </g>
  );
}

function JumpScene() {
  return (
    <g stroke="#5fbb3f" strokeWidth="6" fill="none" transform="translate(90,50)">
      <path d="M20 40 C60 10, 80 70, 120 30 C150 8, 160 60, 190 40" />
      <circle cx="20" cy="40" r="8" fill="#5fbb3f" />
      <circle cx="190" cy="40" r="8" fill="#8fd86f" />
    </g>
  );
}

function FuelScene() {
  return (
    <g transform="translate(150,30)">
      <rect x="16" y="20" width="36" height="70" rx="2" fill="#5fbb3f" />
      <rect x="24" y="8" width="20" height="14" fill="#8fd86f" />
      <path d="M52 36 h16 v28" stroke="#c5d4cc" strokeWidth="4" fill="none" />
    </g>
  );
}

function VialScene() {
  return (
    <g transform="translate(120,28)">
      <rect x="20" y="16" width="22" height="78" rx="8" fill="#7ec8e3" stroke="#f4f7f5" />
      <rect x="70" y="28" width="22" height="66" rx="8" fill="#5fbb3f" stroke="#f4f7f5" />
      <rect x="108" y="40" width="28" height="54" fill="#c5d4cc" />
    </g>
  );
}

function DnaScene() {
  return (
    <g transform="translate(155,16)" fill="none" strokeWidth="4">
      <path d="M20 10 C50 40, 0 60, 20 90 C40 120, 0 140, 20 160" stroke="#5fbb3f" />
      <path d="M50 10 C20 40, 70 60, 50 90 C30 120, 70 140, 50 160" stroke="#8fd86f" />
    </g>
  );
}

function DocsScene() {
  return (
    <g transform="translate(130,28)">
      <rect x="20" y="10" width="80" height="110" fill="#f4f7f5" />
      <rect x="32" y="28" width="56" height="6" fill="#001e16" />
      <rect x="32" y="42" width="48" height="4" fill="#3d4a44" />
      <rect x="32" y="54" width="52" height="4" fill="#3d4a44" />
      <path d="M78 78 l16 16 l28 -36" stroke="#2f7a1c" strokeWidth="6" fill="none" />
    </g>
  );
}

function NotaryScene() {
  return (
    <g transform="translate(140,30)">
      <circle cx="40" cy="50" r="36" fill="none" stroke="#5fbb3f" strokeWidth="6" />
      <circle cx="40" cy="50" r="22" fill="none" stroke="#8fd86f" strokeWidth="3" />
      <text x="40" y="55" textAnchor="middle" fill="#f4f7f5" fontSize="12" fontFamily="sans-serif">
        SEAL
      </text>
    </g>
  );
}

function MapScene() {
  return (
    <g>
      <path
        d="M168 20 C190 30, 210 28, 220 50 C236 70, 230 100, 214 130 C200 156, 176 168, 160 150 C140 168, 120 140, 130 110 C118 80, 140 40, 168 20 Z"
        fill="#0c3328"
        stroke="#5fbb3f"
        strokeWidth="3"
      />
      <circle cx="176" cy="48" r="8" fill="#5fbb3f" />
      <text x="188" y="44" fill="#f4f7f5" fontSize="11" fontFamily="sans-serif">
        NCC
      </text>
    </g>
  );
}

function EmptyScene() {
  return (
    <g transform="translate(130,36)">
      <rect x="20" y="16" width="80" height="100" fill="none" stroke="#5fbb3f" strokeWidth="3" />
      <path d="M36 48 h48 M36 64 h36" stroke="#8fd86f" strokeWidth="3" />
    </g>
  );
}
