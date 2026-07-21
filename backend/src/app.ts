// imports
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan"

const app = express()

// middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('combined'))


app.use(express.urlencoded({ extended: true }))

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok",  timestamp: new Date().toISOString(), service: "devscache"})
})

// I am keeping both exports for flexibility
export { app }
export default app