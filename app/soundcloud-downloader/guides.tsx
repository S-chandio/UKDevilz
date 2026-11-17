import Link from "next/link";
import Image from "next/image";
import faq from "./faq.module.css";

const wrap = "mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6";
const heading = "text-3xl font-bold leading-[1.15] md:text-5xl";

export function LinkGuide() {
  return <section className="pf-band-ash border-t border-black/15" aria-labelledby="sc-link-title">
    <div className={`${wrap} grid items-center gap-8 md:grid-cols-2 md:gap-14`}>
      <div>
        <p className="mb-4 text-xs tracking-wider">Track addresses</p>
        <h2 id="sc-link-title" className={heading}>Copy An <em className="accent">Individual Track Link</em></h2>
        <p className="mt-5 leading-8">Select the recording within its profile or playlist, then copy the track address. This tells the tool which audio you want.</p>
        <Image src="/images/soundcloud/guide-track.webp" alt="" width={720} height={540} sizes="(max-width: 767px) 90vw, 420px" className="mx-auto mt-6 h-auto w-full max-w-[420px]" />
      </div>
      <div className="min-w-0 rounded-2xl border border-black/20 bg-white/50 p-6">
        <span className="inline-block rounded-md bg-orange-200 px-3 py-2 text-xs text-black">Example of a track address</span>
        <code className="my-4 block text-sm break-all">soundcloud.com/artist-name/track-name</code>
        <p className="text-xs leading-6">The names show the URL pattern. Replace them by copying the address of your chosen recording.</p>
        <div className="mt-5 border-t border-black/15 pt-4"><p className="text-xs font-bold">Profile</p><code className="mt-2 block text-sm break-all">soundcloud.com/artist-name</code></div>
        <div className="mt-5 border-t border-black/15 pt-4"><p className="text-xs font-bold">Playlist</p><code className="mt-2 block text-sm break-all">soundcloud.com/artist-name/sets/playlist-name</code></div>
        <p className="mt-5 text-xs leading-6">If a short address does not resolve, open it on SoundCloud and copy the destination track URL.</p>
      </div>
    </div>
  </section>;
}

export function SaveGuide() {
  return <section className="pf-band-ash" aria-labelledby="sc-save-title">
    <div className={wrap}>
      <p className="mb-4 text-xs tracking-wider">Locating saved audio</p>
      <h2 id="sc-save-title" className={heading}>Find Your <em className="accent">Downloaded MP3</em></h2>
      <p className="mt-5 max-w-[65ch] leading-8">Open the completed transfer from your browser’s download list. If you chose a folder when saving, the file will be there.</p>
      <Image src="/images/soundcloud/guide-downloads.webp" alt="" width={720} height={405} sizes="(max-width: 767px) 90vw, 560px" className="mx-auto mt-8 h-auto w-full max-w-[560px]" />
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {[
          { title: "iPhone & iPad", text: "Safari’s download location can be in iCloud Drive or On My iPhone. Open Files and check the folder selected in your browser settings." },
          { title: "Android", text: "Find the completed item in Downloads through your browser or file manager. Choose an audio player if your device asks how to open it." },
          { title: "Windows & Mac", text: "Use the completed download’s Show in folder or Show in Finder option. You can move the MP3 afterwards if you keep music elsewhere." },
        ].map((item, i) => <article key={item.title} className="border-t-4 border-orange-500 pt-5"><span className="text-xs text-orange-800">0{i + 1}</span><h3 className="my-3 text-xl font-bold">{item.title}</h3><p className="text-sm leading-7">{item.text}</p></article>)}
      </div>
      <p className="mt-10 rounded-xl bg-black/5 p-6 text-sm leading-7"><strong>If The Browser Plays The Audio</strong> Look for a download control in the player, or return to the result and use its MP3 button to save a local copy.</p>
    </div>
  </section>;
}

export function SoundCloudFAQ() {
  return <section id="soundcloud-faq" className={`look-sc ${faq.section}`} aria-labelledby="sc-faq-title">
    <div className={`${wrap} ${faq.layout}`}>
      <div className={faq.heading}><div className={faq.wave} aria-hidden="true">{[18,32,24,46,30,56,38,22,44,28,52,34].map((height,i)=><i key={i} style={{height}} />)}</div><p className="mb-4 text-xs tracking-wider">SoundCloud questions</p><h2 id="sc-faq-title" className={heading}>Track Quality And <em className="accent">Download Help</em></h2><p className="mt-5 leading-8">These answers cover the address you submit, the audio result and permission to reuse a recording.</p></div>
      <div className={faq.tracks}>
        {[
          { q: "Can I save a playlist in one request?", a: "The tool handles individual tracks. Open the recording you want from the playlist and submit its own URL." },
          { q: "Will signing in make a failed request work?", a: "We do not use your SoundCloud session. A track may play in your account and still be inaccessible to the retrieval service." },
          { q: "Is the result the artist’s original upload?", a: "We cannot promise that. An MP3 result is converted from the available source audio, so it may differ from the uploaded file." },
          { q: "Can I improve a poor recording here?", a: "Changing the output format cannot restore missing detail. Listen to the source first if sound quality is important for your intended use." },
          { q: "Why did a public track return no audio?", a: "Check that the track is public and that you copied its individual address. If the problem continues, send support the URL and the message shown." },
          { q: "May I add the track to another project?", a: "Check the creator’s licence or ask permission for your intended use. Saving the audio does not give you new rights to publish or distribute it." },
          { q: "Where can I find the creator’s download?", a: "Check the track page for Download file or a link provided by the artist. Read any terms attached to that download before using it." },
        ].map((item, index) => <details key={item.q} className={`group ${faq.track}`}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 leading-7 font-bold focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden"><span className={faq.number} aria-hidden="true">{String(index+1).padStart(2,"0")}</span><span className={faq.question}>{item.q}</span><span aria-hidden="true" className="shrink-0 text-2xl group-open:rotate-45">+</span></summary><p className="pb-6 text-sm leading-7">{item.a}</p></details>)}
        <a className="mt-6 inline-block text-xs leading-6 underline underline-offset-4" href="https://help.soundcloud.com/hc/en-us/articles/115003448787-Downloading-tracks" target="_blank" rel="noreferrer">Read SoundCloud’s download instructions ↗</a>
        <p className="mt-4 text-xs leading-6">For information about your request, see our <Link className="underline underline-offset-4" href="/privacy">Privacy Policy</Link>.</p>
      </div>
    </div>
  </section>;
}
