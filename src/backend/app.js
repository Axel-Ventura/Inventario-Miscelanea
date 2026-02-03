import express from 'express'

const app = express()

// Middleware para leer JSON
app.use(express.json())

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' })
})

// Ruta para probar error 500 (es para la prueba)
app.get('/error', (req, res) => {
  throw new Error('Error forzado para pruebas')
})

/* ===========================
   Middleware 404
   =========================== */
app.use((req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  })
})

/* ===========================
   Middleware 500
   =========================== */
app.use((err, req, res, next) => {
  console.error(err.stack)

  res.status(500).json({
    message: 'Error interno del servidor'
  })
})

export default app
