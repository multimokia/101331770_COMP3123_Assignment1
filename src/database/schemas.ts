import { model, Schema } from "mongoose";

const EMAIL_PROP = {
    type: String,
    required: true,
    maxLength: 50,
    unique: true,
    validate: {
        validator: function(x: string) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
        },
        message: "{VALUE} is not a valid email."
    }
};

interface IUser {
    username: string,
    email: string,
    password: string
}

const userSchema = new Schema<IUser>({
    username: {type: String, required: true, maxLength: 100},
    email: EMAIL_PROP,
    password: {type: String, required: true},
});

interface IEmployee {
    first_name: string,
    last_name: string,
    email: string,
    gender?: string
    salary: number,
}

const employeeSchema = new Schema<IEmployee>({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 50},
    email: EMAIL_PROP,
    gender: {type: String, maxLength: 25},
    salary: {type: Number, required: true}
});

export const User = model<IUser>("User", userSchema);
export const Employee = model<IEmployee>("Employee", employeeSchema);
