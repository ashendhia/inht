require('dotenv').config()

const PORT = process.env.PORT
const PRISMA_URI = process.env.DATABASE_URL

module.exports = {
    PRISMA_URI,
    PORT
}