This is the production grade project structure

├── package.json  
├── .prettierignore  
├── .prettierrc  
├── README.md  
└── src

-   ├── app.js
-   ├── constants.js
-   ├── controllers
-   ├── db
-   ├── .env
-   ├── .env.sample
-   ├── index.js
-   ├── middlewares
-   ├── models
-   ├── routes
-   └── utils

We have to define the port on which the server will run and other things like api keys and etc. which should not be in the main code file, in the env files, here .env and .env.sample

We load them when the server will start like

```js
"node --env-file src/.env --env-file src/.env.sample --watch src/index.js";
```

we make a script of it in the package file.

then we use those env variables in the server file like

```js
const PORT = process.env.PORT || 8000;
```

here 8000 is default valie if defined port can't be initialised somehow.

## Flow of the backend

1. The first hand request (http) is sent to the app.js file by the browser or postman, means the app.js is the entypoint.

2. Then there are some routes imported in it (called mounting the routes), and sends appropriate request to the appropriate routes.

-   app.js mounts routers like:

    `app.use("/api/users", userRoutes);`

    This tells Express:

    &emsp; "If the request URL starts with /api/users, send it to the userRoutes module."

3. Then it goes to the route, where it has imported the controllers, where it sends the req. to appropriate controller

-   Inside userRoutes, routes are defined like:

    `router.get("/", getAllUsers);`

    Which means:

    &emsp; "If someone hits /api/users/ with a GET request, send it to getAllUsers controller."

4. The controller does the main job as per the logic written. It has the logic written like DB access, validation, computation, etc. and sends back the response using `res`.

-   We often also have:

    -   Middleware (e.g., auth) between routes and controllers
    -   Models used inside controllers (to talk to DB)

### middlewares

Middleware: A function in Express that runs during the request–response(i.e. in between req and resp) cycle to modify req, res, or pass control using next()

one such middleware is cors, which specifies who will be able to talk to out application

in .env if we write

```
CORS_ORIGIN=http://localhost:8080
```

then only req and resp will be done with localhost at 8000

use \* to allow all

---

for the database we will be using mogoDB atlas (online)

### Connecting a database

Always keep in mind two things:

1. DB may always throw error, therefore wrap it in try catch
2. It may take time, so always use async await.

> tip: never put a '/' at the end of any utl in env vars

```js
const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
```

The above url may work with the srv connection string, but not with the non-srv link for older versions.

-   In those cases the last DB_NAME thing must be excluded

also if there is some issue with DNS resolving in the dev system, there may be some srv type of error there, so using a non-srv link is a must.

## Standardize Errors and Responses from server

We keep this standard things in utils forlder.

1. asyncHandler:  
   This will handle all the type of requests like (get, post, etc.) by wrapping it all in the try catch block, it will also handle the asynchronous processes.

2. API response:  
   This will be a standard template for the responses of all the requests and apis, so that we do not miss imp parameters like status code, messages or etc. like this, in standard format.
3. API Errors:  
   This will handle all type of errors during api req, and errors, here we are also inheriting the built in class Error

## Heatlcheck routes

This just gives an endpoint specifically, to check whether everything is running fine or not.
On major cloud providers like aws etc. they require such endpoint to trigger their load balancers and all that mechanism to keep it running.

It is nothing just another route, which sends response with basic logic.

We can write it in the app.js (i.e. main file) but it is not standard practice to do so.

## Building models in mongoDB with mongoose and aggregation plugins

First of all we design the schema of our DB and then proceed to the following.

A model in mongoDB is like a blueprint or
constructor for documents in a specific collection.

-   it is like a class in cpp, and it defines
-   the shape of your data (Schema),
-   the collection it belongs to, and methods to interact with that data (CRUD operations, virtuals, statics, etc.)

### What is Aggregation in mongoDB

Aggregation in MongoDB is the process of processing data records and returning computed results.

### What is a pipeline in mongoDB

A pipeline is a series of stages, each transforming the data step by step, just like a Linux shell pipeline or a stream of filters in C++ STL.
e.g. Input Collection → [ Stage 1 ] → [ Stage 2 ] → [ Stage 3 ] → Final Output

common pipeline stages

