import { expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion'
import '@testing-library/jest-dom'

test('el accordion muestra el contenido al hacer click', () => {
  render(
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Sección</AccordionTrigger>
        <AccordionContent>Contenido visible</AccordionContent>
      </AccordionItem>
    </Accordion>
  )

  const trigger = screen.getByText('Sección')
  fireEvent.click(trigger)

  expect(screen.getByText('Contenido visible')).toBeInTheDocument()
})
