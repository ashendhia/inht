const usersRouter = require('express').Router()
const { request, response } = require('express')
const { userExtractor } = require('../utils/middleware')
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

usersRouter.get('/', userExtractor, async (request, response) => {

    const user = request.user

    if (user.email !== 'admin@inht.app') {
        return response.status(401).json({
            error: 'invalid user'
        })
    }

    const users = await prisma.user.findMany({
        include: {
            candidatures: true
        }
    })

    // select only the users that have candidatures that were done this year 
    const usersWithCandidatures = users.filter(user => {
        return user.candidatures.some(candidature => {
            return candidature.createdAt.getFullYear() === new Date().getFullYear()
        })
    })

    // select only the users that have candidatures that are not yet treated

    const finalResult = usersWithCandidatures.filter(user => {
        return user.candidatures.some(candidature => {
            return candidature.status === null
        })
    })

    response
        .status(200)
        .send(finalResult)
})

module.exports = usersRouter