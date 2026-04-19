import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              MG
            </Link>
          </div>
          <div className="flex items-baseline space-x-4">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Blog
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
