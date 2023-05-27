insert into game_state (gst_state) values ('Waiting');
insert into game_state (gst_state) values ('Started');
insert into game_state (gst_state) values ('Finished');
insert into game_state (gst_state) values ('Canceled');


insert into user_game_state (ugst_state) values ('Waiting');
insert into user_game_state (ugst_state) values ('Playing');
insert into user_game_state (ugst_state) values ('End');


insert into player_state (pls_state) values ('Ready');
insert into player_state (pls_state) values ('Acted');
insert into player_state (pls_state) values ('Choice');
insert into player_state (pls_state) values ('Acted');
insert into player_state (pls_state) values ('Acted');


insert into hosp_card (hosp_crd_name, hosp_crd_effect,hosp_crd_note,hosp_crd_img,hosp_crd_type) values 
   ("Sword Slice","Does 2 damage","Swing your sword and slay your enemies!","swordCard.png",1),
   ("Mace Swing","Does 1 damage","Crush your foes with all your might!","maceCard.png",1),
   ("Rapier Dash","Does 1 damage","Thrust into your opponent with incredible speed!","rapierCard.png",1),
   ("Scimitar Slash","Does 2 damage","Sprint into your adversary!","craguemartCard.png",1),
   ("Stiletto Jab","Does 1 damage","Quickly jab into your challenger!","stilettoCard.png",1),
   ("Show Yourself","Does 3 damage and recovers 2 HP","Show to everyone your true potential!","atruehospCard.png",3),
   ("Field Doctor","Recovers 3 HP","Call in a doctor to aid your wounds","fielddoctorCard.png",2),
   ("Morphine","Recovers 2 HP","Apply this powerfull medicine to relief your pain","morphineCard.png",2),
   ("Mirror","Reflects opponent damage/healing","Defeat the enemy with his own weapons!","mirrorCard.png",4),
   ("Defense","Protects from opponent damage and does 2 damage","Become invulnerable for one turn!","hospdefenceCard.png",5);



insert into hus_card (hus_crd_name, hus_crd_effect,hus_crd_note,hus_crd_img,hus_crd_type) values 
	("Spear Strike","Does three damage to opponent","The enemy will not have time to dodge!","spearCard.png",1),
	("Arrow Shot" ,"Does two damage to opponent" ,"Hit your enemy at a distance!","arrowCard.png",1),
	("Dagger","Does 2 damage" ,"Knife the enemy with incredible speed!","daggerCard.png",1),
 	("Halberd Thrust" ,"Does three damage to opponent", "It's time for heavy weapons!","halberdCard.png",1),
	("Herbs" ,"Heals one health points from user","Draw the healing powers of nature!","medicinalherbsCard.png",2),
	("A true Hussar!", "Does 2 damage and recovers 3 HP","Spread your wings and destroy the enemy!","atruehusCard.png",3),	
	("Alcohol Wipes", "Heals one health points from user ","Don't forget to disinfect your wounds!","alcoholCard.png",2),
   ("Mirror","Reflects opponent damage/healing","Defeat the enemy with his own weapons!","mirrorCard.png",4),
   ("Defense","Protects from opponent damage and recover 2 HP","Become invulnerable for one turn!","husdefenceCard.png",5);


insert into class_card (cla_crd_name, cla_crd_effect,cla_crd_note,cla_crd_img,cla_crd_type) values 
   ("Hospitaller","Select Hospitaller","Become a Hospitaller!","hospCard.png",6),
   ("Husaria","Select Husaria","Become a Hussar!","husCard.png",6);

insert into class (class_name, class_id) 
values ("NotSelected",0), ("Hospitaller",1), ("Husaria",2); 

INSERT INTO user VALUES (1,'me','$2b$10$Wemfac2wY/7RSCdKxuYUL.GV2clfhXC66OL76uCpDFUmpYZ/bGZtW','48MnTVJ6sKIvanVHbP5Vx5rysbYrVN4EbYmk4D8xESdfm1hx8jDfNFZGNw9OZs'),(2,'me2','$2b$10$6j2xIDnnxv.TLfBSstbbO.qE7wFTf5envx/uijiFjCP3slsy7EE4K','dQ7NrsbPsuF81xFGNioR1K0tiYkjtxOhemcgMhuFIS68VrFUC9gggm3JCgzkqe');
INSERT INTO game VALUES (1,1,2);
INSERT INTO user_game VALUES (1,1,1,2),(2,2,1,1);

INSERT INTO player VALUES (1,1,1,10,20,1),(2,2,1,10,20,2);

INSERT INTO user_game_hosp_card VALUES (1,1,9,1),(2,1,10,1),(3,1,6,1);

INSERT INTO user_game_hus_card VALUES (1,2,9,1),(2,2,8,1),(3,2,6,1);