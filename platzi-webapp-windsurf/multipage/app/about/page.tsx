import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data para projects y talks
const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with React and Node.js"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative task management tool with real-time updates"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Interactive weather dashboard with data visualization"
  },
  {
    id: 4,
    title: "Social Media Analytics",
    description: "Analytics platform for social media performance tracking"
  }
];

const talks = [
  {
    id: 1,
    title: "Next.js 15: What's New",
    summary: "Exploring the latest features and improvements in Next.js 15, including Server Components and App Router."
  },
  {
    id: 2,
    title: "TypeScript Advanced Patterns",
    summary: "Deep dive into advanced TypeScript patterns for large-scale applications and best practices."
  }
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* About Me Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="mb-8 lg:mb-0">
                <img 
                  src="https://via.placeholder.com/400x400/6B7280/FFFFFF?text=Profile+Image"
                  alt="Mario Guerrero - Software Developer Profile"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">About me</h1>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  I'm a passionate software developer with expertise in modern web technologies. 
                  I love creating clean, efficient, and user-friendly applications that solve real-world problems.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  With a strong foundation in TypeScript, React, and Next.js, I build scalable 
                  web applications that deliver exceptional user experiences. I'm always eager to 
                  learn new technologies and take on challenging projects.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  When I'm not coding, you can find me exploring new frameworks, contributing to 
                  open-source projects, or sharing my knowledge through technical writing and talks.
                </p>
                <Link 
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Projects</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow duration-300">
                    <img 
                      src={`https://via.placeholder.com/300x300/D1D5DB/6B7280?text=${encodeURIComponent(project.title)}`}
                      alt={`${project.title} project preview`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Talks Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Talks</h2>
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              {talks.map((talk) => (
                <article key={talk.id} className="mb-8 lg:mb-0">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          <img 
                            src={`https://via.placeholder.com/96x96/D1D5DB/6B7280?text=Talk`}
                            alt={`${talk.title} talk thumbnail`}
                            className="w-full h-full rounded object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {talk.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {talk.summary}
                        </p>
                        <Link 
                          href="#"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Ver charla
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
