import mongoose from "mongoose";

const db = async() => {
    try{
        const connectionInstance = await mongoose.connect(`mongodb+srv://shivsingh1309:Shiv98765@cluster0.quqjob7.mongodb.net/medAR_db?retryWrites=true&w=majority&appName=Cluster0`)
        console.log(`\n MongoDB connected !! DB HOST :: ${connectionInstance.connection.host}`)
    } catch (error){
        console.log("Mongodb connection error", error);
        process.exit(1)
    }
}



export default db