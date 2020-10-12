/******************************************
 *  Author : n1colius.lau@gmail.com   
 *  Created On : Sat Aug 29 2020
 *  File : blogman.js
 *******************************************/
import { Router } from 'express';
const router = Router();
const sql = require('../dbconfig');
const {check,validationResult} = require('express-validator');
const authen = require('../middleware/authen');

router.get('/front', async(req,res) => {
    let DataBlog = [];
    let Query;
    let BlogCount = Number.parseInt(req.query.BlogCount);

    try {
        Query = `SELECT
                    a.BlogId
                    , a.BlogHeadlinePic
                    , a.BlogDesc
                    , a.BlogDate
                    , a.BlogTitle
                    , GROUP_CONCAT(c.TagName SEPARATOR ',') AS Tags
                FROM
                    blog a
                    LEFT JOIN blog_tags b ON a.BlogId = b.BlogId
                    LEFT JOIN tags c ON b.TagId = c.TagId
                WHERE 1=1
                    AND a.Status = 'active'
                GROUP BY a.BlogId
                ORDER BY a.BlogDate DESC
                LIMIT 0,? `;
        DataBlog = await sql.query(Query, [BlogCount]);

        //Get Total Rows
        Query = `SELECT
                        COUNT(tgrup.BlogID) AS total
                    FROM (SELECT
                        a.BlogId
                    FROM
                        blog a
                        LEFT JOIN blog_tags b ON a.BlogId = b.BlogId
                        LEFT JOIN tags c ON b.TagId = c.TagId
                    WHERE 1=1
                        AND a.Status = 'active'
                    GROUP BY a.BlogId
                    ) AS tgrup
                    `;
        const DataTotalRows = await sql.query(Query);

        return res.status(200).json({success: true, message: 'Call Success', DataBlog: DataBlog, TotalBlog: DataTotalRows[0].total});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get('/front/:id', async(req,res) => {
    //Param
    let Querynya;
    const BlogId = parseInt(req.params.id);

    try {
        Querynya = `SELECT
                        a.BlogId,
                        a.BlogTitle,
                        a.BlogDesc,
                        a.BlogHeadlinePic,
                        a.BlogArticle,
                        a.BlogDate,
                        GROUP_CONCAT(c.TagName SEPARATOR ',') AS BlogTags
                    FROM
                        blog a
                        LEFT JOIN blog_tags b ON a.BlogId = b.BlogId
                        LEFT JOIN tags c ON b.TagId = c.TagId
                    WHERE
                        a.BlogId = ?
                    GROUP BY a.BlogId
                    LIMIT 1`;
        const DataForm = await sql.query(Querynya, [BlogId]);

        return res.status(200).json({success: true, message: 'Call Success', DataForm: DataForm[0]});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get('/', authen, async(req,res) => {
    let Page = Number.parseInt(req.query.page);
    let PerPage = Number.parseInt(req.query.perPage);
    let Offset = (Page - 1) * PerPage;
    let SortFilter = req.query.sort;
    let SortArrayQuery = []; //Array
    let ObjTmp = {};
    let SortQuery = 'BlogDate desc'; //default sorting

    //Sorting disini
    if(Object.prototype.toString.call(SortFilter) === '[object Array]') {
        Object.keys(SortFilter).forEach(key => {
            ObjTmp = JSON.parse(SortFilter[key]);
            if(ObjTmp.field != 'action') SortArrayQuery.push(ObjTmp.field+' '+ObjTmp.type);
        });

        if(SortArrayQuery.length > 0) {
            SortQuery = SortArrayQuery.join(' , ');
        }
    }

    //Searching disini
    let SearchString = JSON.parse(req.query.columnFilters);
    let SearchQuery = '';
    if(SearchString.SearchTitle != '') {
        SearchQuery = SearchQuery+` AND a.BlogTitle LIKE '%${SearchString.SearchTitle}%' `;
    }

    try {
        let queryNya = `SELECT
                            a.BlogId
                            , a.BlogTitle
                            , CONCAT('',a.BlogDate) AS BlogDate
                            , GROUP_CONCAT(c.TagName SEPARATOR ', ') AS Tags
                        FROM
                            blog a
                            LEFT JOIN blog_tags b ON a.BlogId = b.BlogId
                            LEFT JOIN tags c ON b.TagId = c.TagId
                        WHERE 1=1
                            AND a.Status = 'active'
                            ${SearchQuery}
                        GROUP BY a.BlogId
                        ORDER BY ${SortQuery}
                        LIMIT ?,?`;
        const DataBlog = await sql.query(queryNya, [Offset,PerPage]);

        //Get Total Rows
        queryNya = `SELECT
                        COUNT(tgrup.BlogID) AS total
                    FROM (SELECT
                        a.BlogId
                    FROM
                        blog a
                        LEFT JOIN blog_tags b ON a.BlogId = b.BlogId
                        LEFT JOIN tags c ON b.TagId = c.TagId
                    WHERE 1=1
                        AND a.Status = 'active'
                        ${SearchQuery}
                    GROUP BY a.BlogId
                    ) AS tgrup
                    `;
        const DataTotalRows = await sql.query(queryNya);

        return res.status(200).json({success: true, message: 'Call Success', DataGrid: DataBlog, TotalRows: DataTotalRows[0].total});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.post('/hapus', [authen, [
    check('BlogId','ID is required').not().isEmpty(),
    check('BlogId','ID not valid').isNumeric()
]], async(req,res) => {
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

    //Param
    let Querynya;
    const { BlogId } = req.body;

    try {
        Querynya = `UPDATE blog a SET
                        a.Status = 'deleted'
                    WHERE
                        a.BlogId = ?
                    LIMIT 1`;
        const QueryDelete = await sql.query(Querynya,[BlogId]);
        //console.log('QueryDelete :>> ', QueryDelete);

        if(QueryDelete.affectedRows > 0) {
            return res.status(200).json({success: true, message: 'Data Deleted'});
        } else {
            return res.status(200).json({success: false, message: 'No Data Found'});
        }
    } catch (err) {
        
    }

    
});

router.get('/tags_ref', authen, async(req,res) => {
    try {
        let QueryNya = `SELECT
                            a.TagId AS id
                            , a.TagName AS label
                        FROM
                            tags a
                        ORDER BY a.TagId ASC`;
        const DataTags = await sql.query(QueryNya);
        return res.status(200).json({success: true, message: 'Call Success', DataTags: DataTags});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get('/form/:id', authen, async(req,res) => {
    //Param
    let Querynya;
    const BlogId = parseInt(req.params.id);

    try {
        Querynya = `SELECT
                        a.BlogId,
                        a.BlogTitle,
                        a.BlogDesc,
                        a.BlogHeadlinePic,
                        a.BlogArticle,
                        a.BlogDate,
                        GROUP_CONCAT(b.TagId) AS BlogTags
                    FROM
                        blog a
                        LEFT JOIN blog_tags b ON a.BlogId = b.BlogId
                    WHERE
                        a.BlogId = ?
                    GROUP BY a.BlogId
                    LIMIT 1`;
        const DataForm = await sql.query(Querynya, [BlogId]);

        return res.status(200).json({success: true, message: 'Call Success', DataForm: DataForm[0]});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.post('/isi', authen, async(req,res) => {
    let Query;
    let { FormBlogId, FormBlogTitle, FormBlogHeadlinePic, FormBlogDate, FormBlogDesc, FormBlogArticle, FormBlogTags  } = req.body;
    if(!FormBlogHeadlinePic) FormBlogHeadlinePic = null;
    if(!FormBlogDesc) FormBlogDesc = null;
    if(!FormBlogArticle) FormBlogArticle = null;
    FormBlogId = Number.parseInt(FormBlogId);

    try {
        if(isNaN(FormBlogId)) {
            //Insert
            Query = `INSERT INTO blog SET
                        BlogTitle = ?,
                        BlogDesc = ?,
                        BlogHeadlinePic = ?,
                        BlogArticle = ?,
                        BlogDate = ?
                    `;
            const ProsesInsert = await sql.query(Query,[FormBlogTitle, FormBlogDesc, FormBlogHeadlinePic, FormBlogArticle, FormBlogDate]);

            //tags
            for(let tag of FormBlogTags) {
                Query = `INSERT INTO blog_tags SET
                        BlogId = ?,
                        TagId = ?`;
                await sql.query(Query, [ProsesInsert.insertId, tag]);
            }
        } else {
            //Update
            Query = `UPDATE blog SET
                        BlogTitle = ?,
                        BlogDesc = ?,
                        BlogHeadlinePic = ?,
                        BlogArticle = ?,
                        BlogDate = ?
                    WHERE 
                        BlogId = ?
                    LIMIT 1`;
            await sql.query(Query,[FormBlogTitle, FormBlogDesc, FormBlogHeadlinePic, FormBlogArticle, FormBlogDate, FormBlogId]);

            //Delete tag baru insert lagi
            await sql.query(`DELETE FROM blog_tags WHERE BlogId = ?`, [FormBlogId]);

            for(let tag of FormBlogTags) {
                Query = `INSERT INTO blog_tags SET
                        BlogId = ?,
                        TagId = ?`;
                await sql.query(Query, [FormBlogId, tag]);
            }
        }

        return res.status(200).json({success: true, message: 'Data Saved'});    
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

export default router;