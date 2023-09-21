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
        ...body,
    }

    const savedCandidature = await prisma.candidature.create({
        data: candidature
    })

    response.status(201).json(savedCandidature);
})

candidatureRouter.post('/upload', async (request, response) => {
    let authenticationParameters = await imageKit.getAuthenticationParameters();
    response.json(authenticationParameters);
})

module.exports = candidatureRouter