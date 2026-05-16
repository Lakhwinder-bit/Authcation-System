import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in envirment veriable")
}

if(!process.env.JWT_SECERT){
    throw new Error("JWT_SECERT is not defined in enveriment variable");
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in envirment veriable")
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in envirment veriable")
}

if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in envirment veriable")
}


if(!process.env.GOOGLE_USER){
    throw new Error("GOOGLE_USER is not defined in envirment veriable")
}

const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECERT:process.env.JWT_SECERT,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER:process.env.GOOGLE_USER

    
}

export default config;