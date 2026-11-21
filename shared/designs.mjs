import {classifyDesign,isPublishedDesign} from './designCategories.mjs';
// Catálogo único de estampados locales; compartido por tienda y servidor.
import { DROP100_DESIGNS } from './drop100.mjs';
import { METAL_SLUG_DESIGNS } from './metalSlug.mjs';
import { METAL_SLUG_NEO_DESIGNS } from './metalSlugNeo.mjs';
import { IMPORTED_DESIGNS } from './importedDesigns.mjs';
import { SOLO_LEVELING_MONARCH_DESIGNS } from './soloLevelingMonarch.mjs';
import { HUNTER_EPIC_DESIGNS } from './hunterEpic.mjs';
const RAW_DESIGNS = [
  ...HUNTER_EPIC_DESIGNS,
  ...SOLO_LEVELING_MONARCH_DESIGNS,
  ...IMPORTED_DESIGNS,
  {
    id: 'doom-ramon',
    name: 'Doom Ramón · El señor de la vecindad',
    collection: 'Memes',
    group: 'Memes',
    priority: -6,
    accent: '#13c74b',
    src: '/assets/designs/doom-ramon.png'
  },
  ...METAL_SLUG_NEO_DESIGNS,
  ...METAL_SLUG_DESIGNS,
  ...DROP100_DESIGNS,
  {
    "id": "alien-rebel",
    "name": "Alien · Rebelde Neón",
    "collection": "Memes",
    "group": "Memes",
    "priority": -2,
    "accent": "#b5ed12",
    "src": "/assets/designs/alien-rebel.png"
  },
  {
    "id": "futurama-bender",
    "name": "Bender · Metal Rebelde",
    "accent": "#b9c8cb",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-bender.png"
  },
  {
    "id": "futurama-fry",
    "name": "Fry · Delivery Cósmico",
    "accent": "#ed6b36",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-fry.png"
  },
  {
    "id": "futurama-leela",
    "name": "Leela · Capitana Estelar",
    "accent": "#ad8ae0",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-leela.png"
  },
  {
    "id": "futurama-zoidberg",
    "name": "Zoidberg · Disco Galáctico",
    "accent": "#eb6e61",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-zoidberg.png"
  },
  {
    "id": "futurama-nibbler",
    "name": "Nibbler · Hambre Infinita",
    "accent": "#e2b858",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-nibbler.png"
  },
  {
    "id": "futurama-profesor",
    "name": "Profesor · Laboratorio 3000",
    "accent": "#9acda0",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-profesor.png"
  },
  {
    "id": "futurama-planet-express",
    "name": "Planet Express · Ruta 3000",
    "accent": "#67c7b4",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-planet-express.png"
  },
  {
    "id": "futurama-hypnotoad",
    "name": "Hypnotoad · Frecuencia Hipnótica",
    "accent": "#c5cd68",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-hypnotoad.png"
  },
  {
    "id": "futurama-bender-fry",
    "name": "Fry & Bender · Turno Espacial",
    "accent": "#f08d4e",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-bender-fry.png"
  },
  {
    "id": "futurama-calculon",
    "name": "Calculon · Drama Cósmico",
    "accent": "#d9ad58",
    "collection": "Futurama",
    "group": "Futurama",
    "priority": -1,
    "src": "/assets/designs/futurama-calculon.png"
  },
  {
    "id": "imu-crimson",
    "name": "Imu · Eclipse Carmesí",
    "collection": "One Piece",
    "group": "Anime",
    "priority": 0,
    "accent": "#a72b3b",
    "src": "/assets/designs/imu-crimson.png"
  },
  {
    "id": "imu-elbaf",
    "priority": 1,
    "name": "Imu · Elbaf Manga",
    "collection": "One Piece",
    "group": "Anime",
    "accent": "#b8b8b4",
    "src": "/assets/designs/imu-elbaf.png"
  },
  {
    "id": "luffy",
    "name": "Luffy · Gear 5",
    "collection": "One Piece",
    "src": "/assets/designs/luffy.png",
    "accent": "#a79ade"
  },
  {
    "id": "clover",
    "name": "Asta · Black mode",
    "collection": "Black Clover",
    "src": "/assets/designs/clover.png",
    "accent": "#a1bf84"
  },
  {
    "id": "hunter",
    "name": "Gon & Killua",
    "collection": "Hunter × Hunter",
    "src": "/assets/designs/hunter.png",
    "accent": "#72aeba"
  },
  {
    "id": "rock",
    "name": "Born to be loud",
    "collection": "Rock",
    "src": "/assets/designs/rock.png",
    "accent": "#ce8575"
  },
  {
    "id": "metal",
    "name": "Midnight ritual",
    "collection": "Rock",
    "src": "/assets/designs/metal.png",
    "accent": "#c0c3a5"
  },
  {
    "id": "meme",
    "name": "Todo bajo control",
    "collection": "Memes",
    "src": "/assets/designs/meme.png",
    "accent": "#e0ae76"
  },
  {
    "id": "gojo",
    "name": "Gojo · Infinity",
    "collection": "Jujutsu Kaisen",
    "src": "/assets/designs/gojo.png",
    "accent": "#85a9cf"
  },
  {
    "id": "naruto",
    "name": "Naruto · Rasengan",
    "collection": "Naruto",
    "src": "/assets/designs/naruto.png",
    "accent": "#dca374"
  },
  {
    "id": "zoro",
    "name": "Zoro · Tres espadas",
    "collection": "One Piece",
    "group": "Anime",
    "accent": "#8bb38c",
    "src": "/assets/designs/zoro.png"
  },
  {
    "id": "saitama",
    "name": "Saitama · Día libre",
    "collection": "One Punch Man",
    "group": "Anime",
    "accent": "#99c6e8",
    "src": "/assets/designs/saitama.png"
  },
  {
    "id": "tanjiro",
    "name": "Tanjiro · Marea azul",
    "collection": "Demon Slayer",
    "group": "Anime",
    "accent": "#79b9bd",
    "src": "/assets/designs/tanjiro.png"
  },
  {
    "id": "levi",
    "name": "Levi · Alas de libertad",
    "collection": "Attack on Titan",
    "group": "Anime",
    "accent": "#95a28c",
    "src": "/assets/designs/levi.png"
  },
  {
    "id": "ichigo",
    "name": "Ichigo · Hollow",
    "collection": "Bleach",
    "group": "Anime",
    "accent": "#da9972",
    "src": "/assets/designs/ichigo.png"
  },
  {
    "id": "denji",
    "name": "Denji · Chainsaw",
    "collection": "Chainsaw Man",
    "group": "Anime",
    "accent": "#d78767",
    "src": "/assets/designs/denji.png"
  },
  {
    "id": "ryuk",
    "name": "Ryuk · Manzana roja",
    "collection": "Death Note",
    "group": "Anime",
    "accent": "#b992b7",
    "src": "/assets/designs/ryuk.png"
  },
  {
    "id": "eva01",
    "name": "Eva 01 · Awakening",
    "collection": "Evangelion",
    "group": "Anime",
    "accent": "#b493da",
    "src": "/assets/designs/eva01.png"
  },
  {
    "id": "guts",
    "name": "Guts · Eclipse",
    "collection": "Berserk",
    "group": "Anime",
    "accent": "#bc887f",
    "src": "/assets/designs/guts.png"
  },
  {
    "id": "anya",
    "name": "Anya · Modo misión",
    "collection": "Spy × Family",
    "group": "Anime",
    "accent": "#dda6a5",
    "src": "/assets/designs/anya.png"
  },
  {
    "id": "cosmic-riff",
    "name": "Cosmic riff",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#8fa8ce",
    "src": "/assets/designs/cosmic-riff.png"
  },
  {
    "id": "skull-roses",
    "name": "Skull & roses",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#c47d85",
    "src": "/assets/designs/skull-roses.png"
  },
  {
    "id": "raven-riff",
    "name": "Raven anthem",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#9c9fbd",
    "src": "/assets/designs/raven-riff.png"
  },
  {
    "id": "desert-tour",
    "name": "Desert rider",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#ceaa79",
    "src": "/assets/designs/desert-tour.png"
  },
  {
    "id": "venom-vinyl",
    "name": "Venom vinyl",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#a4b58b",
    "src": "/assets/designs/venom-vinyl.png"
  },
  {
    "id": "thunder-wolf",
    "name": "Thunder wolf",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#94afcd",
    "src": "/assets/designs/thunder-wolf.png"
  },
  {
    "id": "inferno-amp",
    "name": "Inferno volume",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#d89472",
    "src": "/assets/designs/inferno-amp.png"
  },
  {
    "id": "moon-bat",
    "name": "Midnight echo",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#b498c9",
    "src": "/assets/designs/moon-bat.png"
  },
  {
    "id": "punk-rebel",
    "name": "Punk attitude",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#d4b179",
    "src": "/assets/designs/punk-rebel.png"
  },
  {
    "id": "electric-tiger",
    "name": "Electric tiger",
    "collection": "Rock",
    "group": "Rock",
    "accent": "#dd9d6b",
    "src": "/assets/designs/electric-tiger.png"
  },
  {
    "id": "capybara-zen",
    "name": "Capibara · Cero estrés",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#c9b18b",
    "src": "/assets/designs/capybara-zen.png"
  },
  {
    "id": "cat-buffering",
    "name": "Gato · Procesando",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#a7a4ca",
    "src": "/assets/designs/cat-buffering.png"
  },
  {
    "id": "dog-astronaut",
    "name": "Houston, tengo sueño",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#8dadc3",
    "src": "/assets/designs/dog-astronaut.png"
  },
  {
    "id": "opossum-night",
    "name": "Turno nocturno",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#ba9cb6",
    "src": "/assets/designs/opossum-night.png"
  },
  {
    "id": "frog-deadline",
    "name": "Rana · Último minuto",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#9fbc89",
    "src": "/assets/designs/frog-deadline.png"
  },
  {
    "id": "raccoon-snack",
    "name": "Mapache · Snack mode",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#c1aa92",
    "src": "/assets/designs/raccoon-snack.png"
  },
  {
    "id": "duck-chaos",
    "name": "Pato · Caos controlado",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#d9bc79",
    "src": "/assets/designs/duck-chaos.png"
  },
  {
    "id": "skeleton-battery",
    "name": "Batería social · 1%",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#afa2be",
    "src": "/assets/designs/skeleton-battery.png"
  },
  {
    "id": "pigeon-boss",
    "name": "Paloma · CEO del parque",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#a2b2bd",
    "src": "/assets/designs/pigeon-boss.png"
  },
  {
    "id": "toast-existential",
    "name": "Tostada · Existiendo",
    "collection": "Memes",
    "group": "Memes",
    "accent": "#d6aa85",
    "src": "/assets/designs/toast-existential.png"
  }
];

export const DESIGNS=RAW_DESIGNS.filter(isPublishedDesign).map(classifyDesign);
