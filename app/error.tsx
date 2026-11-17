"use client";

import RecoveryPanel from "@/components/RecoveryPanel";

export default function ErrorPage({ retry }: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <RecoveryPanel
      code="Page loading problem"
      title="This Page Could Not Load"
      action={<button type="button" onClick={retry} className="rounded-full bg-[var(--red)] px-6 py-3 font-bold text-black hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Try Again</button>}
    >
      <p>Please try opening the page again. If the problem continues, contact us with the page address and what you were doing.</p>
    </RecoveryPanel>
  );
}
