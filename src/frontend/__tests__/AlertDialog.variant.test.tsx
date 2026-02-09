import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test } from 'vitest'

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '../components/ui/alert-dialog'

import { Button } from '../components/ui/button'

function VariantModal() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Eliminar</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>

        <AlertDialogCancel>Cancelar</AlertDialogCancel>

        <AlertDialogAction asChild>
          <Button variant="destructive">Confirmar</Button>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
}

test('renderiza acción destructiva en AlertDialog', () => {
  render(<VariantModal />)

  fireEvent.click(screen.getByText('Eliminar'))

  const action = screen.getByRole('button', { name: 'Confirmar' })

  expect(action).toBeInTheDocument()
  expect(action.className).toContain('destructive')
})