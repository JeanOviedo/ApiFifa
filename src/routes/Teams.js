const express = require("express");
const {Teams, Players} = require("../db");
const router = express.Router();
const axios = require("axios");
router.use(express.json());
const jwt = require('express-jwt')
const secreto = jwt({ secret: process.env.SECRET, algorithms: ['HS256'] });


router.get("/get",
secreto, 

async (req, res, next) => {
    try {
        let TeamCant = await Teams.count();
        // cuenta los teams  en la tabla teams
        // si no hay teamsen la tablateams entonces se obtienen los teams de la API
        if (TeamCant === 0) {
            let teams = await axios.get(`https://www.easports.com/fifa/ultimate-team/api/fut/item`);
            let teamsApi = teams.data.items;
            let teamsApi2 = teams.data.items;
            // poner los teams de la api en un array

            let Page = teams.data.page;
            let teamsTotalPage = teams.data.totalPages;
            let totalResults = teams.data.totalResults;
            let resultado;
            // si no es null o undefined o "" entonces guardo los teams en la tabla teams
            if (teamsApi) {
                teamsApi = teamsApi.map((t) => { // let resultado = teamsApi2.find( ok => ok.club.name === t.club.name  );
                    resultado = teamsApi2.filter((obj) => t.club.name == obj.club.name).map((obj) => ({
                        page: Page,
                        totalPages: teamsTotalPage,
                        totalResults: totalResults,
                        name: obj.firstName.toLowerCase() + " " + obj.lastName.toLowerCase(),
                        position: t.position,
                        nation: t.nation.abbrName,
                        nationid: "https://fifastatic.fifaindex.com/FIFA21/images/flags/2/" + t.nation.id + ".png",
                        team: t.club.abbrName,
                        img: "https://fifastatic.fifaindex.com/FIFA22/teams/dark/" + t.club.id + ".png",
                        imgjugador: "https://fifastatic.fifaindex.com/FIFA22/players/" + t.baseId + ".png"
                    }));

                    console.log(resultado, "RESULTADO");

                    resultado = [
                        ...new Map(resultado.map((itemlea) => [itemlea.name, itemlea])).values(),
                    ];
                    return {id: t.id, name: t.club.name, Players: resultado};
                });
            }

            let teamsEnApi = teamsApi.map((e) => {
                return {id: e.id, name: e.name, Players: e.Players};
            });

            let sinduplicados = [
                ...new Map(teamsEnApi.map((item) => [item.name, item])).values(),
            ];

            await Teams.bulkCreate(sinduplicados);
            console.log("Cargado de api SIN DUPLICADOS", JSON.stringify(sinduplicados));
            let arra = sinduplicados.map((e) => e.Players.name).splice(0, 1);
            const PlayersBDSiExiste = await Players.findOne({
                where: {
                    name: arra
                }
            });

            if (PlayersBDSiExiste === null) {
                let sinduplicadosNew = [
                    ...new Map(resultado.map((item) => [item.name, item])).values(),
                ];
                // await Players.bulkCreate(sinduplicados);
                sinduplicadosNew.map((e) => {
                    Players.create({
                        page: e.page,
                        totalPages: e.totalPages,
                        totalResults: e.totalResults,
                        name: e.name,
                        position: e.position,
                        nation: e.nation,
                        team: e.team,
                        img: e.img,
                        imgjugador: e.imgjugador,
                        nationid: e.nationid
                    });
                });

                if (!req.user.name ) return res.sendStatus(401).res.send(" NO AUTORIZADO");
                if (req.user.name) return  res.send(teamsEnBaseDatos);
   
                
                //res.send(sinduplicados);
               
            }
        } else { // Si la cantidad es distinta de 0 entonces se obtienen los teams de la tabla teams

            let BuscarPlayersPorEquipo = await Players.findAll();
            let PlayersEnBaseDatos = BuscarPlayersPorEquipo.map((e) => {
                return { // id: e.id,
                    page: e.page,
                    totalPages: e.totalPages,
                    totalResults: e.totalResults,
                    items: {
                        name: e.name,
                        position: e.position,
                        nation: e.nation,
                        team: e.team,
                        img: e.img,
                        imgjugador: e.imgjugador,
                        nationid: e.nationid
                    }
                };
            });

            console.log(PlayersEnBaseDatos, " buscar");

            let teamsBD = await Teams.findAll();
            let teamsEnBaseDatos = teamsBD.map((e) => {
                return {id: e.id, name: e.name, Players: PlayersEnBaseDatos};
            });

            console.log("Cargado de BD");
            // res.send(teamsEnBaseDatos);
            if (!req.user.name) return res.sendStatus(401).res.send(" NO AUTORIZADO");
            if (req.user.name) return  res.send(teamsEnBaseDatos);
            //res.send(teamsEnBaseDatos);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});






router.post("/", 
secreto, async (req, res, next) => {
    try {
        let TeamCant = await Teams.count();
        // cuenta los teams  en la tabla teams
        // si no hay teamsen la tablateams entonces se obtienen los teams de la API
        if (TeamCant === 0) {
            let teams = await axios.get(`https://www.easports.com/fifa/ultimate-team/api/fut/item`);
            let teamsApi = teams.data.items;
            let teamsApi2 = teams.data.items;
            // poner los teams de la api en un array

            let Page = teams.data.page;
            let teamsTotalPage = teams.data.totalPages;
            let totalResults = teams.data.totalResults;
            let resultado;
            // si no es null o undefined o "" entonces guardo los teams en la tabla teams
            if (teamsApi) {
                teamsApi = teamsApi.map((t) => { // let resultado = teamsApi2.find( ok => ok.club.name === t.club.name  );
                    resultado = teamsApi2.filter((obj) => t.club.name == obj.club.name).map((obj) => ({
                        page: Page,
                        totalPages: teamsTotalPage,
                        totalResults: totalResults,
                        name: obj.firstName.toLowerCase() + " " + obj.lastName.toLowerCase(),
                        position: t.position,
                        nation: t.nation.abbrName,
                        nationid: "https://fifastatic.fifaindex.com/FIFA21/images/flags/2/" + t.nation.id + ".png",
                        team: t.club.abbrName,
                        img: "https://fifastatic.fifaindex.com/FIFA22/teams/dark/" + t.club.id + ".png",
                        imgjugador: "https://fifastatic.fifaindex.com/FIFA22/players/" + t.baseId + ".png"
                    }));

                    console.log(resultado, "RESULTADO");

                    resultado = [
                        ...new Map(resultado.map((itemlea) => [itemlea.name, itemlea])).values(),
                    ];
                    return {id: t.id, name: t.club.name, Players: resultado};
                });
            }

            let teamsEnApi = teamsApi.map((e) => {
                return {id: e.id, name: e.name, Players: e.Players};
            });

            let sinduplicados = [
                ...new Map(teamsEnApi.map((item) => [item.name, item])).values(),
            ];

            await Teams.bulkCreate(sinduplicados);
            console.log("Cargado de api SIN DUPLICADOS", JSON.stringify(sinduplicados));
            let arra = sinduplicados.map((e) => e.Players.name).splice(0, 1);
            const PlayersBDSiExiste = await Players.findOne({
                where: {
                    name: arra
                }
            });

            if (PlayersBDSiExiste === null) {
                let sinduplicadosNew = [
                    ...new Map(resultado.map((item) => [item.name, item])).values(),
                ];
                // await Players.bulkCreate(sinduplicados);
                sinduplicadosNew.map((e) => {
                    Players.create({
                        page: e.page,
                        totalPages: e.totalPages,
                        totalResults: e.totalResults,
                        name: e.name,
                        position: e.position,
                        nation: e.nation,
                        team: e.team,
                        img: e.img,
                        imgjugador: e.imgjugador,
                        nationid: e.nationid
                    });
                });

                res.send(sinduplicados);
                console.log("se guardo en BD YA QUE NO EXISTE");
            }
        } else { // Si la cantidad es distinta de 0 entonces se obtienen los teams de la tabla teams

            let BuscarPlayersPorEquipo = await Players.findAll();
            let PlayersEnBaseDatos = BuscarPlayersPorEquipo.map((e) => {
                return { // id: e.id,
                    page: e.page,
                    totalPages: e.totalPages,
                    totalResults: e.totalResults,
                    items: {
                        name: e.name,
                        position: e.position,
                        nation: e.nation,
                        team: e.team,
                        img: e.img,
                        imgjugador: e.imgjugador,
                        nationid: e.nationid
                    }
                };
            });

            console.log(PlayersEnBaseDatos, " buscar");

            let teamsBD = await Teams.findAll();
            let teamsEnBaseDatos = teamsBD.map((e) => {
                return {id: e.id, name: e.name, Players: PlayersEnBaseDatos};
            });

            console.log("Cargado de BD");
            // res.send(teamsEnBaseDatos);
            if (!req.user.name) return res.sendStatus(401).res.send(" NO AUTORIZADO");
            if (req.user.name) return  res.send(teamsEnBaseDatos);
             //res.send(teamsEnBaseDatos);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});









module.exports = router;
