import type { Metadata } from "next";
import RecoveryPanel from "@/components/RecoveryPanel";

export const metadata: Metadata = {
  title: "Page Not Found | UkDevilz",
  description: "This address does not lead to a UkDevilz page. Return to the homepage to choose a download tool, or contact us if you followed a link from this website.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <RecoveryPanel code="404" title="We Cannot Find This Page">
      <p>The address may have changed, or the link may be incomplete. Return to the homepage to choose a download tool.</p>
    </RecoveryPanel>
  );
}
