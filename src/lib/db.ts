import mongoose from 'mongoose';
export default function connectDB(){
    try {
        
         mongoose.connect("mongodb://localhost:27017/DropAgent");
        
        console.log('Database Connection Successful!');
        return true;
    } catch (err) {
        console.log('Database connection error:', err);
        return false;
    }
    
}