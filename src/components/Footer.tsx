import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-0">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500">
              <Zap className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-sm font-medium text-zinc-400">
              codefest<span className="text-brand-400">.ai</span>
            </span>
          </div>
          <p className="text-sm text-zinc-600">
            Built for builders. &copy; {new Date().getFullYear()} Throughline Systems, LLC.
          </p>
        </div>
      </div>
    </footer>
  )
}
