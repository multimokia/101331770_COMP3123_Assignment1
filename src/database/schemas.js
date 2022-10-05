import { model, Schema } from "mongoose";

const EMAIL_PROP = {
    type: String,
    required: true,
    maxLength: 50,
    unique: true,
    validate: {
        validator: function (x) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
        },
        message: "{VALUE} is not a valid email."
    }
};

const userSchema = new Schema({
    username: { type: String, required: true, maxLength: 100, unique: true },
    email: EMAIL_PROP,
    password: { type: String, required: true },
});

const employeeSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 50 },
    email: EMAIL_PROP,
    gender: { type: String, maxLength: 25 },
    salary: { type: Number, required: true }
});

export const User = model("User", userSchema);
export const Employee = model("Employee", employeeSchema);
