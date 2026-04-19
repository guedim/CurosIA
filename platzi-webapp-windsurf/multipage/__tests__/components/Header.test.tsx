import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('Header Component', () => {
  it('renders the header with navigation links', () => {
    render(<Header />)
    
    // Check if the logo/link to home is present
    expect(screen.getByText('MG')).toBeInTheDocument()
    
    // Check if navigation links are present
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
  })

  it('has correct link attributes', () => {
    render(<Header />)
    
    // Check home link
    const homeLink = screen.getByText('MG')
    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
    
    // Check navigation links
    const aboutLink = screen.getByText('About')
    expect(aboutLink.closest('a')).toHaveAttribute('href', '/about')
    
    const blogLink = screen.getByText('Blog')
    expect(blogLink.closest('a')).toHaveAttribute('href', '/blog')
  })

  it('has correct CSS classes and structure', () => {
    render(<Header />)
    
    // Check if header element exists
    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b')
    
    // Check if nav element exists
    const nav = document.querySelector('nav')
    expect(nav).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Header />)
    
    // Check if navigation is properly structured
    const nav = document.querySelector('nav')
    expect(nav).toBeInTheDocument()
    
    // Check if links are accessible
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4) // MG logo + Home + About + Blog
  })
})
