import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageCard } from './ImageCard'

describe('ImageCard', () => {
  const mockProps = {
    imageUrl: 'blob:http://localhost/test',
    timestamp: new Date('2024-01-15').getTime(),
    onDelete: vi.fn()
  }

  it('renders image with correct src', () => {
    render(<ImageCard {...mockProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockProps.imageUrl)
  })

  it('renders formatted date', () => {
    render(<ImageCard {...mockProps} />)
    expect(screen.getByText('15.1.2024')).toBeInTheDocument()
  })

  it('renders default alt text when no description', () => {
    render(<ImageCard {...mockProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'DUMP memory')
  })

  it('renders custom alt text when description provided', () => {
    render(<ImageCard {...mockProps} description="Test description" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Test description')
  })

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup()
    render(<ImageCard {...mockProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /slett bilde/i })
    await user.click(deleteButton)
    
    expect(mockProps.onDelete).toHaveBeenCalledOnce()
  })
})
