import { UserRole, User, UserSource } from "../entity/User";

export const addUser = (
    userName: string,
    email: string,
    name: string,
    profilePhoto: string,
    source: UserSource,
    sourceId: string,
    role: UserRole.USER
) => {
    let user = new User();
    user.username = userName?.trim().toLowerCase();
    user.email = email?.trim().toLowerCase();
    user.fullname = name;
    user.profilePhoto = profilePhoto;
    user.source = source;
    user.sourceId = sourceId;
    user.role = role;
    return user.save()
}

export const getUserByEmail = (email: string) => {
    return User.findOneBy({
        email: email,
    });
}