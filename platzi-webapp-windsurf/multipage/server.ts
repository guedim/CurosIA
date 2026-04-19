// Datos de posts extraídos del archivo blog/page.tsx
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    summary: "Learn how to build modern web applications with the latest Next.js features and App Router. This comprehensive guide covers everything from setup to deployment.",
    content: "Next.js 15 introduces powerful new features that make building web applications easier than ever..."
  },
  {
    id: 2,
    title: "TypeScript Best Practices",
    summary: "Essential TypeScript patterns and practices for writing maintainable code. Discover advanced types and patterns.",
    content: "TypeScript provides powerful type safety features that can significantly improve code quality..."
  },
  {
    id: 3,
    title: "Responsive Design with Tailwind CSS",
    summary: "Create beautiful responsive layouts using Tailwind's utility-first approach. Master mobile-first design.",
    content: "Tailwind CSS revolutionizes the way we approach styling in web development..."
  },
  {
    id: 4,
    title: "Modern React Patterns",
    summary: "Explore contemporary React patterns and hooks for building scalable applications. Learn custom hooks and state management.",
    content: "React's ecosystem continues to evolve with new patterns that improve developer experience..."
  },
  {
    id: 5,
    title: "Building RESTful APIs",
    summary: "Design and implement robust RESTful APIs with Node.js and Express. Best practices for API architecture.",
    content: "Creating well-designed APIs is crucial for building scalable web applications..."
  },
  {
    id: 6,
    title: "Database Design Fundamentals",
    summary: "Learn the principles of good database design and normalization. SQL and NoSQL comparison.",
    content: "Understanding database design is essential for building data-driven applications..."
  },
  {
    id: 7,
    title: "Testing Strategies for Web Apps",
    summary: "Comprehensive testing approaches including unit, integration, and E2E testing with modern tools.",
    content: "Testing is a critical part of the development process that ensures code quality..."
  },
  {
    id: 8,
    title: "Python Programming Fundamentals",
    summary: "Master the essentials of Python programming from variables and data structures to object-oriented programming. Perfect for beginners looking to start their coding journey.",
    content: "Python is one of the most popular programming languages today, known for its simplicity and versatility. This course covers everything from basic syntax to advanced concepts like decorators, generators, and async programming. You'll learn how to work with Python's extensive standard library and popular frameworks like Django and Flask."
  },
  {
    id: 9,
    title: "AWS Cloud Architecture",
    summary: "Design and deploy scalable cloud solutions using Amazon Web Services. Learn EC2, S3, Lambda, and more for enterprise-grade applications.",
    content: "Amazon Web Services offers a comprehensive suite of cloud computing services that form the backbone of modern infrastructure. This course teaches you how to design resilient architectures, implement auto-scaling, manage databases with RDS, and secure your applications with IAM. You'll work with real-world scenarios including serverless applications and container orchestration."
  },
  {
    id: 10,
    title: "Clean Architecture Principles",
    summary: "Build maintainable and scalable software systems with clean architecture patterns. Learn dependency injection, SOLID principles, and modular design.",
    content: "Clean Architecture is a set of principles and patterns that help developers create software that is easy to understand, maintain, and evolve. This course covers the SOLID principles, dependency injection patterns, and how to structure applications in layers. You'll learn how to separate concerns effectively and create systems that can adapt to changing requirements."
  }
];

// Servidor HTTP con Bun
const server = Bun.serve({
  port: 3002, // Cambiado a puerto 3002 para evitar conflicto con Next.js
  routes: {
    // Endpoint GET para listar todos los posts
    "/api/posts": {
      GET: () => {
        return Response.json({
          success: true,
          count: blogPosts.length,
          data: blogPosts
        });
      }
    }
  },
  // Fallback para rutas no encontradas
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  }
});

console.log(`🚀 Servidor de posts corriendo en ${server.url}`);
console.log(`📝 Endpoint disponible: ${server.url}api/posts`);
console.log(`📋 Total de posts: ${blogPosts.length}`);
