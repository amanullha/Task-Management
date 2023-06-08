
const UserModel = require('../models/user');
const {
    encryptPassword,
    checkPassword,
    generateAccessToken,
    generateRefreshToken,
    verifyUser,
    generateTokens
} = require('../helpers/auth.helper');

exports.getAllUsers = async () => {
    const users = await UserModel.find().lean();;
    return users;
}
exports.getOneUser = async (userId) => {
    try {
        if (userId) {
            const res = await UserModel.findById(userId).exec();
            const user = await res.toObject();
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        else {
            throw new Error("invalid userId");
        }
    } catch (error) {
        throw new Error('Failed to get user: ' + error.message);
    }
}



exports.createUserServices = async (data) => {
    const userObj = await constructUserObject(data);
    const result = await UserModel.create(userObj);
    const returnUser = constructReturnUserObject(result);
    return returnUser;
}
exports.replaceToken = async (token) => {
    const user = await verifyUser(token);
    const tokens = await generateTokens({ email: user.email, name: user.name, _id: user?._id });
    if (user) {
        return {
            user: user,
            tokens: tokens
        };
    }
}

exports.loginUserServices = async (data) => {
    const email = data.email;
    const user = await UserModel.findOne({ email: email }).lean();
    if (user._id) {
        const pass = user.password;
        const isMatch = await checkPassword(data.password, pass);
        if (isMatch) {
            return {
                user: user,
                tokens: await generateTokens({ email: user.email, name: user.name, _id: user?._id })
            };
        }

    }
    return null;
}

async function constructUserObject(data) {
    let pass = await encryptPassword(data.password);

    let obj = {
        name: data.name ?? '',
        email: data.email ?? '',
        password: pass,
        userType: data.userType ?? 'user',
    }
    return obj;
}
async function constructReturnUserObject(data) {
    let user = {
        name: data.name ?? '',
        email: data.email ?? '',
        _id: data._id ?? "",
    }
    let tokens = generateTokens(user)
    return {
        user: user,
        tokens: tokens
    };
}

// exports.getUserByIdServices = async (id) => {

//     const filter = { _id: id };
//     const update = { $inc: { visitedCount: 1 } }

//     const data = await UserModel.findOneAndUpdate(filter, update, {
//         new: true
//     });

//     return data;

// }
// exports.updateUserByIdService = async (id, data) => {

//     // const result = await UserPackage.updateOne({ _id: id }, { $set: data }, { runValidators: true });
//     const result = await UserModel.updateOne({ _id: id }, { $set: data });

//     return result;

// }



























