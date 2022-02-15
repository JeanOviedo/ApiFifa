const express = require("express");
const { Players } = require("../db");
const router = express.Router();
const axios = require("axios");
const jwt = require('express-jwt')
const secreto = jwt({ secret: process.env.SECRET, algorithms: ['HS256'] });

//router.use(express.json());


router.get("/", secreto, async (req, res, next) => {
  const { page, search, order } = req.query;
 
 let PlayerCant = await Players.count();
 let sinduplicados;
      // // if (PlayerCant === 0) {
  try {
    if (!search  ) {
      // // let PlayerCant = await Players.count();
      // // if (PlayerCant === 0) {
        
        let players = await axios.get(
          `https://www.easports.com/fifa/ultimate-team/api/fut/item?page=${page}`
        );
        let playersApi = players.data.items;
        let Page = players.data.page;
        let totalPage = players.data.totalPages;
        let totalResults = players.data.totalResults;
        // const ide = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);

        // si no es null o undefined o "" entonces guardo los players en la tabla players
        if (playersApi) {
          playersApi = playersApi.map((t) => {
            return {
              page: Page,
              totalPages: totalPage,
              totalResults: totalResults,
              // page: page,
              items: {
                name:
                  t.firstName.toLowerCase() + " " + t.lastName.toLowerCase(),
                position: t.position,
                nation: t.nation.abbrName,
                nationid:
                  "https://fifastatic.fifaindex.com/FIFA21/images/flags/2/" +
                  t.nation.id +
                  ".png",
                team: t.club.abbrName,

                img:
                  "https://fifastatic.fifaindex.com/FIFA22/teams/dark/" +
                  t.club.id +
                  ".png",
                imgjugador:
                  "https://fifastatic.fifaindex.com/FIFA22/players/" +
                  t.baseId +
                  ".png",
              },
            };
          });
        }
       
        let playersEnApi = playersApi.map((e) => {
          return {
            page: e.page,
            totalPages: e.totalPages,
            totalResults: e.totalResults,
            items: {
              name: e.items.name,
              position: e.items.position,
              nation: e.items.nation,
              nationid: e.items.nationid,
              team: e.items.team,
              img: e.items.img,
              imgjugador: e.items.imgjugador,
            },
          };
        });

        console.log("Cargado de api" , playersEnApi );
        sinduplicados = [...new Map( playersEnApi.map((itemlea) => [itemlea.items.name, itemlea]) ).values(), ];
        let arra = sinduplicados.map((e) => e.items.name).splice(0, 1);
        const PlayersBDSiExiste = await Players.findOne({
          where: {
            name: arra,
          },
        });

        if (PlayersBDSiExiste === null) {
          // await Players.bulkCreate(sinduplicados);
          sinduplicados.map((e) => {
            Players.create({
              page: e.page,
              totalPages: e.totalPages,
              totalResults: e.totalResults,
              name: e.items.name,
              position: e.items.position,
              nation: e.items.nation,
              team: e.items.team,
              img: e.items.img,
              imgjugador: e.items.imgjugador,
              nationid: e.items.nationid,
            });
            console.log("se guardo en BD YA QUE NO EXISTE");
          });


          if (!req.user.name) return res.sendStatus(401).res.send(" NO AUTORIZADO");
          if (req.user.name) return  res.send(sinduplicados);
           // res.send(sinduplicados);
         
         
         
        }
      //} 
      
      else {
        // Si la cantidad es distinta de 0 entonces se obtienen los players de la tabla players

       
        let playersBD = await Players.findAll();
        let playersEnBaseDatos = playersBD.map((e) => {
          return {
            // id: e.id,
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
              nationid: e.nationid,
            },
          };
        });
      
        //res.send(playersEnBaseDatos); Muestra GUARDADOS EN BD
        //res.send(sinduplicados); //Muestra GUARDADOS EN API
        if (!req.user.name) return res.sendStatus(401).res.send(" NO AUTORIZADO");
          if (req.user.name) return  res.send(sinduplicados);
          console.log("NOO se guardo en BD YA EXISTE",sinduplicados );
      }
    }
  } catch (error) {
    console.log(error);
    //next(error);
  }
  // });

  // router.get("/", async (req, res, next) => {

  try {
    if (search) {
        
      const Sequelize = require("sequelize");
      const Op = Sequelize.Op;

      // let searche = search.toLowerCase()
      const PlayersBD = await Players.findAll({
        where: {
          name: {
            [Op.like]: "%" + search + "%",
           
          },


        },
      });

      if (PlayersBD != 0) {
        let respuesta = PlayersBD.map((e) => {
          return {
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
              nationid: e.nationid,
            },
          };
        });

   



        if (order==="desc") { //desc
            respuesta.sort(function (a, b) {
                if (a.items.name > b.items.name ) {
                  return -1;
                }
                if (b.items.name  > a.items.name ) {
                  return 1;
                }
                return 0;
              })  
           }
          else if (order=="asc") {
            respuesta.sort(function (a, b) {
                if (a.items.name > b.items.name ) {
                  return 1;
                }
                if (b.items.name  > a.items.name ) {
                  return -1;
                }
                return 0;
              })  
           }
           else
           {
            respuesta.sort(function (a, b) { //asc
                if (a.items.name > b.items.name ) {
                  return -1;
                }
                if (b.items.name  > a.items.name ) {
                  return 1;
                }
                return 0;
              })  
           }




        
           if (!req.user.name) return res.sendStatus(401).res.send(" NO AUTORIZADO");
           if (req.user.name) return     res.status(200).send(respuesta);
        res.status(200).send(respuesta);
      } else {
        res.status(400).send("No encontrado");
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
