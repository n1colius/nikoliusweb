import { Router } from 'express';
const router = Router();
const sql = require('../dbconfig');
const fs = require('fs');
const axios = require('axios');

router.get('/heroes', async(req,res) => {
    let data = JSON.parse(fs.readFileSync(__dirname + '/../json/dotaheroes.json', 'utf8'));
    let Query;
    let DataProses = [], DataProsesRoles = [];

    try {
        for (let i = 0; i < data.length; i++) {
            //console.log('data[i] => ', data[i]);
            Query = `INSERT INTO dota_heroes SET
                HeroID = ?,
                HeroName = ?,
                NpcHero = ?,
                PrimAttr = ?,
                AttackType = ?`;
            DataProses = await sql.query(Query, [data[i].id, data[i].localized_name, data[i].name, data[i].primary_attr, data[i].attack_type]);
    
            for (let j = 0; j < data[i].roles.length; j++) {
                //console.log('data[i].roles[j] => ', data[i].roles[j]);
                Query = `INSERT INTO dota_heroes_roles SET
                            HeroID = ?,
                            Roles = ?`;
                DataProsesRoles = await sql.query(Query, [data[i].id, data[i].roles[j]]);
            }
        }
    
        return res.status(200).json({success: true, message: 'Call Success'});    
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});    
    }
});

router.get('/leagues', async(req,res) => {
    let data = JSON.parse(fs.readFileSync(__dirname + '/../json/dotaleagues.json', 'utf8'));
    let Query;

    try {
        for (let i = 0; i < data.length; i++) {
            Query = `INSERT INTO dota_leagues (LeagueID,LeagueName)
                        VALUES (?,?)
                        ON DUPLICATE KEY
                            UPDATE LeagueName=?`;
            await sql.query(Query, [data[i].leagueid, data[i].name, data[i].name]);
        }
    
        return res.status(200).json({success: true, message: 'Call Success'});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }
});

router.get('/leaguematches', async(req,res) => {
    let data = JSON.parse(fs.readFileSync(__dirname + '/../json/dataleaguesmatch-1.json', 'utf8'));
    let Query, DataCekMatch;
    const leagueid = 12727;
    const patchid = 2;

    try {
        for (let i = 0; i < data.length; i++) {
            //console.log('data[i] => ', data[i]);
            
            Query = `SELECT
                        a.MatchID
                    FROM
                        dota_matches a
                    WHERE 1=1
                        AND a.MatchID = ?
                    LIMIT 1`;
            DataCekMatch = await sql.query(Query, [data[i].match_id]);
            //console.log(`DataCekMatch:`,DataCekMatch[0]);

            if (typeof DataCekMatch[0] !== 'undefined') {
                console.log('Match sudah ada');
            } else {
                Query = `INSERT INTO dota_matches SET
                    MatchID = ?,
                    LeagueID = ?,
                    PatchID = ?`;
                await sql.query(Query, [data[i].match_id, leagueid, patchid]);
            }
        }
    
        return res.status(200).json({success: true, message: 'Call Success'});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});    
    }
});

router.get('/matchesdet-single/:match_id', async(req,res) => {
    const match_id = parseInt(req.params.match_id);
    let ResAxios, Query;
    ResAxios = await axios.get('https://api.opendota.com/api/matches/'+match_id);
    let ObjPlayers = ResAxios.data.players;

    try {
        for (let i = 0; i < ObjPlayers.length; i++) {
            Query = `INSERT INTO dota_matches_heroes_info SET
                        MatchID = ?,
                        HeroID = ?,
                        Win = ?,
                        Lose = ?`;
            await sql.query(Query, [ObjPlayers[i].match_id, ObjPlayers[i].hero_id, ObjPlayers[i].win, ObjPlayers[i].lose]);
        }

        return res.status(200).json({success: true, message: 'Call matchesdet-single Success'});
    } catch(err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});    
    }
    
});


