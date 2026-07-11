const userId = "1086830166812135435";

const avatar = document.getElementById("avatar");
const username = document.getElementById("username");
const discordTag = document.getElementById("discord-tag");
const status = document.getElementById("status");
const statusDot = document.getElementById("status-dot");

const gameCard = document.getElementById("game-card");
const gameIcon = document.getElementById("game-icon");
const gameName = document.getElementById("game-name");
const gameDetails = document.getElementById("game-details");

const spotifyCard = document.getElementById("spotify-card");
const spotifyCover = document.getElementById("spotify-cover");
const spotifySong = document.getElementById("spotify-song");
const spotifyArtist = document.getElementById("spotify-artist");
const spotifyCurrent = document.getElementById("spotify-current");
const spotifyTotal = document.getElementById("spotify-total");
const spotifyProgress = document.getElementById("spotify-progress");


const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


let spotifyStart = null;
let spotifyEnd = null;


function formatTime(ms) {

    const seconds = Math.floor(ms / 1000);

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;


    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;

}



async function getDiscordData() {

    try {

        const response = await fetch(
            `https://api.lanyard.rest/v1/users/${userId}`
        );


        const data = await response.json();



        if (!data.success) {

            username.textContent = "Discord no disponible";
            status.textContent = "Sin conexión";

            return;

        }



        const user = data.data;



        // PERFIL

        username.textContent =
            user.discord_user.global_name ||
            user.discord_user.username;



        discordTag.textContent =
            `@${user.discord_user.username}`;



        avatar.src =
            `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.webp?size=256`;





        // ESTADO


        const currentStatus =
            user.discord_status;



        status.className = "status";
        statusDot.className = "status-dot";



        switch (currentStatus) {


            case "online":

                status.textContent = "En línea";

                status.classList.add("online");

                statusDot.classList.add("online");

                break;



            case "idle":

                status.textContent = "Ausente";

                status.classList.add("idle");

                statusDot.classList.add("idle");

                break;



            case "dnd":

                status.textContent = "No molestar";

                status.classList.add("dnd");

                statusDot.classList.add("dnd");

                break;



            default:

                status.textContent = "Desconectado";

                status.classList.add("offline");

                statusDot.classList.add("offline");

        }





        // SPOTIFY


        if (user.listening_to_spotify) {


            const spotify = user.spotify;


            spotifyCard.style.display = "flex";


            spotifyCover.src =
                spotify.album_art_url;


            spotifySong.textContent =
                spotify.song;


            spotifyArtist.textContent =
                spotify.artist;



            if (spotify.timestamps) {

                spotifyStart =
                    spotify.timestamps.start;


                spotifyEnd =
                    spotify.timestamps.end;

            }


        } else {


            spotifyCard.style.display = "none";


            spotifyStart = null;

            spotifyEnd = null;


        }







        // JUEGO / ACTIVIDAD

const game =
    user.activities.find(
        activity => activity.type === 0
    );

if (game) {

    gameCard.style.display = "flex";

    gameName.textContent =
        game.name;

    gameDetails.textContent =
        game.details ||
        "Jugando ahora";

    gameIcon.style.display = "block";

    if (game.assets?.large_image) {

        if (game.assets.large_image.startsWith("mp:")) {

            gameIcon.src =
                `https://media.discordapp.net/${game.assets.large_image.replace("mp:", "")}`;

        } else {

            gameIcon.src =
                `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png?size=256`;

        }

    } else {

        const customIcons = {
            "ROBLOX": "assets/icons/roblox.png",
            "Minecraft": "assets/icons/minecraft.png",
            "Minecraft Launcher": "assets/icons/minecraft.png",
            "Java(TM) Platform SE Binary": "assets/icons/minecraft.png"
        };

        gameIcon.src =
            customIcons[game.name] ||
            "assets/icons/default-game.png";

    }

} else {

    gameCard.style.display = "none";

}





    } catch (error) {


        console.error(
            "Error al obtener datos de Discord:",
            error
        );


        username.textContent =
            "Sin conexión";


        status.textContent =
            "Error";


    }

}






// ACTUALIZAR SPOTIFY


setInterval(() => {


    if (spotifyStart && spotifyEnd) {



        const current =
            Date.now() - spotifyStart;



        const total =
            spotifyEnd - spotifyStart;




        if (current < total) {



            spotifyCurrent.textContent =
                formatTime(current);



            spotifyTotal.textContent =
                formatTime(total);




            spotifyProgress.style.width =
                `${(current / total) * 100}%`;



        }


    }



}, 1000);







// INICIO


getDiscordData();



// ACTUALIZAR DISCORD CADA 3 SEGUNDOS


setInterval(
    getDiscordData,
    3000
);