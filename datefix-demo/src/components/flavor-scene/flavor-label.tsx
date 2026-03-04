"use client";

type FlavorLabelProps = {
  name: string;
  colorToken: string;
};

export default function FlavorLabel({ name, colorToken }: FlavorLabelProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6">
      <p
        className="text-sm font-semibold uppercase tracking-widest transition-opacity duration-300 group-hover:opacity-100"
        style={{ color: `var(--${colorToken})` }}
      >
        {name}
      </p>
    </div>
  );
}
