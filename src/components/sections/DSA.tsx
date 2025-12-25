import { dsa } from '../../data/dsa'

export function DSA() {
  return (
    <section id="dsa" className="py-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">DSA Journey</h2>

        <div className="bg-surface border border-default rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left - Info */}
            <div>
              <h3 className="text-2xl font-bold mb-2">{dsa.challenge}</h3>
              <p className="text-muted">
                Solved problems daily on {dsa.platform}, documented the journey publicly on X.
              </p>
            </div>

            {/* Right - Links */}
            <div className="flex flex-wrap gap-3">
              <a
                href={dsa.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                LeetCode Profile
              </a>
              <a
                href={dsa.threadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-surface border border-default text-muted text-sm font-medium hover:text-primary transition-colors"
              >
                X Thread
              </a>
              <a
                href={dsa.codeRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-surface border border-default text-muted text-sm font-medium hover:text-primary transition-colors"
              >
                Code Repo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
