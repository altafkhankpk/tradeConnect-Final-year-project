import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true
    },
    profileImage: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false
    },
    online: { // set status weather online or offline 
        type: Boolean,
        required: false,
    },
    offlineDate: { // set status date when it last time offline
        type: String,
        required: false,
    },
},{timestamps:true})

const User = mongoose.model("User", UserSchema);

export default User;
