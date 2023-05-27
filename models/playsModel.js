const pool = require("../config/database");
const MatchDecks = require("./decksModel");
const Settings = require("./gameSettings");

class Play {

    // At this moment I do not need to store information so we have no constructor

    // we consider all verifications were made
    static async startGame(game) {
        try {

            // Randomly determines who starts    
            let myTurn = (Math.random() < 0.5);
            let p1Id = myTurn ? game.player.id : game.opponents[0].id;
            let p2Id = myTurn ? game.opponents[0].id : game.player.id;
            // Player that start changes to the state Playing 
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`, [2, p1Id]);
            // Changing the game state to start
            await pool.query(`Update game set gm_state_id=? where gm_id = ?`, [2, game.id]);

        
            let objSql = `Insert into player (pl_user_game_id,pl_state_id,pl_hp,pl_ap,pl_class_id) values (?,?,?,?,?)`

            await pool.query(objSql, [p1Id, 3, Settings.maxShipHP, Settings.apPerTurn, 0]);
            await pool.query(objSql, [p2Id, 3, Settings.maxShipHP, 0, 0]);

            let [chosingState] = await pool.query(`select pl_state_id from player where pl_user_game_id = ?`, [game.player.id]);
            let num = chosingState[0].pl_state_id;

            if (num == 3) {
                await MatchDecks.genPlayerClassDeck(p1Id);
                await MatchDecks.genPlayerClassDeck(p2Id);
            } else {
                await MatchDecks.genPlayerDeck(p1Id, Settings.inCards, Settings.maxCards);
                await MatchDecks.genPlayerDeck(p2Id, Settings.inCards, Settings.maxCards);
            }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async endTurn(game) {

        try {
            // removes the cards of the player that ended and get new cards to the one that will start
            let [chosingState] = await pool.query(`select pl_state_id from player where pl_user_game_id = ?`, [game.player.id]);

            let num = chosingState[0].pl_state_id;
            await MatchDecks.resetPlayerDeck(game.player.id);
        
            await MatchDecks.genPlayerDeck(game.opponents[0].id, Settings.nCards, Settings.maxCards);
        

            if (num != 3) { 
            await pool.query(`update player set pl_state_id = 1, pl_ap =
            case
            when pl_ap < 0 then 0
            when pl_ap >= 20 then 20
            when pl_ap >= 0 and pl_ap < 19 then pl_ap + ?
            when pl_ap = 19 then 20
            end
            where pl_user_game_id = ?`, [Settings.apPerTurn,game.opponents[0].id]);
            } else {
                await pool.query(`update player set pl_state_id = 1, pl_ap = pl_ap + ? where pl_user_game_id = ?`, [0,game.player.id])
            }

    
            // Change player state to waiting (1)
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`,
                [1, game.player.id]);
            // Change opponent state to playing (2)
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`,
                [2, game.opponents[0].id]);
            // Increase the number of turns.
            await pool.query(`Update game set gm_turn=gm_turn+1 where gm_id = ?`,
                [game.id]);
         
            return { status: 200, result: { msg: "Your turn ended." } };

        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}

module.exports = Play;