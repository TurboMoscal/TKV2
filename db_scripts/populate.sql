# Do not change the order or names of states 
#(the code is assuming specific IDs and names)
# You can add more in the end
insert into game_state (gst_state) values ('Waiting');
insert into game_state (gst_state) values ('Started');
insert into game_state (gst_state) values ('Finished');
insert into game_state (gst_state) values ('Canceled');

# Do not change the order, but you can add more in the end
insert into user_game_state (ugst_state) values ('Waiting');
insert into user_game_state (ugst_state) values ('Playing');
insert into user_game_state (ugst_state) values ('End');

# ----------- NEW --------------

insert into ship_state (shs_state) values ('Ready');
insert into ship_state (shs_state) values ('Acted');
insert into ship_state (shs_state) values ('Defensive');

insert into card_type (ct_name) values ('Attack'),('Heal'),('Defense');

insert into card (crd_cost,crd_name, crd_effect,crd_note,crd_type_id) values 
   (2,"Sword Slice","Does 2 damage","Swing your sword and slay your enemies!",1),
   (1,"Mace Swing","Does 2 damage","Crush your foes with all your might!",1),
   (2,"Rapier Dash","Does 1 damage","Thrust into your opponent with incredible speed!",1),
   (2,"Craguemart Slash","Does 2 damage","Sprint into your adversary!",1),
   (2,"Stiletto Jab","Does 1 damage","Quickly jab into your challenger!",1),
   (2,"A true Hospitaller!","Does 3 damage and recovers 3 HP","Show to everyone your true potential!" ,1),
   (2,"Field Doctor","Recovers 3 HP","Call in a doctor to aid your wounds",2),
   (3,"Morphine","Recover 3 HP","Apply this powerfull medicine to relief your pain",2),
   (3,"Pills","Recover 2 HP","Ingest this pills and forget about your previous encounter",2);


INSERT INTO user VALUES (1,'me','$2b$10$Wemfac2wY/7RSCdKxuYUL.GV2clfhXC66OL76uCpDFUmpYZ/bGZtW','48MnTVJ6sKIvanVHbP5Vx5rysbYrVN4EbYmk4D8xESdfm1hx8jDfNFZGNw9OZs'),(2,'me2','$2b$10$6j2xIDnnxv.TLfBSstbbO.qE7wFTf5envx/uijiFjCP3slsy7EE4K','dQ7NrsbPsuF81xFGNioR1K0tiYkjtxOhemcgMhuFIS68VrFUC9gggm3JCgzkqe');
INSERT INTO game VALUES (1,1,2);
INSERT INTO user_game VALUES (1,1,1,2),(2,2,1,1);

INSERT INTO ship VALUES (1,1,1,20,3,3),(2,2,1,20,0,3);

INSERT INTO user_game_card VALUES (1,1,CEIL(RAND()*7),1),(2,1,CEIL(RAND()*7),1),(3,1,CEIL(RAND()*7),1);
