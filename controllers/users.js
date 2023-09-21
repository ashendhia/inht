const usersRouter = require('express').Router()
const { request, response } = require('express')
const bcrypt = require('bcrypt')
const { prisma } = require('../index.js'); // Adjust the path as needed

usersRouter.post('/', async (request, response) => {
    const { email, name, familyName, password, sexe, phone } = request.body

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (existingUser) {
        return response.status(400).json({
            error: 'Un seul compte par adresse email'
        })
    }
    else if (password.length < 3) {
        return response.status(400).json({
            error: 'password less than 3 characters'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = {
        email: email,
        name: name,
        familyName: familyName,
        password: passwordHash,
        sexe: sexe,
        phone: phone
    }

    const savedUser = await prisma.user.create({
        data: user
    })

    response.status(201).json(savedUser)
})

module.exports = usersRouter