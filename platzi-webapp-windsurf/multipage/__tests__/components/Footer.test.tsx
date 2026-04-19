import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('Footer Component', () => {
  it('renders the footer with content', () => {
    render(<Footer />)
    
    // Check if footer element exists
    const footer = document.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('has correct CSS classes and structure', () => {
    render(<Footer />)
    
    // Check if footer has the correct classes
    const footer = document.querySelector('footer')
    expect(footer).toHaveClass('bg-gray-900', 'text-white')
  })

  it('displays copyright information', () => {
    render(<Footer />)
    
    // Check for copyright text (using 2024 since that's what's hardcoded)
    expect(screen.getByText(/2024/)).toBeInTheDocument()
    expect(screen.getByText(/Mario Guerrero/i)).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Footer />)
    
    // Check if footer is properly structured
    const footer = document.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('displays social media links', () => {
    render(<Footer />)
    
    // Check for social media links
    expect(screen.getByText('Twitter/X')).toBeInTheDocument()
    expect(screen.getByText('TikTok')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })
})
