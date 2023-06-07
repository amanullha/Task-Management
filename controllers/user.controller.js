
const _ = require('underscore');
const { createUserServices, getAllUsers, updateUserByIdService, getUserByIdServices, trendingUserService, cheapestUserService, loginUserServices, replaceToken } = require('../services/user.service')


// exports.getUser = async (req, res, next) => {


//     try {
//         let filters = { ...req.query };

//         const excludeFields = ['sort', 'page', 'limit', 'fields'];

//         excludeFields.forEach(field => delete filters[field]);

//         let filtersString = JSON.stringify(filters);

//         filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

//         filters = JSON.parse(filtersString);


//         const queries = {};


//         // set default page and limit 

//         let { page = 1, limit = 5 } = req.query;
//         page = Number(page);
//         limit = Number(limit);

//         const skip = (page - 1) * limit;
//         queries.skip = skip;
//         queries.limit = limit;


//         if (req.query.fields) {

//             const fields = req.query.fields.split(',').join(" ");
//             queries.fields = fields;
//         }

//         if (req.query.sort) {

//             const sort = req.query.sort.split(',').join(" ");
//             queries.sort = sort;
//         }


//         const data = await getUserServices(filters, queries);

//         if (!data.data.length) {

//             res.status(400).send({
//                 success: false,
//                 message: "Can't get the data!!",

//             })
//             return;
//         }

//         res.status(200).send({
//             success: true,
//             message: "Data get successfully!!",
//             data: data
//         })

//     } catch (error) {
//         res.status(400).send({

//             success: false,
//             message: "Can't get the data!!",
//             error: error.message

//         })
//     }


// }
exports.getAllUsers = async (req, res, next) => {
    try {
        const user = req.user;
        const data = await getAllUsers();
        if (!data.length) {
            res.status(400).send({
                success: false,
                message: "Can't get the data!!",
            })
            return;
        }

        res.status(200).send({
            success: true,
            message: "Data get successfully!!",
            data: data
        })

    } catch (error) {
        res.status(400).send({

            success: false,
            message: "Can't get the data!!",
            error: error.message

        })
    }


}
exports.replaceToken = async (req, res, next) => {
    try {
        const token = req.body.refreshToken;
        const response = await replaceToken(token);
        if (!response) {
            res.status(400).send({
                success: false,
                message: "invalid token",
            })
            return;
        }
        res.status(200).send({
            success: true,
            message: "Replace token successfully!!",
            data: response
        })

    } catch (error) {
        res.status(400).send({

            success: false,
            message: "invalid token",
            error: error.message

        })
    }


}




exports.createUser = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await createUserServices(data);
        res.status(200).send({
            success: true,
            message: "Data inserted successfully!!",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}
exports.loginUser = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await loginUserServices(data);
        if (result) {
            res.status(200).send({
                success: true,
                message: "Login successfully!!",
                data: result
            })
        }
        else {
            res.status(400).send({
                success: false,
                error: "user_not_found"
            })
        }

    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}

// exports.getUserById = async (req, res, next) => {


//     try {
//         const { id } = req.params;

//         const data = await getUserByIdServices(id);

//         if (_.isEmpty(data)) {

//             res.status(400).send({
//                 success: false,
//                 message: "Can't get the data!!",

//             })

//             return;
//         }

//         res.status(200).send({
//             success: true,
//             message: "Data get successfully!!",
//             data: data
//         })

//     } catch (error) {
//         res.status(400).send({

//             success: false,
//             message: "Can't get the data!!",
//             error: error.message

//         })
//     }
// }



// exports.updateUserById = async (req, res, next) => {


//     try {

//         const { id } = req.params;
//         const data = { ...req.body };


//         const result = await updateUserByIdService(id, data);

//         res.status(200).json({
//             success: true,
//             message: "Data Updated successfully",
//             data: result,
//         })


//     } catch (error) {
//         res.status(400).send({

//             success: false,
//             message: "Can't get the data!!",
//             error: error.message

//         })
//     }
// }






