router.get('/matchesdet-league/:league_id', async(req,res) => {
    const league_id = parseInt(req.params.league_id);
    let Query, DataMatch, ResAxios;
    
    //ambil list match_id
    Query = `SELECT
                a.MatchID
            FROM
                dota_matches a
            WHERE 1=1
                AND a.LeagueID = ?
                AND a.HeroDetail = 'No'
            ORDER BY a.MatchID`;
    DataMatch = await sql.query(Query, [league_id]);
    //console.log(`DataMatch:`,DataMatch);

    for (let i = 0; i < DataMatch.length; i++) {
        (async function(index) {
            setTimeout(async function() {
                console.log(`DataMatch[i].MatchID:`,DataMatch[i].MatchID);

                ResAxios = await axios.get('https://api.opendota.com/api/matches/'+DataMatch[i].MatchID);
                let ObjPlayers = ResAxios.data.players;

                for (let j = 0; j < ObjPlayers.length; j++) {
                    Query = `INSERT INTO dota_matches_heroes_info SET
                                MatchID = ?,
                                HeroID = ?,
                                Win = ?,
                                Lose = ?`;
                    await sql.query(Query, [ObjPlayers[j].match_id, ObjPlayers[j].hero_id, ObjPlayers[j].win, ObjPlayers[j].lose]);

                    Query = `UPDATE dota_matches SET HeroDetail='Yes' WHERE MatchID=? AND LeagueID=? LIMIT 1`;
                    await sql.query(Query, [ObjPlayers[j].match_id, league_id]);

                    console.log(`Process for iteration:`,i+1);
                }

            }, (i+1) * 3000);
        })(i);
    }

    return res.status(200).json({success: true, message: 'Call matchesdet-league Success'});
});

router.get('/matchesdet-leagueherowin/:league_id', async(req,res) => {
    const league_id = parseInt(req.params.league_id);
    let Query, DataMatch, DataHeroWin, DataHeroLose;

    //ambil list match_id
    Query = `SELECT
                a.MatchID
            FROM
                dota_matches a
            WHERE 1=1
                AND a.LeagueID = ?
                AND a.HeroWinLoseDetail = 'No'
            ORDER BY a.MatchID`;
    DataMatch = await sql.query(Query, [league_id]);

    for (let i = 0; i < DataMatch.length; i++) {
        //Hapus dulu data nya
        Query = `DELETE FROM dota_matches_heroes_winstats WHERE MatchID = ?`;
        await sql.query(Query, [DataMatch[i].MatchID]);

        Query = `SELECT
                    a.HeroID
                FROM
                    dota_matches_heroes_info a
                WHERE 1=1
                    AND a.MatchID = ?
                    AND a.Win = '1'`;
        DataHeroWin = await sql.query(Query, [DataMatch[i].MatchID]);

        Query = `SELECT
                    a.HeroID
                FROM
                    dota_matches_heroes_info a
                WHERE 1=1
                    AND a.MatchID = ?
                    AND a.Lose = '1'`;
        DataHeroLose = await sql.query(Query, [DataMatch[i].MatchID]);

        for (let j = 0; j < DataHeroWin.length; j++) {
            for (let k = 0; k < DataHeroLose.length; k++) {
                Query = `INSERT INTO dota_matches_heroes_winstats SET
                            MatchID = ?,
                            HeroIDWin = ?,
                            HeroIDLose = ?`;
                await sql.query(Query, [ DataMatch[i].MatchID, DataHeroWin[j].HeroID, DataHeroLose[k].HeroID ]);
            }
        }

        Query = `UPDATE dota_matches SET HeroWinLoseDetail='Yes' WHERE MatchID=? AND LeagueID=? LIMIT 1`;
        await sql.query(Query, [DataMatch[i].MatchID, league_id]);
    }

    return res.status(200).json({success: true, message: 'Call matchesdet-leagueherowin Success'});
});

export default router;