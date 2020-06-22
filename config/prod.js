//prod.js = production keys here
//These keys are all stored as environment variables within heroku

module.exports = {
    adminID: process.env.adminID,
    adminPassword: process.env.adminPassword,
    designerId: process.env.designerId,
    designerPassword: process.env.designerPassword,
    mediaHouseId: process.env.mediaHouseId,
    mediaHousePassword: process.env.mediaHousePassword,
    mongoURI: process.env.mongoURI,
    googleClientID: process.env.googleClientID,
    googleClientSecret: process.env.googleClientSecret,
    cookieKey: process.env.cookieKey,
    dropboxKey: process.env.dropboxKey,
    dropboxSecret: process.env.dropboxSecret,
    dropboxAccessToken: process.env.dropboxAccessToken,
    WP_CONSUMER_KEY: process.env.WP_CONSUMER_KEY,
    WP_CONSUMER_SECRET: process.env.WP_CONSUMER_SECRET
}