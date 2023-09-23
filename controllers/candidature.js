const jwt = require('jsonwebtoken')
const candidatureRouter = require('express').Router()
const { prisma } = require('../index.js'); // Adjust the path as needed
const { request, response } = require('express')
const ImageKit = require("imagekit");
const { userExtractor } = require('../utils/middleware')

const imageKit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_API_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});

candidatureRouter.post('/', userExtractor, async (request, response) => {

    const body = request.body
    const user = request.user

    imageKit.createFolder({
        folderName: `${user.id}`,
        parentFolderPath: "INHT/Users"
    }, function (error, result) {
        if (error) console.log(error);
        else console.log(result);
    });


    const candidature = {
        userId: user.id,
        status: null,
        ...body,
    }

    await prisma.candidature.create({
        data: candidature
    })

    const userLogged = await prisma.user.findUnique({
        where: {
            email: user.email
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

    const userWithoutPass = {
        email: userLogged.email,
        id: userLogged.id,
        familyName: userLogged.familyName,
        name: userLogged.name,
        sexe: userLogged.sexe,
        phone: userLogged.phone,
        candidatures: userLogged.candidatures
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

candidatureRouter.post('/upload', async (request, response) => {
    let authenticationParameters = await imageKit.getAuthenticationParameters();
    response.json(authenticationParameters);
})

candidatureRouter.put('/:id', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user
    const candidatureId = request.params.id

    if (user.email !== 'admin@inht.app') {
        return response.status(401).json({
            error: 'invalid user'
        })
    }

    const updatedCandidature = await prisma.candidature.update({
        where: {
            id: candidatureId
        },
        data: {
            status: body.status
        }
    })

    response
        .status(200)
        .send(updatedCandidature)
})

module.exports = candidatureRouter