"use client";

import { useState } from "react";
import { IconEye, IconEyeOff } from "./Icons";

export default function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  greska,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  greska?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const [vidljiva, setVidljiva] = useState(false);
  const jeLozinka = type === "password";
  const stvarniTip = jeLozinka && vidljiva ? "text" : type;

  return (
    <div>
      <label htmlFor={id} className="label-tech mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={stvarniTip}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(greska)}
          aria-describedby={greska ? `${id}-greska` : undefined}
          className={`h-12 w-full border px-3 text-sm outline-none transition-colors focus:border-cobalt ${
            jeLozinka ? "pr-12" : ""
          } ${greska ? "border-cobalt" : "border-line"}`}
        />
        {jeLozinka && (
          <button
            type="button"
            onClick={() => setVidljiva((v) => !v)}
            aria-label={vidljiva ? "Sakrij lozinku" : "Prikaži lozinku"}
            className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-steel hover:text-ink"
          >
            {vidljiva ? (
              <IconEyeOff className="h-5 w-5" />
            ) : (
              <IconEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {greska && (
        <p id={`${id}-greska`} role="alert" className="mt-1.5 text-xs text-cobalt">
          {greska}
        </p>
      )}
    </div>
  );
}
