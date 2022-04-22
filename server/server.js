const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const postRoute = require('./routes/postRoute')

const app = express()
const PORT = process.env.SERVER_PORT || 6688
dotenv.config()

app.use(bodyParser.json({ limit: '30mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use('/api/posts', postRoute)

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}
connectDB()
app.listen(PORT, () => {
  console.log(`Server is listing at http://localhost:${PORT}`)
})
