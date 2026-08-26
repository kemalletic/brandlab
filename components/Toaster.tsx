"use client";

import { IconClose } from "./Icons";

import { useStore } from "@/lib/store";

export default function Toaster() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 sm:items-end sm:right-4 sm:left-auto sm:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="toast-in pointer-events-auto flex items-center gap-3 border-l-2 border-cobalt bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {t.poruka}
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Zatvori obavještenje"
            className="text-white/50 hover:text-white"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
