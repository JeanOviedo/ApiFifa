const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const PlayersRoute = require('./Players.js');
const TeamsRoute = require('./Teams.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/players', PlayersRoute );
router.use('/teams', TeamsRoute);

module.exports = router;
