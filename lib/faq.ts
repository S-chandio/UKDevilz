// lib/faq.ts
// Questions and answers, edited in one place. Shown in the footer's FAQ row (components/Footer.tsx);
// landing pages should reuse these where they overlap (README section 17).
// Answers must match what the backend really does (README section 4).
import { SITE } from "./site";

export const FAQ = [
  {
    q: "Do I need to pay or register?",
    a: `You can use ${SITE.name} without a subscription, payment or registration. Availability depends on the source and the retrieval service.`,
  },
  {
    q: "What happens to the files?",
    a: "We do not store the media you download. Requests involve processing your submitted link, and previews can contact another provider. The Privacy Policy describes that handling separately from your saved files.",
  },
  {
    q: "Why was my request rejected?",
    a: "The address may point to a type of post the tool cannot handle. Instagram Stories, Facebook Stories and Facebook photo posts are excluded. A removed item or an expired Snapchat story is also unavailable.",
  },
  {
    q: "How do I request an MP3?",
    a: "Select Audio only before submitting a supported link, or choose MP3 from a video result. We convert the available soundtrack so you can save it separately.",
  },
  {
    q: "Will a TikTok logo remain?",
    a: "We provide TikTok clips without the platform watermark. A logo added within the recording by its creator stays visible.",
  },
  {
    q: "Can I choose the resolution?",
    a: "Entering a YouTube address reveals 360p, 720p, 1080p and Best. These settings request a quality level; the source determines what can be returned. Other tools use the available media without that selector.",
  },
];
