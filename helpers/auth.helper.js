const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
require('dotenv').config();
async function encryptPassword(password) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Password encryption failed');
    }
}

// async function decryptPassword(password, hashedPassword) {
//     try {
//         const isMatch = await bcrypt.compare(password, hashedPassword);
//         return isMatch;
//     } catch (error) {
//         throw new Error('Password decryption failed');
//     }
// }

async function checkPassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Password check failed');
    }
}


function generateAccessToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACC_EXP });
    return token;
}

function generateRefreshToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REF_EXP });
    return token;
}

function generateTokens(user) {
    return {
        accessToken: generateAccessToken({ user: user }),
        refreshToken: generateRefreshToken({ user: user })
    }
}


function verifyUser(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.user;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.user = decoded.user;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Access token not found' });
    }
}
module.exports = {
    encryptPassword,
    checkPassword,
    generateAccessToken,
    generateRefreshToken,
    verifyUser,
    generateTokens,
    authenticateToken
};
