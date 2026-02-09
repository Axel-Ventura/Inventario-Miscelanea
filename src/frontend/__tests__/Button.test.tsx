import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { Button } from '../components/ui/button'

test('renderiza el botón y responde al click', () => {
  const onClick = vi.fn()

  render(<Button onClick={onClick}>Guardar</Button>)

  const button = screen.getByRole('button', { name: 'Guardar' })

  // Renderizado
  expect(button).toBeInTheDocument()

  // Interacción
  fireEvent.click(button)
  expect(onClick).toHaveBeenCalledOnce()
})

test('aplica variante secondary correctamente', () => {
  render(<Button variant="secondary">Cancelar</Button>)

  const button = screen.getByRole('button', { name: 'Cancelar' })

  // Validación visual / lógica
  expect(button.className).toContain('bg-secondary')
})