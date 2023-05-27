create database game;

use game;

create table user (
    usr_id int not null auto_increment,
    usr_name varchar(60) not null,
    usr_pass varchar(200) not null, 
    usr_token varchar(200),
    primary key (usr_id));

create table game (
    gm_id int not null auto_increment,
    gm_turn int not null default 1,
    gm_state_id int not null,
    primary key (gm_id));

create table game_state (
    gst_id int not null auto_increment,
    gst_state varchar(60) not null,
    primary key (gst_id));

create table user_game (
    ug_id int not null auto_increment,
    ug_user_id int not null,
    ug_game_id int not null,
    ug_state_id int not null,
    primary key (ug_id));

create table user_game_state (
    ugst_id int not null auto_increment,
    ugst_state varchar(60) not null,
    primary key (ugst_id));

create table player (
    pl_id int not null auto_increment,
    pl_user_game_id int not null,
    pl_state_id int not null,
    pl_hp int not null,
    pl_ap int not null,
    pl_class_id int not null,
    primary key (pl_id));

create table player_state (
    pls_id int not null auto_increment,
    pls_state varchar (60) not null,
    primary key (pls_id));


create table hosp_card (
    hosp_crd_id int not null auto_increment,
    hosp_crd_name varchar(50) not null,
    hosp_crd_effect varchar(150) not null,
    hosp_crd_note varchar(200),
    hosp_crd_img varchar(200) not null,
    hosp_crd_type int not null,
    primary key (hosp_crd_id));
    
    
create table class_card (
    cla_crd_id int not null auto_increment,
    cla_crd_name varchar(50) not null,
    cla_crd_effect varchar(150) not null,
    cla_crd_note varchar(200),
    cla_crd_img varchar (200) not null,
    cla_crd_type int not null,
    primary key (cla_crd_id));

create table hus_card (
    hus_crd_id int not null auto_increment,
    hus_crd_name varchar(50) not null,
    hus_crd_effect varchar(150) not null,
    hus_crd_note varchar(200),
    hus_crd_img varchar (200),
    hus_crd_type int not null,
    primary key (hus_crd_id));

create table user_game_hosp_card (
    hosp_ugc_id int not null auto_increment,
    hosp_ugc_user_game_id int not null,
    hosp_ugc_crd_id int not null,
    hosp_ugc_active tinyint(1) not null,
    primary key (hosp_ugc_id)
); 

create table user_game_hus_card (
    hus_ugc_id int not null auto_increment,
    hus_ugc_user_game_id int not null,
    hus_ugc_crd_id int not null,
    hus_ugc_active tinyint(1) not null,
    primary key (hus_ugc_id)
);

create table user_game_class_card (
    ugcla_c_id int not null auto_increment,
    ugcla_c_user_game_id int not null,
    ugcla_c_crd_id int not null,
    ugcla_c_active tinyint(1) not null,
    primary key (ugcla_c_id)
);

create table class (
    class_id int not null,
    class_name varchar(50));




# Foreign Keys

alter table game add constraint game_fk_match_state
            foreign key (gm_state_id) references game_state(gst_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_user
            foreign key (ug_user_id) references user(usr_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_game
            foreign key (ug_game_id) references game(gm_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game add constraint user_game_fk_user_game_state
            foreign key (ug_state_id) references user_game_state(ugst_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;


alter table player add constraint player_fk_user_game
            foreign key (pl_user_game_id) references user_game(ug_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table player add constraint player_fk_player_state
            foreign key (pl_state_id) references player_state(pls_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game_hosp_card add constraint user_game_hosp_card_fk_user_game
            foreign key (hosp_ugc_user_game_id) references user_game(ug_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game_hosp_card add constraint user_game_hosp_card_fk_card
            foreign key (hosp_ugc_crd_id) references hosp_card(hosp_crd_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;


alter table user_game_hus_card add constraint user_game_hus_card_fk_user_game
            foreign key (hus_ugc_user_game_id) references user_game(ug_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table user_game_hus_card add constraint user_game_hus_card_fk_card
            foreign key (hus_ugc_crd_id) references hus_card(hus_crd_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;
