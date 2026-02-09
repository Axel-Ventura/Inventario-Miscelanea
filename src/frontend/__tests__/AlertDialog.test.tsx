import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
} from '../components/ui/alert-dialog'

function TestModal() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open Modal</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Modal Title</AlertDialogTitle>
        <AlertDialogCancel>Close</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  )
}

test('abre y cierra el modal con gestión correcta del foco', async () => {
  const user = userEvent.setup()
  render(<TestModal />)

  const trigger = screen.getByText('Open Modal')

  // foco inicial
  trigger.focus()
  expect(trigger).toHaveFocus()

  // abrir modal
  await user.click(trigger)
  expect(screen.getByText('Modal Title')).toBeInTheDocument()

  // cerrar modal
  const closeButton = screen.getByText('Close')
  await user.click(closeButton)

  // el foco regresa al trigger
  expect(trigger).toHaveFocus()
})