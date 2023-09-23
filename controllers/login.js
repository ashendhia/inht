const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { prisma } = require('../index'); // Adjust the path as needed

loginRouter.post('/', async (request, response) => {
    const { email, password } = request.body

    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            candidatures: {
                select: {
                    birthDate: true,
                    specialty: true,
                    ts: true,
                    wilaya: true,
                    address: true,
                    status: true,
                    createdAt: true,
                }
            }
        }
    })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userWithoutPass = {
        email: user.email,
        id: user.id,
        familyName: user.familyName,
        name: user.name,
        sexe: user.sexe,
        phone: user.phone,
        candidatures: user.candidatures
    }

    const userForToken = {
        email: user.email,
        id: user.id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, userid: user.id, userWithoutPass })
})

module.exports = loginRouter