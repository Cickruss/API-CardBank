const mongoose = require("mongoose")

async function main(params) {
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect(
            "mongodb+srv://CIckruss:apkL9mXi24jF4MTz@cluster0.sa5lfwf.mongodb.net/?retryWrites=true&w=majority"
        )
        console.log("Database connected!")
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}
module.exports = main