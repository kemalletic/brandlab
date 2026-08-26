// Jedinstven set ikona. Sve su stroke SVG-ovi na 24×24 mreži i nasljeđuju
// boju teksta, pa se ponašaju isto na svijetloj i tamnoj pozadini.
// Zamjenjuju Unicode znakove koji su se različito iscrtavali po uređajima.

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

const base = "h-[22px] w-[22px]";

function Svg({
  children,
  className,
  strokeWidth = 1.6,
  fill = "none",
}: IconProps & { children: React.ReactNode; fill?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? base}
    >
      {children}
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </Svg>
  );
}

/** Torba za kupovinu — jasnija silueta od kolica na maloj veličini. */
export function IconBag(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 8h15l-1.1 11.2a1.8 1.8 0 0 1-1.8 1.6H7.4a1.8 1.8 0 0 1-1.8-1.6L4.5 8Z" />
      <path d="M8.8 10.5V7a3.2 3.2 0 0 1 6.4 0v3.5" />
    </Svg>
  );
}

export function IconHeart({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...props} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20.3s-7.6-4.6-7.6-9.6a4.3 4.3 0 0 1 7.6-2.7 4.3 4.3 0 0 1 7.6 2.7c0 5-7.6 9.6-7.6 9.6Z" />
    </Svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
    </Svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 7h15M9.5 7V5.4A1.4 1.4 0 0 1 10.9 4h2.2a1.4 1.4 0 0 1 1.4 1.4V7" />
      <path d="M6.5 7l.9 12.1a1.6 1.6 0 0 0 1.6 1.4h6a1.6 1.6 0 0 0 1.6-1.4L17.5 7" />
    </Svg>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.9 5.5A9.6 9.6 0 0 1 12 5.3c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3 3.7" />
      <path d="M6.4 7.3A16.7 16.7 0 0 0 2.5 11.5S6 17.7 12 17.7a9.7 9.7 0 0 0 3.9-.8" />
      <path d="m4 3.5 16 16" />
      <path d="M10.4 10.1a2.7 2.7 0 0 0 3.6 3.7" />
    </Svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </Svg>
  );
}

export function IconBox(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.5 7.8v8.4a1.6 1.6 0 0 1-.85 1.4l-6.9 3.7a1.6 1.6 0 0 1-1.5 0l-6.9-3.7a1.6 1.6 0 0 1-.85-1.4V7.8" />
      <path d="m3.9 7 7.35-3.9a1.6 1.6 0 0 1 1.5 0L20.1 7l-7.35 3.9a1.6 1.6 0 0 1-1.5 0L3.9 7Z" />
      <path d="M12 11v9.7" />
    </Svg>
  );
}

export function IconReceipt(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.5 3.5h13v17l-2.2-1.4-2.2 1.4-2.1-1.4-2.2 1.4-2.1-1.4-2.2 1.4v-17Z" />
      <path d="M9 8.5h6M9 12.5h6" />
    </Svg>
  );
}

export function IconGear(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 14.4a1.5 1.5 0 0 0 .3 1.65l.05.05a1.8 1.8 0 1 1-2.55 2.55l-.05-.05a1.5 1.5 0 0 0-2.55 1.06v.14a1.8 1.8 0 1 1-3.6 0v-.07a1.5 1.5 0 0 0-2.6-1.02l-.05.05a1.8 1.8 0 1 1-2.55-2.55l.05-.05a1.5 1.5 0 0 0-1.06-2.55h-.14a1.8 1.8 0 1 1 0-3.6h.07A1.5 1.5 0 0 0 5.74 7.5l-.05-.05A1.8 1.8 0 1 1 8.24 4.9l.05.05a1.5 1.5 0 0 0 1.65.3h.07A1.5 1.5 0 0 0 10.92 3.9v-.14a1.8 1.8 0 1 1 3.6 0v.07a1.5 1.5 0 0 0 2.55 1.06l.05-.05a1.8 1.8 0 1 1 2.55 2.55l-.05.05a1.5 1.5 0 0 0-.3 1.65v.07a1.5 1.5 0 0 0 1.37.9h.14a1.8 1.8 0 1 1 0 3.6h-.07a1.5 1.5 0 0 0-1.36.89Z" />
    </Svg>
  );
}

export function IconPencil(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="m14.5 5.5 4 4" />
    </Svg>
  );
}

export function IconExternal(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18.5 14.5v4a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h4" />
    </Svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8v5M12 16.1h.01" />
    </Svg>
  );
}
