# MAPA Tools
* Add users
* Login
* Front end for upload/download/deleting files from dropbox
* Update shortcode variable values for wordpress website
* Google Analytics views - embedded from Google Sheets reports

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

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

## Built With

* [mongoDB](https://www.mongodb.com/) - Database
* [Express](https://expressjs.com/) - Web Framework
* [React](https://reactjs.org/) - Front end JavaScript Library
* [NodeJs](https://nodejs.org/en/) - Back end
* [NPM](https://www.npmjs.com/get-npm) - Dependency Management
* [Semantic UI React](https://react.semantic-ui.com/) - Styling

## Authors

* **Joseph Ronselli** 

## Acknowledgments

* [adasq](https://github.com/adasq) for support with their [dropbox api wrapper](https://github.com/adasq/dropbox-v2-api)

