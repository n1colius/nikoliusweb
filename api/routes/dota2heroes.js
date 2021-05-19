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
    let HeroSearchValue = req.query.HeroSearchValue;
    let SearchHeroType = req.query.HeroType;
    let SearchHeroID = [];
    let SearhHeroIDStr = '';
    let ObjTmp = {};

    //Searching Hero
    if(Object.prototype.toString.call(HeroSearchValue) === '[object Array]') {
        Object.keys(HeroSearchValue).forEach(key => {
            ObjTmp = JSON.parse(HeroSearchValue[key]);
            SearchHeroID.push(ObjTmp.CmbHeroID);
        });

        if(SearchHeroID.length > 0) {
            SearhHeroIDStr = ' AND a.HeroID IN ('+SearchHeroID.join(',')+')';
        }
    }

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
                    ${SearhHeroIDStr}
                GROUP BY a.HeroID`;
        DataReturn = await sql.query(Query, [SearchHeroType]);
        
        return res.status(200).json({success: true, message: 'Call Success', DataReturn: DataReturn});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});    
    }
});

router.get('/cmbheroes', async(req,res) => {
    let DataReturn = [];
    let Query;

    try {
        Query = `SELECT
                    a.HeroID AS CmbHeroID
                    , a.HeroName AS CmbHeroName
                FROM
                    dota_heroes a
                WHERE 1=1
                ORDER BY a.HeroID ASC`;
        DataReturn = await sql.query(Query);
        return res.status(200).json({success: true, message: 'Call Success', DataReturn: DataReturn});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});    
    }
});

router.get('/analyze', async(req,res) => {
    let DataReturn = [];
    let Query, QueryWinLose, QueryInfoHero;
    let ValidasiParamSearch = true;
    let RadiantHeroSearchValue = req.query.RadiantHeroSearchValue;
    let DireHeroSearchValue = req.query.DireHeroSearchValue;
    let RadiantHeroID = [];
    let DireHeroID = [];
    let RadiantDireHeroID = [];
    let ObjTmp = {};
    let WinRate;
    let ResWinMatch, ResLoseMatch, ResInfoHero;

    let ReturnObj = {};
    let InfoHeroRadiant1;
    let InfoHeroRadiant2;
    let InfoHeroRadiant3;
    let InfoHeroRadiant4;
    let InfoHeroRadiant5;
    let InfoHeroDire1;
    let InfoHeroDire2;
    let InfoHeroDire3;
    let InfoHeroDire4;
    let InfoHeroDire5;
    let ReturnRadiant1 = [];
    let ReturnRadiant2 = [];
    let ReturnRadiant3 = [];
    let ReturnRadiant4 = [];
    let ReturnRadiant5 = [];
    let ReturnDire1 = [];
    let ReturnDire2 = [];
    let ReturnDire3 = [];
    let ReturnDire4 = [];
    let ReturnDire5 = [];

    function checkForDuplicates(array) {
        return new Set(array).size !== array.length
    }

    if(Object.prototype.toString.call(RadiantHeroSearchValue) === '[object Array]') {
        Object.keys(RadiantHeroSearchValue).forEach(key => {
            ObjTmp = JSON.parse(RadiantHeroSearchValue[key]);
            RadiantHeroID.push(ObjTmp.CmbHeroID);
            RadiantDireHeroID.push(ObjTmp.CmbHeroID);
        });
    }
    if(Object.prototype.toString.call(DireHeroSearchValue) === '[object Array]') {
        Object.keys(DireHeroSearchValue).forEach(key => {
            ObjTmp = JSON.parse(DireHeroSearchValue[key]);
            DireHeroID.push(ObjTmp.CmbHeroID);
            RadiantDireHeroID.push(ObjTmp.CmbHeroID);
        });
    }

    //Cek apakah masing2 5 hero yg terpilih, dan ada hero duplikat
    if(RadiantHeroID.length != 5) ValidasiParamSearch = false;
    if(DireHeroID.length != 5) ValidasiParamSearch = false;
    if(checkForDuplicates(RadiantDireHeroID)) ValidasiParamSearch = false;

    if(ValidasiParamSearch === false) {
        return res.status(200).json({success: false, message: 'Must select 5 heroes for each team and no duplicate heroes'});
    } else {

        QueryWinLose = `SELECT
                    COUNT(a.MatchID) AS Jumlah
                FROM
                    dota_matches_heroes_winstats a
                WHERE 1=1
                    AND a.HeroIDWin = ?
                    AND a.HeroIDLose = ?`;
        QueryInfoHero = `select
                            a.HeroName
                            , a.Picture
                        from
                            dota_heroes a
                        where 1=1
                            and a.HeroID = ?
                        limit 1`;


        //INFO HERO ========================= (Begin)
        InfoHeroRadiant1 = await sql.query(QueryInfoHero, [RadiantHeroID[0]]);
        InfoHeroRadiant2 = await sql.query(QueryInfoHero, [RadiantHeroID[1]]);
        InfoHeroRadiant3 = await sql.query(QueryInfoHero, [RadiantHeroID[2]]);
        InfoHeroRadiant4 = await sql.query(QueryInfoHero, [RadiantHeroID[3]]);
        InfoHeroRadiant5 = await sql.query(QueryInfoHero, [RadiantHeroID[4]]);
        InfoHeroDire1 = await sql.query(QueryInfoHero, [DireHeroID[0]]);
        InfoHeroDire2 = await sql.query(QueryInfoHero, [DireHeroID[1]]);
        InfoHeroDire3 = await sql.query(QueryInfoHero, [DireHeroID[2]]);
        InfoHeroDire4 = await sql.query(QueryInfoHero, [DireHeroID[3]]);
        InfoHeroDire5 = await sql.query(QueryInfoHero, [DireHeroID[4]]);
        //INFO HERO ========================= (End)

        //================================================================================= RADIANT Hero 1 (BEGIN) =======================================================
        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[0], DireHeroID[0]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[0], RadiantHeroID[0]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant1[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire1[0].Picture;
        ReturnRadiant1.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire1[0].HeroName;
        ObjTmp.Picture = InfoHeroDire1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant1[0].Picture;
        ReturnDire1.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[0], DireHeroID[1]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[1], RadiantHeroID[0]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant1[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire2[0].Picture;
        ReturnRadiant1.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire2[0].HeroName;
        ObjTmp.Picture = InfoHeroDire2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant1[0].Picture;
        ReturnDire2.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[0], DireHeroID[2]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[2], RadiantHeroID[0]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant1[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire3[0].Picture;
        ReturnRadiant1.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire3[0].HeroName;
        ObjTmp.Picture = InfoHeroDire3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant1[0].Picture;
        ReturnDire3.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[0], DireHeroID[3]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[3], RadiantHeroID[0]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant1[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire4[0].Picture;
        ReturnRadiant1.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire4[0].HeroName;
        ObjTmp.Picture = InfoHeroDire4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant1[0].Picture;
        ReturnDire4.push(ObjTmp);
        

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[0], DireHeroID[4]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[4], RadiantHeroID[0]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant1[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire5[0].Picture;
        ReturnRadiant1.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire5[0].HeroName;
        ObjTmp.Picture = InfoHeroDire5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant1[0].Picture;
        ReturnDire5.push(ObjTmp);
        //================================================================================= RADIANT Hero 1 (END) =======================================================

        //================================================================================= RADIANT Hero 2 (BEGIN) =======================================================
        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[1], DireHeroID[0]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[0], RadiantHeroID[1]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant2[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire1[0].Picture;
        ReturnRadiant2.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire1[0].HeroName;
        ObjTmp.Picture = InfoHeroDire1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant2[0].Picture;
        ReturnDire1.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[1], DireHeroID[1]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[1], RadiantHeroID[1]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant2[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire2[0].Picture;
        ReturnRadiant2.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire2[0].HeroName;
        ObjTmp.Picture = InfoHeroDire2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant2[0].Picture;
        ReturnDire2.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[1], DireHeroID[2]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[2], RadiantHeroID[1]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant2[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire3[0].Picture;
        ReturnRadiant2.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire3[0].HeroName;
        ObjTmp.Picture = InfoHeroDire3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant2[0].Picture;
        ReturnDire3.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[1], DireHeroID[3]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[3], RadiantHeroID[1]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant2[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire4[0].Picture;
        ReturnRadiant2.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire4[0].HeroName;
        ObjTmp.Picture = InfoHeroDire4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant2[0].Picture;
        ReturnDire4.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[1], DireHeroID[4]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[4], RadiantHeroID[1]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant2[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire5[0].Picture;
        ReturnRadiant2.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire5[0].HeroName;
        ObjTmp.Picture = InfoHeroDire5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant2[0].Picture;
        ReturnDire5.push(ObjTmp);
        //================================================================================= RADIANT Hero 2 (END) =======================================================

        //================================================================================= RADIANT Hero 3 (Begin) =======================================================
        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[2], DireHeroID[0]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[0], RadiantHeroID[2]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant3[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire1[0].Picture;
        ReturnRadiant3.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire1[0].HeroName;
        ObjTmp.Picture = InfoHeroDire1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant3[0].Picture;
        ReturnDire1.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[2], DireHeroID[1]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[1], RadiantHeroID[2]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant3[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire2[0].Picture;
        ReturnRadiant3.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire2[0].HeroName;
        ObjTmp.Picture = InfoHeroDire2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant3[0].Picture;
        ReturnDire2.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[2], DireHeroID[2]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[2], RadiantHeroID[2]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant3[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire3[0].Picture;
        ReturnRadiant3.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire3[0].HeroName;
        ObjTmp.Picture = InfoHeroDire3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant3[0].Picture;
        ReturnDire3.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[2], DireHeroID[3]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[3], RadiantHeroID[2]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant3[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire4[0].Picture;
        ReturnRadiant3.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire4[0].HeroName;
        ObjTmp.Picture = InfoHeroDire4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant3[0].Picture;
        ReturnDire4.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[2], DireHeroID[4]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[4], RadiantHeroID[2]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant3[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire5[0].Picture;
        ReturnRadiant3.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire5[0].HeroName;
        ObjTmp.Picture = InfoHeroDire5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant3[0].Picture;
        ReturnDire5.push(ObjTmp);
        //================================================================================= RADIANT Hero 3 (END) =======================================================

        //================================================================================= RADIANT Hero 4 (BEGIN) =======================================================
        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[3], DireHeroID[0]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[0], RadiantHeroID[3]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant4[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire1[0].Picture;
        ReturnRadiant4.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire1[0].HeroName;
        ObjTmp.Picture = InfoHeroDire1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant4[0].Picture;
        ReturnDire1.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[3], DireHeroID[1]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[1], RadiantHeroID[3]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant4[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire2[0].Picture;
        ReturnRadiant4.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire2[0].HeroName;
        ObjTmp.Picture = InfoHeroDire2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant4[0].Picture;
        ReturnDire2.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[3], DireHeroID[2]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[2], RadiantHeroID[3]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant4[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire3[0].Picture;
        ReturnRadiant4.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire3[0].HeroName;
        ObjTmp.Picture = InfoHeroDire3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant4[0].Picture;
        ReturnDire3.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[3], DireHeroID[3]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[3], RadiantHeroID[3]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant4[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire4[0].Picture;
        ReturnRadiant4.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire4[0].HeroName;
        ObjTmp.Picture = InfoHeroDire4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant4[0].Picture;
        ReturnDire4.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[3], DireHeroID[4]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[4], RadiantHeroID[3]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant4[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire5[0].Picture;
        ReturnRadiant4.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire5[0].HeroName;
        ObjTmp.Picture = InfoHeroDire5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant4[0].Picture;
        ReturnDire5.push(ObjTmp);
        //================================================================================= RADIANT Hero 4 (END) =======================================================

        //================================================================================= RADIANT Hero 5 (BEGIN) =======================================================
        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[4], DireHeroID[0]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[0], RadiantHeroID[4]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant5[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire1[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire1[0].Picture;
        ReturnRadiant5.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire1[0].HeroName;
        ObjTmp.Picture = InfoHeroDire1[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant5[0].Picture;
        ReturnDire1.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[4], DireHeroID[1]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[1], RadiantHeroID[4]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant5[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire2[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire2[0].Picture;
        ReturnRadiant5.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire2[0].HeroName;
        ObjTmp.Picture = InfoHeroDire2[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant5[0].Picture;
        ReturnDire2.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[4], DireHeroID[2]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[2], RadiantHeroID[4]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant5[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire3[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire3[0].Picture;
        ReturnRadiant5.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire3[0].HeroName;
        ObjTmp.Picture = InfoHeroDire3[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant5[0].Picture;
        ReturnDire3.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[4], DireHeroID[3]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[3], RadiantHeroID[4]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant5[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire4[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire4[0].Picture;
        ReturnRadiant5.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire4[0].HeroName;
        ObjTmp.Picture = InfoHeroDire4[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant5[0].Picture;
        ReturnDire4.push(ObjTmp);

        ResWinMatch = await sql.query(QueryWinLose, [RadiantHeroID[4], DireHeroID[4]]);
        ResLoseMatch = await sql.query(QueryWinLose, [DireHeroID[4], RadiantHeroID[4]]);
        WinRate = ( ResWinMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroRadiant5[0].HeroName;
        ObjTmp.Picture = InfoHeroRadiant5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroDire5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroDire5[0].Picture;
        ReturnRadiant5.push(ObjTmp);
        WinRate = ( ResLoseMatch[0].Jumlah / ( ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah ) ) * 100;
        ObjTmp = {};
        ObjTmp.WinRate = parseFloat(WinRate).toFixed(1);
        if(isNaN(ObjTmp.WinRate)) ObjTmp.WinRate = 0;
        ObjTmp.TotalMatch = ResWinMatch[0].Jumlah + ResLoseMatch[0].Jumlah;
        ObjTmp.Hero = InfoHeroDire5[0].HeroName;
        ObjTmp.Picture = InfoHeroDire5[0].Picture;
        ObjTmp.HeroAgainst = InfoHeroRadiant5[0].HeroName;
        ObjTmp.PictureAgainst = InfoHeroRadiant5[0].Picture;
        ReturnDire5.push(ObjTmp);
        //================================================================================= RADIANT Hero 5 (END) =======================================================

        //console.log(`ReturnRadiant1:`,ReturnRadiant1);
        ReturnObj.ObjRadiant1 = ReturnRadiant1;
        ReturnObj.ObjRadiant2 = ReturnRadiant2;
        ReturnObj.ObjRadiant3 = ReturnRadiant3;
        ReturnObj.ObjRadiant4 = ReturnRadiant4;
        ReturnObj.ObjRadiant5 = ReturnRadiant5;
        ReturnObj.ObjDire1 = ReturnDire1;
        ReturnObj.ObjDire2 = ReturnDire2;
        ReturnObj.ObjDire3 = ReturnDire3;
        ReturnObj.ObjDire4 = ReturnDire4;
        ReturnObj.ObjDire5 = ReturnDire5;

        return res.status(200).json({success: true, ReturnObj:ReturnObj, message: 'Process Success'});
    }
});

export default router;