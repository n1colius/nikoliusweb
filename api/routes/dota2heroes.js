import { Router } from 'express';
const router = Router();
const sql = require('../dbconfig');
const {check,validationResult} = require('express-validator');
const authen = require('../middleware/authen');

router.get('/', authen, async(req,res) => {
    let Page = Number.parseInt(req.query.page);
    let PerPage = Number.parseInt(req.query.perPage);
    let Offset = (Page - 1) * PerPage;
    let SortFilter = req.query.sort;
    let SortArrayQuery = []; //Array
    let ObjTmp = {};
    let SortQuery = 'HeroName asc'; //default sorting

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
    if(SearchString.SearchName != '') {
        SearchQuery = SearchQuery+` AND a.HeroName LIKE '%${SearchString.SearchName}%' `;
    }

    try {
        let queryNya = `SELECT
                            a.HeroID
                            , a.HeroName
                            , CONCAT('<img src="',a.Picture,'" />') AS Picture
                            , GROUP_CONCAT(b.Roles SEPARATOR ', ') AS Roles
                        FROM
                            dota_heroes a
                            LEFT JOIN dota_heroes_roles b ON a.HeroID = b.HeroID
                        WHERE 1=1
                            ${SearchQuery}
                        GROUP BY a.HeroID
                        ORDER BY ${SortQuery}
                        LIMIT ?,?`;
        const DataGrid = await sql.query(queryNya, [Offset,PerPage]);

        //Get Total Rows
        queryNya = `SELECT
                        COUNT(a.HeroID) AS total
                    FROM
                        dota_heroes a
                    WHERE 1=1
                        ${SearchQuery}`;
        const DataTotalRows = await sql.query(queryNya);

        return res.status(200).json({success: true, message: 'Call Success', DataGrid: DataGrid, TotalRows: DataTotalRows[0].total});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get('/form/:id', authen, async(req,res) => {
    //Param
    let Querynya;
    const HeroID = parseInt(req.params.id);

    try {
        Querynya = `SELECT
                        a.HeroID,
                        a.HeroName,
                        a.Picture,
                        a.PrimAttr,
                        a.AttackType,
                        GROUP_CONCAT(b.Roles) AS HeroRoles
                    FROM
                        dota_heroes a
                        LEFT JOIN dota_heroes_roles b ON a.HeroID = b.HeroID
                    WHERE
                        a.HeroID = ?
                    GROUP BY a.HeroID
                    LIMIT 1`;
        const DataForm = await sql.query(Querynya, [HeroID]);

        return res.status(200).json({success: true, message: 'Call Success', DataForm: DataForm[0]});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.post('/isi', authen, async(req,res) => {
    let Query;
    let { FormAction,FormHeroID, FormHeroName, FormPicture, FormAttackType, FormPrimAttr, FormHeroRoles } = req.body;
    if(!FormPicture) FormPicture = null;
    FormHeroID = Number.parseInt(FormHeroID);

    try {
        if(FormAction == 'insert') {
            //Insert
            Query = `INSERT INTO dota_heroes SET
                    HeroID = ?,
                    HeroName = ?,
                    NpcHero = ?,
                    Picture = ?,
                    PrimAttr = ?,
                    AttackType = ?`;
            const ProsesInsert = await sql.query(Query,[FormHeroID, FormHeroName, FormHeroName, FormPicture, FormPrimAttr, FormAttackType]);

            //Roles
            for(let role of FormHeroRoles) {
                Query = `INSERT INTO dota_heroes_roles SET
                        HeroID = ?,
                        Roles = ?`;
                await sql.query(Query, [ProsesInsert.insertId, role]);
            }
        } else {
            //Update
            Query = `UPDATE dota_heroes SET
                        HeroName = ?,
                        Picture = ?,
                        PrimAttr = ?,
                        AttackType = ?
                    WHERE
                        HeroID = ?
                    LIMIT 1`;
            const ProsesUpdate = await sql.query(Query,[FormHeroName, FormPicture, FormPrimAttr, FormAttackType, FormHeroID]);

            //Delete tag baru insert lagi
            await sql.query(`DELETE FROM dota_heroes_roles WHERE HeroID = ?`, [FormHeroID]);

            //Roles
            for(let role of FormHeroRoles) {
                Query = `INSERT INTO dota_heroes_roles SET
                        HeroID = ?,
                        Roles = ?`;
                await sql.query(Query, [FormHeroID, role]);
            }
        }

        return res.status(200).json({success: true, message: 'Data Saved'});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.post('/hapus', [authen, [
    check('HeroID','ID is required').not().isEmpty(),
    check('HeroID','ID not valid').isNumeric()
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
    const { HeroID } = req.body;

    try {
        Querynya = `DELETE FROM dota_heroes WHERE HeroID = ?`;
        const QueryDelete = await sql.query(Querynya,[HeroID]);
        //console.log('QueryDelete :>> ', QueryDelete);

        if(QueryDelete.affectedRows > 0) {
            return res.status(200).json({success: true, message: 'Data Deleted'});
        } else {
            return res.status(200).json({success: false, message: 'No Data Found'});
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get('/notesgrid', authen, async(req,res) => {
    let HeroID = Number.parseInt(req.query.HeroID);

    try {
        let queryNya = `SELECT
                            a.NotesID
                            , a.HeroID
                            , a.Notes
                        FROM
                            dota_heroes_notes a
                        WHERE 1=1
                            AND a.HeroID = ?
                        ORDER BY a.HeroID ASC`;
        const DataGrid = await sql.query(queryNya, [HeroID]);

        return res.status(200).json({success: true, message: 'Call Success', DataGrid: DataGrid});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get('/formnotes/:id', authen, async(req,res) => {
    //Param
    let Querynya;
    const NotesID = parseInt(req.params.id);

    try {
        Querynya = `SELECT
                        a.NotesID
                        , a.HeroID
                        , a.Notes
                    FROM
                        dota_heroes_notes a
                    WHERE 1=1
                        AND a.NotesID = ?
                    LIMIT 1`;
        const DataForm = await sql.query(Querynya, [NotesID]);

        return res.status(200).json({success: true, message: 'Call Success', DataForm: DataForm[0]});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.post('/isinotes', [authen, [
    check('PopupHeroNotes','Notes is empty').not().isEmpty(),
]] , async(req,res) => {
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

    let Query;
    let { FormHeroID, PopupNotesID, PopupHeroNotes } = req.body;
    PopupNotesID = Number.parseInt(PopupNotesID);

    try {
        if(isNaN(PopupNotesID)) {
            //Insert
            Query = `INSERT INTO dota_heroes_notes SET
                    HeroID = ?,
                    Notes = ?`;
            await sql.query(Query,[FormHeroID,PopupHeroNotes]);
        } else {
            //Update
            Query = `UPDATE dota_heroes_notes a SET
                        a.Notes = ?
                    WHERE
                        a.NotesID = ?
                    LIMIT 1`;
            await sql.query(Query,[PopupHeroNotes,PopupNotesID]);
        }

        return res.status(200).json({success: true, message: 'Data Saved'});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});   
    }
});

router.post('/hapusnotes', [authen, [
    check('NotesID','ID is required').not().isEmpty(),
    check('NotesID','ID not valid').isNumeric()
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
    const { NotesID } = req.body;

    try {
        Querynya = `DELETE FROM dota_heroes_notes WHERE NotesID = ?`;
        const QueryDelete = await sql.query(Querynya,[NotesID]);

        if(QueryDelete.affectedRows > 0) {
            return res.status(200).json({success: true, message: 'Data Deleted'});
        } else {
            return res.status(200).json({success: false, message: 'No Data Found'});
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get('/displayhero', async(req,res) => {
    let DataReturn = [];
    let Query;
    let SearchHeroName = req.query.SearchHeroName;
    let SearchHeroType = req.query.HeroType;

    try {
        Query = `SELECT
                    a.HeroID
                    , a.HeroName
                    , a.Picture
                    , a.AttackType
                    , GROUP_CONCAT(DISTINCT b.Roles separator ', ') AS Roles
                    , GROUP_CONCAT(DISTINCT c.Notes separator '@@') AS Notes
                FROM
                    dota_heroes a
                    LEFT JOIN dota_heroes_roles b ON a.HeroID = b.HeroID
                    LEFT JOIN dota_heroes_notes c ON a.HeroID = c.HeroID
                WHERE 1=1
                    AND a.PrimAttr = ?
                    AND a.HeroName LIKE ?
                GROUP BY a.HeroID`;
        DataReturn = await sql.query(Query, [SearchHeroType, `%${SearchHeroName}%`]);
        
        return res.status(200).json({success: true, message: 'Call Success', DataReturn: DataReturn});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});    
    }
});

export default router;