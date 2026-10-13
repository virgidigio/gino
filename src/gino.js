const TERRA = "0xB96E54"; 
const NERO = "0x000000";

const A_TERRENO = 96;
const Y_TERRENO = 624;
const X_GINO = 200;
const L_GINO = 81;
const A_GINO = 84;
const L_FUNGO = 90;
const A_FUNGO = 63;

const TASTO_FUOCO = PP.key_codes.F;
const TASTO_SALTO = PP.key_codes.SPACE;
const VEL_FUOCO = 600;
const VEL_SALTO = 1000;
const VEL_INIZIALE = 400; 
const ACCELERAZIONE = 20;
const DISTANZA_MAX = 600;

let terreno;
let gino;
let fungo;
let fuoco = null;
let vel_fungo = VEL_INIZIALE;
let partita_finita = false;
let testo_fine;
let testo_rigioca;

let img_sfondo; 
let img_terreno; 
let img_gino; 
let img_fungo; 
let img_fuoco;

function preload(s) {
img_sfondo = PP.assets.image.load(s, "assets/sfondo.png"); 
img_terreno = PP.assets.image.load(s, "assets/terreno.png"); 
img_gino = PP.assets.image.load(s, "assets/gino.png"); 
img_fungo = PP.assets.image.load(s, "assets/fungo.png"); 
img_fuoco = PP.assets.image.load(s, "assets/fuoco.png");
}

function crea_terreno(s) {
terreno = PP.assets.image.add(s, img_terreno, LARGHEZZA / 2, Y_TERRENO + A_TERRENO / 2, 0.5, 0.5);
    PP.physics.add(s, terreno, PP.physics.type.STATIC);
}

function crea_gino(s) {
    gino = PP.assets.image.add(s, img_gino, X_GINO, Y_TERRENO - A_GINO / 2, 0.5, 0.5);
    PP.physics.add(s, gino, PP.physics.type.DYNAMIC);
    PP.physics.set_collide_world_bounds(gino, true);
    PP.physics.add_collider(s, gino, terreno);
    PP.physics.set_collision_rectangle(gino, 51, 72, 15, 12);
}

function crea_fungo(s) {
    fungo = PP.assets.image.add(s, img_fungo, LARGHEZZA * 3 / 4, Y_TERRENO - A_FUNGO / 2, 0.5, 0.5);
    PP.physics.add(s, fungo, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(fungo, false);
    PP.physics.set_velocity_x(fungo,-vel_fungo);
    PP.physics.add_overlap_f(s, gino, fungo, fine_partita);
}

function fine_partita(s, gino, fungo) {
    partita_finita = true;
    PP.physics.set_velocity_x(fungo, 0);
    testo_fine.visibility.hidden = false;
    testo_rigioca.visibility.hidden = false;
}

function create(s) {
    PP.assets.image.add(s, img_sfondo, 0, 0, 0, 0);
    crea_terreno(s);
    crea_gino(s);
    crea_fungo(s);
    crea_fine(s);
}

function salta(s) {
if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO) && PP.physics.is_on_ground(gino)) 
    {
    PP.physics.set_velocity_y(gino, -VEL_SALTO);
    }
}

function controlla_fungo(s) {
    if (fungo.geometry.body_x < -L_FUNGO) {
    vel_fungo += ACCELERAZIONE;
    resetta_fungo(s);}
}

function resetta_fungo(s) {
    fungo.geometry.x = LARGHEZZA + L_FUNGO / 2 + Math.random() * DISTANZA_MAX;
    PP.physics.set_velocity_x(fungo,-vel_fungo);
}

function spara(s) {
    if (fuoco === null && 
        PP.interactive.kb.is_key_just_down(s, TASTO_FUOCO)) {
        fuoco = PP.assets.image.add(s, img_fuoco, gino.geometry.body_x- 15 + L_GINO, gino.geometry.body_y- 12 + A_GINO / 4, 0.5, 0.5);
    PP.physics.add(s, fuoco, PP.physics.type.DYNAMIC); PP.physics.set_velocity_x(fuoco, VEL_FUOCO);
    PP.physics.add_collider(s, fuoco, terreno);
    PP.physics.set_bounce_y(fuoco, 1);
    PP.physics.add_overlap_f(s, fuoco, fungo, brucia);
    }
}

function controlla_fuoco(s) {
    if (fuoco !== null && 
        fuoco.geometry.body_x > LARGHEZZA) { 
            PP.assets.destroy(fuoco); fuoco = null; 
        } 
}

function brucia(s, a, b) { 
    PP.assets.destroy(a); fuoco = null; resetta_fungo(); }

function update(s) {
    if (partita_finita) {
        if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)) {
            ricomincia(s);
        }
        return;
    }
    salta(s);
    controlla_fungo(s);
    spara(s);
    controlla_fuoco(s);
}

function crea_fine(s) {
    testo_fine = PP.shapes.text_styled_add(s, 
    LARGHEZZA / 2, ALTEZZA / 3, "GAME OVER", 64, "Arial", "bold", NERO, null, 0.5, 0.5);
    testo_fine.visibility.hidden = true;

    testo_rigioca = PP.shapes.text_styled_add(s, 
    LARGHEZZA / 2, ALTEZZA / 2, "PLAY AGAIN [press space]", 32, "Arial", "bold", NERO, null, 0.5, 0.5);
    testo_rigioca.visibility.hidden = true;
}

function ricomincia (s) {
    partita_finita = false;
    vel_fungo = VEL_INIZIALE;
    resetta_fungo(s);
    testo_fine.visibility.hidden = true;
    testo_rigioca.visibility.hidden = true;
}

function destroy(s) {

}

PP.scenes.add("gino", preload, create, update, destroy);