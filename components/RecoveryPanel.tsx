import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function RecoveryPanel({ code, title, children, action }: {
  code: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="look-black under-header px-[5vw] py-16 md:py-24">
      <div className="mx-auto grid min-h-[460px] max-w-[1100px] items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="text-center md:text-left">
          <p className="mb-4 text-sm text-[var(--muted)]">{code}</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
          <div className="mx-auto mt-5 max-w-[560px] text-base leading-relaxed text-[var(--muted)] md:mx-0 md:text-lg">{children}</div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            {action}
            <Link href="/" className="rounded-full border border-[var(--grey)] px-6 py-3 font-bold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Go To Homepage</Link>
            <Link href="/contact" className="self-center px-2 py-3 underline underline-offset-4">Contact Us</Link>
          </div>
        </div>
        <Image src="/images/states/devil-sitting-broken-link-still.webp" alt="" width={320} height={320} className="mx-auto h-auto w-[180px] md:w-[280px]" sizes="(min-width: 768px) 280px, 180px" />
      </div>
    </section>
  );
}
