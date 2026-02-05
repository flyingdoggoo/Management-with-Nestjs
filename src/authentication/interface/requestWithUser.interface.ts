import  User  from "../../users/user.entity";
import { Response } from "express";
import { Exclude } from "class-transformer";
interface RequestWithUser extends Request {
    user: User;

    res?: Response;
}

export default RequestWithUser;