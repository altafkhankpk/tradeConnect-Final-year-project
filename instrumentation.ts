import { DbConnect } from "@/lib/db";
import { connect } from "http2";



export default function register(){
    console.log("Registering DB Connection")
     DbConnect()
}