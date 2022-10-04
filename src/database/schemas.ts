import { model, Schema } from "mongoose";

interface IUser {
    username: string,
    email: string,
    password: string
}

const userSchema = new Schema<IUser>({
    username: {type: String, required: true, maxLength: 100},
    email: {type: String, required: true, maxLength: 50, unique: true},
    password: {type: String, required: true, maxLength: 50},
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
    email: {type: String, maxLength: 50, unique: true},
    gender: {type: String, maxLength: 25},
    salary: {type: Number, required: true}
});

export const User = model<IUser>("User", userSchema);
export const Employee = model<IEmployee>("Employee", employeeSchema);
