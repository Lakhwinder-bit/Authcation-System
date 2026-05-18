import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in envirment veriable")
}

if(!process.env.JWT_SECERT){
    throw new Error("JWT_SECERT is not defined in enveriment variable");
}

if(!process.env.RESEND_API_KEY){
    throw new Error("RESEND_API_KEY is not defined in envirment veriable")
}

const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECERT:process.env.JWT_SECERT,
    RESEND_API_KEY:process.env.RESEND_API_KEY,

}

export default config;