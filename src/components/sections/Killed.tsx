import { killed } from '../../data/killed'

export function Killed() {
  return (
    <section id="killed" className="py-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-2">Killed by me</h2>
        <p className="text-muted mb-8">Projects that didn't make it. Rest in peace.</p>

        <div className="grid gap-3 md:grid-cols-2 max-w-2xl mx-auto">
          {killed.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              {/* Tombstone shape */}
              <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 rounded-t-[50px] rounded-b-md p-4 pt-6 text-center border border-zinc-600 dark:border-zinc-700 shadow-md transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-lg">
                {/* RIP */}
                <p className="text-zinc-400 text-xs font-serif italic mb-1">R.I.P.</p>

                {/* Skull with animation */}
                <div className="text-2xl mb-1.5 transition-transform duration-300 group-hover:animate-wiggle">
                  💀
                </div>

                {/* Project name with strikethrough on hover */}
                <h3 className="text-sm font-bold text-zinc-200 mb-1 transition-all duration-300 group-hover:line-through group-hover:decoration-red-500 group-hover:decoration-2">
                  {item.name}
                </h3>

                {/* Cause of death */}
                <p className="text-zinc-400 text-xs">
                  Cause of death: <span className="text-red-400 font-medium">{item.reason}</span>
                </p>

                {/* Dates placeholder */}
                <p className="text-zinc-500 text-[10px] mt-1.5 font-mono">
                  ✝ Gone too soon
                </p>
              </div>

              {/* Ground/grass effect */}
              <div className="h-1.5 bg-gradient-to-r from-red-900 via-red-800 to-red-900 rounded-b-md" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