| Stage      | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| `$match`   | Filters documents (like `WHERE` in SQL)                      |
| `$project` | Selects specific fields (like `SELECT column`)               |
| `$group`   | Groups documents (like `GROUP BY`) and performs calculations |
| `$sort`    | Sorts the documents                                          |
| `$limit`   | Limits the number of documents                               |
| `$skip`    | Skips documents (for pagination)                             |
| `$lookup`  | Joins with another collection (like SQL JOIN)                |
| `$unwind`  | Deconstructs arrays into individual documents                |

### What is aggregation pipeline

Aggregation plugins are Mongoose-level extensions that help you work with aggregation pipelines more efficiently.

### Aggregation vs Query

| Task                                    | Regular Mongoose Query | Aggregation Pipeline    |
| --------------------------------------- | ---------------------- | ----------------------- |
| Find by ID                              | ✅ Simple              | ❌ Overkill             |
| Filter + Sort                           | ✅ Basic               | ✅ Both work            |
| Grouping / Summing / Joins              | ❌ Impossible          | ✅ Must use Aggregation |
| Complex stats, averages, nested filters | ❌                     | ✅                      |

## What we are actually doing in the models dir

We design a schema first (either from some er diagrams or anything).
Then the mongoose will model a document with the structure as the schema which will be helpful when querying, filtering etc. with the database.

we have to first import schema and mongoose from mongoose, and create a new instance of the class Schema and define schema using constructor.

Then at last we export the mongoose model.

## Hooks in mongoose

These are just middlewares.
There are two types of it: preehooks and posthooks.

### Schema methods

We can add methods to schema like, `schema.method('nameOfMethod', function () => {})`, in schema of any of the model, which makes it behave it like the part of the schema itself.  
Usually written in controllers/ but sometimes it is closely related and limited to the model only, may be written in models/

### To encrypt passwords

We use standard libraries.  
We have to encrypt the passwords before storing them in the DB, there are some inbuilt modules in node itself.

## Tokens and JSON Web Token (JWT)

A token is a string(like a key), which is used to get into secure routes like the profile of a user etc.

### Access Token:

-   Short-lived (e.g., 15 minutes)
-   Used to access protected APIs
-   Typically sent in headers: Authorization: Bearer <token>

### Refresh Token:

-   Long-lived (e.g., 7 days, 30 days)
-   Used to get a new access token without logging in again
-   Stored securely (e.g., in HttpOnly cookies or secure storage)
-   If a refresh token is stolen, the attacker can keep generating access tokens

### What is a JWT

A JWT is a compact, self-contained token format.

It has three parts: `<headers>`, `<payload>`, `<signature>`

-   Header – specifies the algorithm used
-   Payload – contains user data (e.g., userId)
-   Signature – ensures the token wasn't tampered with

### The flow of JWT auth

1. User logs in with credentials.
1. Server verifies and creates:
    - an access token (JWT)
    - optionally, a refresh token
1. Client uses the access token to make API calls.
1. When the access token expires, the client uses the refresh token to get a new one.

## What are cookies

Cookies are small pieces of data stored on the client (browser) and sent to the server with every HTTP request.

They allow the server to remember state (like "you’re logged in") in the otherwise stateless HTTP protocol.

### Use Cases

-   Session management (loggedIn=true)
-   Authentication tokens (access/refresh tokens)
-   User preferences (theme=dark)
-   Tracking (e.g. userId=1234 for analytics)

## File handling

We first have to enable express to allow us upload files.

Then we further process it like store directly in db and use their url only all the way of put them in clloud providers like aws etc.

There is no feature in express about file handling, so we have to install some third party packages, here multer.

With it we can just save the files in our own system, it is required to make some helpers in utils/ to handle the uploading in cloudinary

## Flow of login

once the user is registered on the database, there is stored the refreshToken of him which is long lived.

When the user is logged in, he has both acc and refr. tokens with him.
We only have his ref. token stored in out DB.  
With each of his request to the server his acc. token goes with it and serevr too responds with the acc. token.

but acc. token is short lived, so it is not a good idea to log the user out each time.

To handle that, We send a special code like, 402 which the client knows, after the acc. token is expired.

After recieving that code, new ref and acc. tokens are generated for the user and for that the previous ref token, which was stored in out DB is used to match the user.
