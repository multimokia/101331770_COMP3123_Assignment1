import { IUser, User } from "../database/schemas.js";
import { badRequest, BaseResponse, conflict, internalServerError, itemCreated, ok, unauthorized } from "../helpers/responses.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { API_SECRET } from "../index.js";

export async function registerUser(userInfo: IUser): Promise<BaseResponse> {
    return new Promise((resolve, reject) => {
        User.findOne({username: userInfo.username})
            .then(user => {
                if (user !== null) {
                    return reject(conflict({message: "User already exists."}));
                }

                if (userInfo.password.length > 50) {
                    return reject(badRequest({message: "Password must be no longer than 50 characters."}));
                }

                // No user with that name found. Let's create one
                new User({
                    username: userInfo.username,
                    email: userInfo.email,
                    password: bcrypt.hashSync(userInfo.password, 8)
                }).save()
                    .then(() => {
                        resolve(itemCreated({message: "User created successfully"}));
                    })
                    .catch(err => reject(internalServerError({message: err})));
            })
            .catch(err => reject(internalServerError({message: err})));
    });
}

export async function loginUser(username: string, password: string): Promise<BaseResponse> {
    return new Promise((resolve, reject) => {
        User.findOne({username: username})
            .then(user => {
                if (user === null) {
                    return reject(unauthorized());
                }

                // compare pws
                const isPasswordValid = bcrypt.compareSync(
                    password,
                    user.password
                );

                if (!isPasswordValid) {
                    return reject(unauthorized({message: "Invalid password."}));
                }

                // Otherwise, we should sign a token
                const token = jwt.sign(
                    {id: user.id},
                    API_SECRET!,
                    {expiresIn: 86400}
                );

                return resolve(ok({
                    username: user.username,
                    message: "User logged in successfully.",
                    jwt_token: token
                }));
            })
            .catch(() => {
                // In the interest of security, we do not allow the requester to know if an account exists with this info
                return reject(unauthorized({message: "Invalid password."}));
            });
    });
}
