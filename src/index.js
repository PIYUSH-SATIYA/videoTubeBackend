import {app} from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server is running on ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error", error);
    });
