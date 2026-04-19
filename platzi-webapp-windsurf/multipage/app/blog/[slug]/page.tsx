import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data para el post y contenido relacionado
const blogPostData = {
  id: 1,
  title: "Getting Started with Next.js 15",
  content: "Next.js 15 introduces powerful new features that make building web applications easier than ever. In this comprehensive guide, we'll explore everything from setup to deployment, including the new App Router, Server Components, and enhanced performance optimizations. You'll learn how to leverage these features to build modern, scalable web applications that provide exceptional user experiences.",
  author: "Mario Guerrero",
  date: "March 15, 2024",
  readTime: "8 min read"
};

const relatedPosts = [
  {
    id: 2,
    title: "TypeScript Best Practices",
    summary: "Essential TypeScript patterns and practices for writing maintainable code."
  },
  {
    id: 3,
    title: "Responsive Design with Tailwind CSS",
    summary: "Create beautiful responsive layouts using Tailwind's utility-first approach."
  },
  {
    id: 4,
    title: "Modern React Patterns",
    summary: "Explore contemporary React patterns and hooks for building scalable applications."
  },
  {
    id: 5,
    title: "Building RESTful APIs",
    summary: "Design and implement robust RESTful APIs with Node.js and Express."
  }
];

const projects = [
  { id: 1, title: "E-commerce Platform" },
  { id: 2, title: "Task Management App" },
  { id: 3, title: "Weather Dashboard" },
  { id: 4, title: "Social Media Analytics" },
  { id: 5, title: "Portfolio Website" }
];

const talks = [
  {
    id: 1,
    title: "Next.js 15: What's New",
    summary: "Exploring the latest features and improvements in Next.js 15"
  },
  {
    id: 2,
    title: "TypeScript Advanced Patterns",
    summary: "Deep dive into advanced TypeScript patterns for large-scale applications"
  }
];

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Full Width */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {blogPostData.title}
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 text-sm">
                <span>By {blogPostData.author}</span>
                <span>•</span>
                <span>{blogPostData.date}</span>
                <span>•</span>
                <span>{blogPostData.readTime}</span>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-12">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xl">Featured Image</span>
              </div>
            </div>
            
            {/* Blog Content */}
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg mx-auto">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {blogPostData.content}
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  The new App Router represents a paradigm shift in how we build Next.js applications. 
                  With Server Components at its core, we can now build applications that are more 
                  performant, secure, and maintainable than ever before.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Throughout this guide, we'll explore practical examples and best practices that 
                  you can apply to your own projects. Whether you're building a small personal blog 
                  or a large-scale enterprise application, Next.js 15 provides the tools and 
                  flexibility you need to succeed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Projects</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  {project.title}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Posts Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              {relatedPosts.map((post) => (
                <article key={post.id} className="mb-8 lg:mb-0">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          Thumbnail
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {post.summary}
                        </p>
                        <Link 
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Talks Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Talks</h2>
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              {talks.map((talk) => (
                <article key={talk.id} className="mb-8 lg:mb-0">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          Talk
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {talk.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {talk.summary}
                        </p>
                        <Link 
                          href="#"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Watch talk
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
