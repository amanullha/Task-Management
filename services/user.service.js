
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

exports.createUserServices = async (data) => {
    const userObj = await constructUserObject(data);
    const result = await UserModel.create(userObj);
    const returnUser = constructReturnUserObject(result);
    return returnUser;
}
exports.replaceToken = async (token) => {
    const user = await verifyUser(token);
    const tokens = await generateTokens({ email: user.email, name: user.name });
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
                tokens: await generateTokens({ email: user.email, name: user.name })
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



























