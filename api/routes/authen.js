import { Router } from 'express';
const router = Router();
const sql = require('../dbconfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {check,validationResult} = require('express-validator');
const authen = require('../middleware/authen');
 
router.get("/menu_admin_coba", async(req,res) => {
    console.log('query');
    console.log(req.query);

    let Page = Number.parseInt(req.query.page);
    let PerPage = Number.parseInt(req.query.perPage);
    let Offset = (Page - 1) * PerPage;

    //Sorting disini
    console.log('req.query.sort :>> ', req.query.sort);
    //LANJUT PROSES SORTING UNTUK QUERY!!!

    try {
        let queryNya = `SELECT SQL_CALC_FOUND_ROWS
                            id,
                            first_name,
                            last_name,
                            email,
                            CONCAT('',birthdate) AS birthdate,
                            CONCAT('',added) AS added
                        FROM
                            authors
                        LIMIT ?,?
                        `;
        const DataAuthor = await sql.query(queryNya, [Offset,PerPage]);

        //Get Total Rows
        queryNya = `SELECT
                        COUNT(*) AS total
                    FROM
                        authors`;
        const DataTotalRows = await sql.query(queryNya);

        return res.status(200).json({success: true, message: 'Call Success', DataGrid: DataAuthor, TotalRows: DataTotalRows[0].total});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get("/refresh", authen, async(req,res) => {
    //Buat payload token jwt
    const JwtPayload = {
        UserId: req.userauth.UserId,
        UserEmail: req.userauth.UserEmail,
        UserFullname: req.userauth.UserFullname
    };

    jwt.sign(
        JwtPayload,
        process.env.JWTSECRET,
        { expiresIn: 3600 },
        (err, token) => {
            if(err) return res.status(500).json({success: false, message: 'Refresh Token Failed'});

            const DataReturn = {
                UserId: req.userauth.UserId,
                UserEmail: req.userauth.UserEmail,
                UserFullname: req.userauth.UserFullname,
                Token: token
            };
            return res.status(200).json({success: true, message: 'Refresh Success', DataReturn: DataReturn});
        }
    );
});

router.post('/', [
    check('EmailLogin','Please include valid email').isEmail(),
    check('PasswordLogin','Password is required').not().isEmpty()
], async (req, res) => {
    //validator
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const ObjErr = errors.array();
        let ExValMsg = [];
        Object.keys(ObjErr).forEach(key => {
            ExValMsg.push(ObjErr[key].msg);
        });
        return res.status(200).json({success:false, message: ExValMsg.join('<br>') });
    }

    //console.log(req.body);
    //Pakai yg x-www-form-urlencoded
    const { EmailLogin, PasswordLogin } = req.body;
    
    try {
        /*const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPTGENSALT));
        const PasswordNya = await bcrypt.hash('Niko123!',salt);
        console.log(PasswordNya);*/

        //Cari user by alamat email
        const queryNya = `
                        SELECT
                            a.UserId,
                            a.UserEmail,
                            a.UserFullname,
                            a.UserPassword
                        FROM
                            users a
                        WHERE 1=1
                            AND a.UserEmail = ?
                        LIMIT 1
                        `;
        const DataUser = await sql.query(queryNya,[EmailLogin]);
        if(DataUser[0]) {

            //Check passwordnya match tidak
            const isMatch = await bcrypt.compare(PasswordLogin, DataUser[0].UserPassword);
            if(!isMatch){
                return res.status(200).json({success: false, message: 'Login Gagal Coy'});
            }

            //Buat payload token jwt
            const JwtPayload = {
                UserId: DataUser[0].UserId,
                UserEmail: DataUser[0].UserEmail,
                UserFullname: DataUser[0].UserFullname
            };

            jwt.sign(
                JwtPayload,
                process.env.JWTSECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if(err) return res.status(200).json({success: false, message: 'Login Gagal Coy'});

                    const DataReturn = {
                        UserId: DataUser[0].UserId,
                        UserEmail: DataUser[0].UserEmail,
                        UserFullname: DataUser[0].UserFullname,
                        Token: token
                    };
                    return res.status(200).json({success: true, message: 'Login Success', DataReturn: DataReturn});
                }
            );
        } else {
            return res.status(200).json({success: false, message: 'Login Gagal Coy'});
        }
    } catch(err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }

    /*let queryNya = "SELECT * FROM users";
    const DataSql = await sql.query(queryNya);
    console.log(DataSql);*/

    //return res.status(500).json({success: 'failed'}); //ini akan masuk dicatch
    //return res.status(200).json({success: true, message: 'Test OK', results}); //ini success
    //return res.status(200).json({success: false, message: 'Gagal', results}); //ini gagal secara program flow
});
 
export default router;