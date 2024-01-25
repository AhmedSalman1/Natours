<h1 align="center">
  <br>
  <a href="https://natours-tvyz.onrender.com/"><img src="https://github.com/AhmedSalman1/Natours/blob/master/public/img/logo-green-round.png" alt="Natours" width="150"></a>
  <br>
  Natours
  <br>
</h1>

<h4 align="center">An Awesome Tour Booking Site Built On Top Of <a href="https://nodejs.org/en/" target="_blank">NodeJS</a>.</h4>

 <p align="center">
 <a href="#deployed-version 🚀">Deployed Version</a> •
  <a href="#key-features ✨">Key Features</a> •
  <a href="#demonstration 🖥️">Demonstration</a> •
  <a href="#how-to-use 🤔">How To Use</a> •
  <a href="#api-usage">API Usage</a> •
  <a href="#built-with 🔮">Built With</a> •
  <a href="#installation 🛠️">Installation</a> • 
  <a href="#future-updates">Future Updates</a> • 
  <a href="#acknowledgement">Acknowledgement</a>
</p>

## Deployed Version 🚀

Live demo of Natours (Feel free to visit) 👉🏻 : https://natours-tvyz.onrender.com/

---

## Key Features ✨

-   **Authentication and Authorization** 🚀
    -   Sign up, Log in, Logout, Update, and reset password.
-   **User Profile** 🧑‍💼
    -   Update username, photo, email, password, and other information.
    -   Users categorized as regular, admin, lead guide, or guide.
-   **Tour Management** 🗺️
    -   Manage booking, check tour map, reviews, and ratings.
    -   Tours created, updated, and deleted by admins or lead guides.
-   **Bookings** 📅
    -   Only regular users can book tours (make a payment).
    -   Prevent duplicate bookings for regular users.
    -   Admins or lead guides can manage all bookings.
-   **Reviews** 🌟
    -   Only regular users can write reviews for booked tours.
    -   Admins can delete any review.
-   **Favorite Tours** ❤️
    -   Regular users can add/remove tours to/from their favorites.
-   **Credit Card Payment** 💳

---

## Demonstration 🖥️

---

## API Usage

Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add:

```
- {{URL}} with your hostname as value (Eg. http://127.0.0.1:3000 or http://www.example.com)
- {{password}} with your user password as value.
```

For more info check API Documentation on Postman 👉🏻 [Natours API Documentation](https://documenter.getpostman.com/view/30055418/2s9Ykhi55t#5fd4b9c4-30ce-4f56-86ef-20234dc0645b).

<b> API Features: </b>

Tours List 👉🏻 https://natours-tvyz.onrender.com/api/v1/tours

Tours State 👉🏻 https://natours-tvyz.onrender.com/api/v1/tours/tour-stats

Get Top 5 Cheap Tours 👉🏻 https://natours-tvyz.onrender.com/api/v1/tours/top-5-cheap

Get Tours Within Radius 👉🏻 https://natours-tvyz.onrender.com/api/v1/tours/tours_within/200/center/34.111745,%20-118.113491/unit/mi

---

## How To Use 🤔

### Book a Tour 🌐

1. **Login to the site.**
2. **Search for tours.**
3. **Book a tour.**
4. **Proceed to the payment checkout page.**
5. **Enter the card details (Test Mode):**
    - _Card No._: 4242 4242 4242 4242
    - _Expiry date_: 02 / 25
    - _CVV_: 222
6. **Finished!**

### Manage Bookings 📅

-   Check booked tours on the "Manage Booking" page in user settings.

### Update Profile 🔄

-   Update username, profile photo, email, and password.

---

## Setting Up Your Local Environment

Follow these steps to set up your local environment for the Natours app:

1. **Clone the Repository:**
   Clone this repository to your local machine:
    ```bash
    git clone https://github.com/AhmedSalman1/Natours.git
    cd natours
    ```
2. **Install Dependencies:**
   Run the following command to install all the required dependencies:
    ```bash
    npm install
    ```
3. **Configure Environment Variables:**

    Before you can run the Natours app, you need to set up your environment variables. These variables store sensitive information required for the app to function properly. Follow these steps to configure your environment variables:

    1. **Create a `.env` File:**
       In the root directory of the app, create a file named `.env`.

    2. **Add the Following Environment Variables:**
       Replace the placeholders with your actual information. You might need to sign up for accounts and services to obtain the required credentials.

        ```dotenv

        # MongoDB Configuration
        DATABASE=your-mongodb-database-url
        USERNAME=your-mongodb-username
        DATABASE_PASSWORD=your-mongodb-password

        # JSON Web Token Configuration
        SECRET=your-json-web-token-secret
        JWT_EXPIRES_IN=90d
        JWT_COOKIE_EXPIRES_IN=90

        # Stripe Configuration
        STRIPE_SECRET_KEY=your-stripe-secret-key
        STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

        ```

---

# Installation 🛠️

You can get the Natours app up and running on your local machine using the following steps:

1.  **Fork or Git-clone:**

    -   You can fork the app on GitHub or git-clone it into your local machine.

2.  **Install Dependencies and Set Environment Variables:**

    ```
    $ npm i
    Set your env variables
    ```

3.  **Build and Run Commands:**

    ```
    $ npm run watch:js
    $ npm run build:js
    $ npm run dev (for development)
    $ npm run start:prod (for production)
    $ npm run debug (for debug)
    $ npm start
    ```

4.  **Setting up ESLint and Prettier in VS Code 👇🏻:**
    ```
    $ npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node
    eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
    ```

---

## Built With 🔮

-   [NodeJS](https://nodejs.org/en/) - JS runtime environment
-   [Express](http://expressjs.com/) - The web framework used
-   [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
-   [Pug](https://pugjs.org/api/getting-started.html) - High performance template engine
-   [JSON Web Token](https://jwt.io/) - Security token
-   [ParcelJS](https://parceljs.org/) - Blazing fast, zero configuration web application bundler
-   [Stripe](https://stripe.com/) - Online payment API and Making payments on the app.
-   [Postman](https://www.getpostman.com/) - API testing
-   [Brevo](https://www.brevo.com/) - Email delivery platform
-   [Render](https://render.com/) - Cloud platform
-   [Leaflet](https://leafletjs.com/) - Displaying the different locations of each tour.

---

## Future Updates

-   Enable PWA
-   Improve overall UX/UI and fix bugs
-   Featured Tours
-   Recently Viewed Tours
-   And More! There's always room for improvement!

---

## Acknowledgement

-   This project is part of the online course I've taken at Udemy. Thanks to Jonas Schmedtmann for creating this awesome course! Link to the course: [Node.js, Express, MongoDB & More: The Complete Bootcamp 2019](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/)
