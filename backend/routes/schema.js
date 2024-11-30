import mongoose from 'mongoose';

// Signup schema
const newUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate email registrations
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: { 
        type: String, 
        required: true 
    },
});

// Middleware to ensure passwords match before saving
newUserSchema.pre('save', function (next) {
    if (this.password !== this.confirmPassword) {
        const err = new Error("Passwords do not match");
        return next(err);
    }
    next();
});

const Register = mongoose.model('Register', newUserSchema, 'Register');

export { Register };
