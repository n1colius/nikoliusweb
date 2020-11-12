import { Router } from 'express';
const router = Router();
const sql = require('../dbconfig');
const fs = require('fs');

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

export default router;