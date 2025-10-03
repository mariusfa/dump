import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageCard } from './ImageCard'

describe('ImageCard', () => {
  const mockProps = {
    imageUrl: 'blob:http://localhost/test',
    timestamp: new Date('2024-01-15').getTime(),
    onDelete: vi.fn(),
    onUpdateDescription: vi.fn()
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

  it('shows "Ingen beskrivelse" when no description', () => {
    render(<ImageCard {...mockProps} />)
    expect(screen.getByText('Ingen beskrivelse')).toBeInTheDocument()
  })

  it('shows description text when provided', () => {
    render(<ImageCard {...mockProps} description="My test description" />)
    expect(screen.getByText('My test description')).toBeInTheDocument()
  })

  it('shows add description button when no description', () => {
    render(<ImageCard {...mockProps} />)
    expect(screen.getByRole('button', { name: /legg til beskrivelse/i })).toBeInTheDocument()
  })

  it('shows edit button when description exists', () => {
    render(<ImageCard {...mockProps} description="Existing description" />)
    expect(screen.getByRole('button', { name: /rediger/i })).toBeInTheDocument()
  })

  it('enters edit mode when edit button clicked', async () => {
    const user = userEvent.setup()
    render(<ImageCard {...mockProps} description="Test" />)
    
    const editButton = screen.getByRole('button', { name: /rediger/i })
    await user.click(editButton)
    
    expect(screen.getByPlaceholderText('Legg til beskrivelse...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /lagre/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /avbryt/i })).toBeInTheDocument()
  })

  it('calls onUpdateDescription when save clicked', async () => {
    const user = userEvent.setup()
    render(<ImageCard {...mockProps} />)
    
    const addButton = screen.getByRole('button', { name: /legg til beskrivelse/i })
    await user.click(addButton)
    
    const textarea = screen.getByPlaceholderText('Legg til beskrivelse...')
    await user.type(textarea, 'New description')
    
    const saveButton = screen.getByRole('button', { name: /lagre/i })
    await user.click(saveButton)
    
    expect(mockProps.onUpdateDescription).toHaveBeenCalledWith('New description')
  })

  it('exits edit mode without saving when cancel clicked', async () => {
    const user = userEvent.setup()
    render(<ImageCard {...mockProps} description="Original" />)
    
    const editButton = screen.getByRole('button', { name: /rediger/i })
    await user.click(editButton)
    
    const textarea = screen.getByPlaceholderText('Legg til beskrivelse...')
    await user.clear(textarea)
    await user.type(textarea, 'Changed text')
    
    const cancelButton = screen.getByRole('button', { name: /avbryt/i })
    await user.click(cancelButton)
    
    expect(mockProps.onUpdateDescription).not.toHaveBeenCalled()
    expect(screen.getByText('Original')).toBeInTheDocument()
  })
})
