const pool = require("../config/database");
const Settings = require("./gameSettings");

function fromDBHospCardToCard(dbCard) {
    return new Card(dbCard.hosp_crd_id, dbCard.hosp_ugc_id,
        dbCard.hosp_crd_name, dbCard.hosp_crd_effect, dbCard.hosp_crd_note,
        dbCard.hosp_ugc_active);
}

function fromDBHusCardToCard(dbCard) {
    return new Card(dbCard.hus_crd_id, dbCard.hus_ugc_id,
        dbCard.hus_crd_name, dbCard.hus_crd_effect, dbCard.hus_crd_note, dbCard.hus_ugc_active);
}

function fromDBClassCardToCard(dbCard) {
    return new Card(dbCard.cla_crd_id, dbCard.ugcla_c_id,
        dbCard.cla_crd_name, dbCard.cla_crd_effect, dbCard.cla_crd_note, dbCard.ugcla_c_active);
}



class Card {
    constructor(cardId, deckId, name, effect, note, active) {
        this.cardId = cardId;
        this.deckId = deckId;
        this.name = name;
        this.effect = effect;
        this.note = note;
        this.active = active;
    }

    // We consider all verifications of max cards are done
    static async genCard(playerId) {
        try {
            let [chosingState] = await pool.query(`select pl_state_id from player where pl_user_game_id = ?`, [playerId]);

            let num = chosingState[0].pl_state_id;

            let [Class] = await pool.query(`select pl_class_id from player where pl_user_game_id = ?`, [playerId]);

            let chosenClass = Class[0].pl_class_id;

            let [numAp] = await pool.query('select * from player where pl_user_game_id = ? ', [playerId]);
            let ap = numAp[0].pl_ap

            if (num != 3 && chosenClass == 1 && ap >= 10) {

                let [cards] = await pool.query(`select * from hosp_card`);
                let rndCard = fromDBHospCardToCard(cards[Math.floor(Math.random() * cards.length)]);
                // insert the card
                let [result] = await pool.query(`Insert into user_game_hosp_card (hosp_ugc_user_game_id,hosp_ugc_crd_id,hosp_ugc_active)
            values (?,?,?)`, [playerId, rndCard.cardId, true]);
                return { status: 200, result: rndCard };
            }


            if (num != 3 && chosenClass == 1 && ap < 10) {

                let [cards] = await pool.query(`select * from hosp_card where hosp_crd_id != 9 and hosp_crd_id != 10`);
                let rndCard = fromDBHospCardToCard(cards[Math.floor(Math.random() * cards.length)]);

                // insert the card
                let [result] = await pool.query(`Insert into user_game_hosp_card (hosp_ugc_user_game_id,hosp_ugc_crd_id,hosp_ugc_active)
                       values (?,?,?)`, [playerId, rndCard.cardId, true]);

                return { status: 200, result: rndCard };

            }


            if (num != 3 && chosenClass == 2 && ap >= 10) {

                let [cards] = await pool.query(`select * from hus_card`);
                let rndCard = fromDBHusCardToCard(cards[Math.floor(Math.random() * cards.length)]);
                // insert the card
                let [result] = await pool.query(`Insert into user_game_hus_card 
                    (hus_ugc_user_game_id,hus_ugc_crd_id,hus_ugc_active)
                    values (?,?,?)`, [playerId, rndCard.cardId, true]);
                return { status: 200, result: rndCard };
            }


            if (num != 3 && chosenClass == 2 && ap < 10) {

                let [cards] = await pool.query(`select * from hus_card where hus_crd_id != 8 and hus_crd_id != 9`);
                let rndCard = fromDBHusCardToCard(cards[Math.floor(Math.random() * cards.length)]);

                // insert the card
                let [result] = await pool.query(`Insert into user_game_hus_card (hus_ugc_user_game_id,hus_ugc_crd_id,hus_ugc_active)
                               values (?,?,?)`, [playerId, rndCard.cardId, true]);

                return { status: 200, result: rndCard };

            }



            if (num == 3) {
                let [cards1] = await pool.query(`select * from class_card`);
                let rndCard1 = fromDBClassCardToCard(cards1[0]);
                // insert the card
                let [result1] = await pool.query(`Insert into user_game_class_card 
                (ugcla_c_user_game_id,ugcla_c_crd_id,ugcla_c_active) values (?,?,?)`, [playerId, rndCard1.cardId, true]);

                let [cards2] = await pool.query(`select * from class_card`);
                let rndCard2 = fromDBClassCardToCard(cards2[1]);
                // insert the card
                let [result2] = await pool.query(`Insert into user_game_class_card 
                (ugcla_c_user_game_id,ugcla_c_crd_id,ugcla_c_active) values (?,?,?)`, [playerId, rndCard2.cardId, true]);
                return { status: 200, result: rndCard1, rndCard2 };
            }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}


class MatchDecks {
    constructor(mycards, oppcards) {
        this.mycards = mycards;
        this.oppcards = oppcards;
    }

    // No verifications are made since this is consider to be an auxiliary method
    // We consider it will only be called at the right time
    static async genPlayerDeck(playerId, nCards, maxCards) {
        try {

            let [Class] = await pool.query(`select pl_class_id from player where pl_user_game_id = ?`, [playerId]);

            let chosenClass = Class[0].pl_class_id;

            if (chosenClass == 1) {
                let cards = [];

                let [numCards] = await pool.query('select count(*)  as a from user_game_hosp_card where hosp_ugc_user_game_id = ?  and hosp_ugc_active = ?', [playerId, true]);//////////////////
                //console.log(numCards[0].a)
                let cardsOnHands = numCards[0].a;
                let n = Math.min(nCards, maxCards - cardsOnHands);
                if (cardsOnHands != 0) {
                    for (let i = 0; i < n; i++) {
                        let result = await Card.genCard(playerId);
                        cards.push(result.result);
                    }
                    return { status: 200, result: cards };
                }
                if (cardsOnHands == 0) {
                    for (let i = 0; i < 3; i++) {
                        let result = await Card.genCard(playerId);
                        cards.push(result.result);
                    }
                    return { status: 200, result: cards };
                }
            }

            if (chosenClass == 2) {
                let cards = [];

                let [numCards] = await pool.query('select count(*)  as a from user_game_hus_card where hus_ugc_user_game_id = ?  and hus_ugc_active = ?', [playerId, true]);//////////////////
                //console.log(numCards[0].a)
                let cardsOnHands = numCards[0].a;
                let n = Math.min(nCards, maxCards - cardsOnHands);
                if (cardsOnHands != 0) {
                    for (let i = 0; i < n; i++) {
                        let result = await Card.genCard(playerId);
                        cards.push(result.result);
                    }
                    return { status: 200, result: cards };
                }
                if (cardsOnHands == 0) {
                    for (let i = 0; i < 3; i++) {
                        let result = await Card.genCard(playerId);
                        cards.push(result.result);
                    }
                    return { status: 200, result: cards };
                }
            }

        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }




    static async genPlayerClassDeck(playerId) {
        try {

            let cards = [];
            for (let i = 0; i < 1; i++) {
                let result = await Card.genCard(playerId);
                cards.push(result.result);
            }
            return { status: 200, result: cards };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // No verifications are made since this is consider to be an auxiliary method
    // We consider it will only be called at the right time
    static async resetPlayerDeck(playerId) {
        try {
            let [result] = await pool.query(`delete from user_game_hosp_card where not hosp_ugc_active and hosp_ugc_user_game_id = ? `, [playerId]);

            [result] = await pool.query(`delete from user_game_hus_card where not hus_ugc_active and hus_ugc_user_game_id = ?`, [playerId]);

            [result] = await pool.query(`delete from user_game_class_card where not ugcla_c_active and ugcla_c_user_game_id = ?`, [playerId]);
            return { status: 200, result: { msg: "All cards removed" } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getMatchDeck(game) {
        try {

            let [chosingState] = await pool.query(`select pl_state_id from player where pl_user_game_id = ?`, [game.player.id]);

            let num = chosingState[0].pl_state_id;

            let [Class] = await pool.query(`select pl_class_id from player where pl_user_game_id = ?`, [game.player.id]);

            let chosenClass = Class[0].pl_class_id;


            //let [oppClass] = await pool.query(`select pl_class_id from player where pl_user_game_id = ?`, [game.opponents[0].id]);

            // let chosenOppClass = oppClass[0].pl_class_id;

            if (num != 3) {
                if (chosenClass == 1) {
                    let [hospdbcards] = await pool.query(`Select * from hosp_card
                inner join user_game_hosp_card on hosp_ugc_crd_id = hosp_crd_id
                where hosp_ugc_user_game_id = ? or hosp_ugc_user_game_id = ?`,
                        [game.player.id, game.opponents[0].id]);

                    let [husdbcards] = await pool.query(`Select * from hus_card
                inner join user_game_hus_card on hus_ugc_crd_id = hus_crd_id
                where hus_ugc_user_game_id = ? or hus_ugc_user_game_id = ?`,
                        [game.player.id, game.opponents[0].id]);
                    let playerCards = [];
                    let oppCards = [];
                    for (let dbcard of hospdbcards) {
                        let card = fromDBHospCardToCard(dbcard);
                        if (dbcard.hosp_ugc_user_game_id == game.player.id) {
                            playerCards.push(card);
                            //let oppCard = new Card();
                            //oppCard.active = true;
                            //oppCards.push(oppCard);
                        } else {
                            let oppCard = new Card();
                            oppCard.active = true;
                            oppCards.push(oppCard);
                        }
                    }


                    for (let dbcard of husdbcards) {
                        let card = fromDBHusCardToCard(dbcard);
                        if (dbcard.hus_ugc_user_game_id == game.player.id) {
                            playerCards.push(card);
                            //let oppCard = new Card();
                            //oppCard.active = true;
                            //oppCards.push(oppCard);
                        } else {
                            let oppCard = new Card();
                            oppCard.active = true;
                            oppCards.push(oppCard);
                        }
                    }
                    return { status: 200, result: new MatchDecks(playerCards, oppCards) };
                }
                if (chosenClass == 2) {
                    let [husdbcards] = await pool.query(`Select * from hus_card
                inner join user_game_hus_card on hus_ugc_crd_id = hus_crd_id
                where hus_ugc_user_game_id = ? or hus_ugc_user_game_id = ?`,
                        [game.player.id, game.opponents[0].id]);

                    let [hospdbcards] = await pool.query(`Select * from hosp_card
                inner join user_game_hosp_card on hosp_ugc_crd_id = hosp_crd_id
                where hosp_ugc_user_game_id = ? or hosp_ugc_user_game_id = ?`,
                        [game.player.id, game.opponents[0].id]);
                    let playerCards = [];
                    let oppCards = [];
                    for (let dbcard of husdbcards) {
                        let card = fromDBHusCardToCard(dbcard);
                        if (dbcard.hus_ugc_user_game_id == game.player.id) {
                            playerCards.push(card);
                            // let oppCard = new Card();
                            //oppCard.active = true;
                            //oppCards.push(oppCard);

                        }
                        else {
                            let oppCard = new Card();
                            oppCard.active = true;
                            oppCards.push(oppCard);
                        }
                    }

                    for (let dbcard of hospdbcards) {
                        let card = fromDBHospCardToCard(dbcard);
                        if (dbcard.hosp_ugc_user_game_id == game.player.id) {
                            playerCards.push(card);
                            //let oppCard = new Card();
                            //oppCard.active = true;
                            //oppCards.push(oppCard);
                        } else {
                            let oppCard = new Card();
                            oppCard.active = true;
                            oppCards.push(oppCard);
                        }
                    }

                    return { status: 200, result: new MatchDecks(playerCards, oppCards) };
                }

            }

            if (num == 3) {
                let [dbcards] = await pool.query(`Select * from class_card 
                inner join user_game_class_card on ugcla_c_crd_id = cla_crd_id
                where ugcla_c_user_game_id = ? or ugcla_c_user_game_id = ?`,
                    [game.player.id, game.opponents[0].id]);
                let playerCards = [];
                let oppCards = [];
                for (let dbcard of dbcards) {
                    let card = fromDBClassCardToCard(dbcard);
                    if (dbcard.ugcla_c_user_game_id == game.player.id) {
                        playerCards.push(card);
                    } /*else {
                        let card = new Card();
                        card.active = true;
                        oppCards.push(card);
                    }*/
                }

                return { status: 200, result: new MatchDecks(playerCards, oppCards) };
            }

        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }


    static async playDeckCard(game, deckId) {

        try {
            let [chosingState] = await pool.query(`select pl_state_id from player where pl_user_game_id = ?`, [game.player.id]);

            let num = chosingState[0].pl_state_id;

            let [Class] = await pool.query(`select pl_class_id from player where pl_user_game_id = ?`, [game.player.id]);

            let chosenClass = Class[0].pl_class_id;

            if (num != 3 && chosenClass == 1) {
                // get the card and check if the card is from the player and it is active
                let [dbDeckCards] = await pool.query(`Select * from hosp_card 
                inner join user_game_hosp_card on hosp_ugc_crd_id = hosp_crd_id
                where hosp_ugc_user_game_id = ? and hosp_ugc_id = ? and hosp_ugc_active=1`,
                    [game.player.id, deckId]);
                if (dbDeckCards.length == 0) {
                    return { status: 404, result: { msg: "Card not found for this player or not active" } };
                }
                let card = fromDBHospCardToCard(dbDeckCards[0]);
                let playerObj = game.player.obj;
                let oppObj = game.opponents[0].obj;



                //specific rule verification
                // No actions when ship is on defensive maneuvers
                if (playerObj.state.name == "Defensive") {
                    return { status: 400, result: { msg: "Player cannot do any other actions while on defensive state" } };
                }

                if (playerObj.state.name != "Ready") {
                    return { status: 400, result: { msg: "That card cannot be played when another card was already played" } };
                }
                // verifications done, set card to inactive
                await pool.query("update user_game_hosp_card set hosp_ugc_active=0 where hosp_ugc_id = ?", [deckId]);

                // Set player state to Acted (since we already made all the state checks)
                playerObj.state.id = 2;
                // This line should not be necessary since we only use the id to update the DB

                switch (card.cardId) {
                    case 1: attackSwordSlice(oppObj, playerObj); break;
                    case 2: attackMaceSwing(oppObj, playerObj); break;
                    case 3: attackRapierDash(oppObj, playerObj); break;
                    case 4: attackCraguemartSlash(oppObj, playerObj); break;
                    case 5: attackStilettoJab(oppObj, playerObj); break;
                    case 6: TrueHospitaller(oppObj, playerObj); break;
                    case 7: healFieldDoctor(playerObj, oppObj); break;
                    case 8: healMorphine(playerObj, oppObj); break;
                    case 9: mirror(playerObj); break;
                    case 10: defenseHospitaller(playerObj, oppObj); break;
                }

                let objSql = `update player set pl_state_id = ?, pl_hp = ?, pl_ap = ?
                           where pl_id = ?`;
                // Updating player ship and opponent ship (same query, different values)
                await pool.query(objSql, [playerObj.state.id, playerObj.hp,
                playerObj.ap, playerObj.id]);
                await pool.query(objSql, [oppObj.state.id, oppObj.hp,
                oppObj.ap, oppObj.id]);

                return { status: 200};
            }



            if (num != 3 && chosenClass == 2) {
                // get the card and check if the card is from the player and it is active
                let [dbDeckCards] = await pool.query(`Select * from hus_card 
            inner join user_game_hus_card on hus_ugc_crd_id = hus_crd_id
            where hus_ugc_user_game_id = ? and hus_ugc_id = ? and hus_ugc_active=1`,
                    [game.player.id, deckId]);
                if (dbDeckCards.length == 0) {
                    return { status: 404, result: { msg: "Card not found for this player or not active" } };
                }
                let card = fromDBHusCardToCard(dbDeckCards[0]);
                let playerObj = game.player.obj;
                let oppObj = game.opponents[0].obj;



                //specific rule verification
                // No actions when ship is on defensive maneuvers
                if (playerObj.state.name == "Defensive") {
                    return { status: 400, result: { msg: "Player cannot do any other actions while on defensive state" } };
                }

                if (playerObj.state.name != "Ready") {
                    return { status: 400, result: { msg: "That card cannot be played when another card was already played" } };
                }
                // verifications done, set card to inactive
                await pool.query("update user_game_hus_card set hus_ugc_active=0 where hus_ugc_id = ?", [deckId]);

                // Set player state to Acted (since we already made all the state checks)
                playerObj.state.id = 2;

                switch (card.cardId) {
                    case 1: attackSpearStrike(oppObj, playerObj); break;
                    case 2: attackArrowShot(oppObj, playerObj); break;
                    case 3: attackDagger(oppObj, playerObj); break;
                    case 4: attackHalberdThrust(oppObj, playerObj); break;
                    case 5: healMedicinalHerbs(playerObj, oppObj); break;
                    case 6: TrueHussar(oppObj, playerObj); break;
                    case 7: healAlcoholWipes(playerObj, oppObj); break;
                    case 8: mirror(playerObj); break;
                    case 9: defenseHusaria(playerObj); break;
                }

                let objSql = `update player set pl_state_id = ?, pl_hp = ?, pl_ap = ?
                       where pl_id = ?`;
                // Updating player ship and opponent ship (same query, different values)
                await pool.query(objSql, [playerObj.state.id, playerObj.hp,
                playerObj.ap, playerObj.id]);
                await pool.query(objSql, [oppObj.state.id, oppObj.hp,
                oppObj.ap, oppObj.id]);

                return { status: 200};
            }



            if (num == 3) {
                // get the card and check if the card is from the player and it is active
                let [dbDeckCards] = await pool.query(`Select * from class_card
                inner join user_game_class_card on ugcla_c_crd_id = cla_crd_id
                where ugcla_c_user_game_id = ? and ugcla_c_id = ? and ugcla_c_active=1`, [game.player.id, deckId]);

                if (dbDeckCards.length == 0) {
                    return { status: 404, result: { msg: "Card not found for this player or not active" } };
                }

                let card = fromDBClassCardToCard(dbDeckCards[0]);
                let playerObj = game.player.obj;
                let oppObj = game.opponents[0].obj;

                await pool.query("update user_game_class_card set ugcla_c_active=0 where ugcla_c_id = ?", [deckId]);


                async function selectHospitaller(playerObj) {
                    let objSql = `update player set  pl_class_id = 1 ,pl_state_id = ?, pl_hp = ?, pl_ap = ? where pl_state_id = 3 and pl_id = ?`;
                    await pool.query(objSql, [playerObj.state.id, playerObj.hp, playerObj.ap, playerObj.id]);
                }

                async function selectHusaria(playerObj) {
                    let objSql = `update player set pl_class_id = 2 ,pl_state_id = ?, pl_hp = ?, pl_ap = ? where pl_state_id = 3 and pl_id = ?`;
                    await pool.query(objSql, [playerObj.state.id, playerObj.hp, playerObj.ap, playerObj.id]);
                }

                switch (card.cardId) {
                    case 1: selectHospitaller(playerObj); break;
                    case 2: selectHusaria(playerObj); break;
                }

                return { status: 200};

            }

        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

}

// Auxiliary functions to calculate card actions

function attackSwordSlice(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 2;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 2;
    }
}
function attackMaceSwing(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 1;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 1;
    }
}
function attackRapierDash(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 1;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 1;
    }
}

function attackCraguemartSlash(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 2;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 2;
    }
}

function attackStilettoJab(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 1;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 1;
    }
}

function TrueHospitaller(oppObj, playerObj) {
    if (oppObj.state.id != 4) {
        if (oppObj.state.id != 5) {
            oppObj.hp -= 3;
        }
        playerObj.hp += 2;
        if (playerObj.hp > Settings.maxShipHP) playerObj.hp = Settings.maxShipHP;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 3;
        oppObj.hp += 2;
        if (oppObj.hp > Settings.maxShipHP) oppObj.hp = Settings.maxShipHP;
    }
}

function healFieldDoctor(playerObj, oppObj) {
    if (oppObj.state.id != 4) {
        playerObj.hp += 3;

        if (playerObj.hp > Settings.maxShipHP) playerObj.hp = Settings.maxShipHP;
    }


    if (oppObj.state.id == 4) {
        oppObj.hp += 3;
        if (oppObj.hp > Settings.maxShipHP) oppObj.hp = Settings.maxShipHP;
    }
}

function healMorphine(playerObj, oppObj) {
    if (oppObj.state.id != 4) {
        playerObj.hp += 2;
        if (playerObj.hp > Settings.maxShipHP) playerObj.hp = Settings.maxShipHP;
    }
    if (oppObj.state.id == 4) {
        oppObj.hp += 2;
        if (oppObj.hp > Settings.maxShipHP) oppObj.hp = Settings.maxShipHP;
    }
}


function mirror(playerObj) {
    if (playerObj.ap >= 10) {
        playerObj.ap -= 10;
        playerObj.state.id = 4;
        // playerObj.state.name = "Acted";
    } else {
        //alert("Not enough action points");
        return { status: 404, result: { msg: "Not enough action points" } };
    }
}


function defenseHospitaller(playerObj, oppObj) {
    if (playerObj.ap >= 10) {
        playerObj.ap -= 10;
        oppObj.hp -= 2;
        playerObj.state.id = 5;
        // playerObj.state.name = "Acted";
    } else {
        //alert("Not enough action points");
        return { status: 404, result: { msg: "Not enough action points" } };
    }

}











function attackSpearStrike(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 3;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 3;
    }
}
function attackArrowShot(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 2;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 2;
    }
}
function attackDagger(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 2;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 2;
    }
}

function attackHalberdThrust(oppObj, playerObj) {
    if (oppObj.state.id != 5 && oppObj.state.id != 4) {
        oppObj.hp -= 3;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 3;
    }
}

function TrueHussar(oppObj, playerObj) {
    if (oppObj.state.id != 4) {
        if (oppObj.state.id != 5) {
            oppObj.hp -= 2;
        }
        playerObj.hp += 3;
        if (playerObj.hp > Settings.maxShipHP) playerObj.hp = Settings.maxShipHP;
    }

    if (oppObj.state.id == 4) {
        playerObj.hp -= 2;
        oppObj.hp += 3;
        if (oppObj.hp > Settings.maxShipHP) oppObj.hp = Settings.maxShipHP;
    }
}

function healMedicinalHerbs(playerObj, oppObj) {
    if (oppObj.state.id != 4) {
        playerObj.hp += 1;

        if (playerObj.hp > Settings.maxShipHP) playerObj.hp = Settings.maxShipHP;
    }


    if (oppObj.state.id == 4) {
        oppObj.hp += 1;
        if (oppObj.hp > Settings.maxShipHP) oppObj.hp = Settings.maxShipHP;
    }
}



function healAlcoholWipes(playerObj, oppObj) {
    if (oppObj.state.id != 4) {
        playerObj.hp += 1;

        if (playerObj.hp > Settings.maxShipHP) playerObj.hp = Settings.maxShipHP;
    }


    if (oppObj.state.id == 4) {
        oppObj.hp += 1;
        if (oppObj.hp > Settings.maxShipHP) oppObj.hp = Settings.maxShipHP;
    }
}

function defenseHusaria(playerObj) {
    if (playerObj.ap >= 10) {
        playerObj.ap -= 10;
        playerObj.hp += 2;
        playerObj.state.id = 5;
        // playerObj.state.name = "Acted";
    } else {
        //alert("Not enough action points");
        return { status: 404, result: { msg: "Not enough action points" } };
    }

}

module.exports = MatchDecks;