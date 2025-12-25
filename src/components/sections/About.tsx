import { personal } from '../../data/personal'
import { skillCategories } from '../../data/skills'

export function About() {
  const aboutMe = `Hey there! I'm ${personal.name}, a ${personal.title} based in ${personal.location}. ${personal.bio} When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing what I've learned with the community.`

  return (
    <section id="about" className="py-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left side - Text content */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">About Me</h2>

            <div className="space-y-4 text-muted mb-8">
              <p>
                {aboutMe}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Tech I work with</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                {skillCategories.map((category) => (
                  <div key={category.name} className="min-h-[4.5rem]">
                    <p className="text-sm text-muted mb-2">{category.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 text-sm rounded-full bg-surface border border-default text-muted"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Avatar */}
          <div className="flex-shrink-0">
            <img
              src="/avatar.jpeg"
              alt={personal.name}
              className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
