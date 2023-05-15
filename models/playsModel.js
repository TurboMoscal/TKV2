//CHANGED


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

            // ---- Specific to this game
            // Player that starts gets new cards


            // generating ships for both players first player gets 2 action points 
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

    // This considers that only one player plays at each moment, 
    // so ending my turn starts the other players turn
    // We consider the following verifications were already made:
    // - The user is authenticated
    // - The user has a game running
    // NOTE: This might be the place to check for victory, but it depends on the game

    static async endTurn(game) {

        try {

            // Change player state to waiting (1)
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`,
                [1, game.player.id]);
            // Change opponent state to playing (2)
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`,
                [2, game.opponents[0].id]);
            // Increase the number of turns.
            await pool.query(`Update game set gm_turn=gm_turn+1 where gm_id = ?`,
                [game.id]);
            // removes the cards of the player that ended and get new cards to the one that will start
            let [chosingState] = await pool.query(`select pl_state_id from player where pl_user_game_id = ?`, [game.player.id]);

            let num = chosingState[0].pl_state_id;
            await MatchDecks.resetPlayerDeck(game.player.id);
          // if (num != 3) {
            await MatchDecks.genPlayerDeck(game.opponents[0].id, Settings.nCards, Settings.maxCards);
          // } else {
               //await MatchDecks.genPlayerClassDeck(game.opponents[0].id);
         //  }
            // Give actions points to the player that started and reset the ship state to Ready

            if (num != 3) { 
            await pool.query(`UPDATE player SET pl_state_id = 1, pl_ap =
            CASE
            WHEN pl_ap < 0 THEN 0
            WHEN pl_ap >= 20 THEN 20
            WHEN pl_ap >= 0 AND pl_ap < 19 THEN pl_ap + ?
            WHEN pl_ap = 19 THEN 20
            END
            WHERE pl_user_game_id = ?`, [Settings.apPerTurn,game.opponents[0].id]);
            } else {
                await pool.query(`update player set pl_state_id = 1, pl_ap = pl_ap + ? where pl_user_game_id = ?`, [0,game.player.id])
            }

            // Update ship set sh_ap=sh_ap+?, sh_state_id=1 where sh_user_game_id = ?

            if (game.opponents[0].obj && game.opponents[0].obj.hp <= 0) {
                console.log("O jogo terminou!")

            }
            return { status: 200, result: { msg: "Your turn ended." } };

        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}

module.exports = Play;