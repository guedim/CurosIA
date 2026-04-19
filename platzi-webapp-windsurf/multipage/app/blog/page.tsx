import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogPosts } from "@/lib/api";
import { BlogPost } from "@/types/blog";

export default async function Blog() {
  // Obtener posts desde el API de Bun
  const postsResponse = await getBlogPosts();
  const blogPosts = postsResponse.success ? postsResponse.data : [];

  // Si no hay posts, mostrar mensaje
  if (blogPosts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Blog
              </h1>
              <p className="text-gray-600">
                {postsResponse.success 
                  ? "No hay posts disponibles en este momento." 
                  : "No se pudieron cargar los posts. Por favor, intenta más tarde."
                }
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredPost = blogPosts[0];
  const gridPosts = blogPosts.slice(1); // Mostrar todos los posts restantes

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Featured Post */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="mb-8 lg:mb-0">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-lg">Featured Image</span>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.summary}
                </p>
                <Link 
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Leer más
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Grid Section - All Posts */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Todos los Cursos</h2>
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              {gridPosts.map((post: BlogPost) => (
                <article key={post.id} className="mb-8 lg:mb-0">
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            Thumbnail
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {post.summary}
                          </p>
                          <Link 
                            href={`/blog/${post.id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Leer
                          </Link>
                        </div>
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
