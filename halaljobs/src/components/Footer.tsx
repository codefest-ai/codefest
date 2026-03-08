import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-ink-900 text-cream-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">هـ</span>
              </div>
              <span className="font-bold text-white text-lg">HalalJobs<span className="text-teal-400">.ai</span></span>
            </div>
            <p className="text-ink-300 text-sm leading-relaxed max-w-xs">
              Find work that aligns with your values. Every listing rated for halal compliance — honestly, transparently, with Islamic guidance.
            </p>
            <div className="mt-5 text-xs text-ink-500 italic">
              "And seek, through that which Allah has given you, the home of the Hereafter; and [yet], do not forget your share of the world." — Quran 28:77
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Platform</div>
            <ul className="space-y-2.5">
              {[
                { label: "Browse Jobs", href: "/jobs" },
                { label: "Post a Job", href: "mailto:hello@halaljobs.ai" },
                { label: "How We Rate", href: "/about#ratings" },
                { label: "Scholar Panel", href: "/about#scholars" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-300 hover:text-teal-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Community</div>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Donate (Sadaqah)", href: "/donate" },
                { label: "Contact", href: "mailto:hello@halaljobs.ai" },
                { label: "Suggest a Job", href: "mailto:hello@halaljobs.ai" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-300 hover:text-teal-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} HalalJobs.ai — Free to use. Supported by the community.
          </p>
          <p className="text-xs text-ink-500 text-center">
            We do not issue fatwas. Ratings are guidance only. Consult a scholar for your specific situation.
          </p>
        </div>
      </div>
    </footer>
  )
}
