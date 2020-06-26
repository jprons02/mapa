# MAPA Tools
* Add users
* Front end for upload/download/deleting files from dropbox
* Update shortcode variable values for wordpress website

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Items you need to install

* node 12.x
* npm: 6.x
* yarn: 1.x (not needed if symantic ui react will work with create-react-app)


### Installing

* ```npm install``` on root directory
* Create dev.js file in config directory
  * Place all keys here to run program locally (dev.js should be listed in .gitignore)
    * mongoURI - To connect to mongoDB, adding users
    * googleClientID - Google OAuth functionality with passport service
    * googleClientSecret - Google OAuth functionality with passport service 
    * cookieKey - Google OAuth functionality with passport service
    * dropboxAccessToken - upload/list/delete routes
    * WP_CONSUMER_KEY - change wordpress shortcode variables
    * WP_CONSUMER_SECRET - change wordpress shortcode variables 
    * gmailAppPassword - used for nodemailer in nodejs
* ```npm install``` on client directory
* ```npm run dev``` on root directory to start application

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [mongoDB](https://www.mongodb.com/) - Database
* [Express](https://expressjs.com/) - Web Framework
* [React](https://reactjs.org/) - Front end JavaScript Library
* [NodeJs](https://nodejs.org/en/) - Back end
* [NPM](https://www.npmjs.com/get-npm) - Dependency Management

## Authors

* **Joseph Ronselli** 

## Acknowledgments

* [adasq](https://github.com/adasq) for support with their [dropbox api wrapper](https://github.com/adasq/dropbox-v2-api)

