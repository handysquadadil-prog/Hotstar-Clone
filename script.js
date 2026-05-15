const options = {

    method: 'GET',

    headers: {

        accept: 'application/json',

        Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjZiNTAyOTFiYmI3NzY1ZGYyMTgxMGIwZjU1YjU5ZCIsIm5iZiI6MTc3ODY1MjcyMi43NTAwMDAyLCJzdWIiOiI2YTA0MTYzMjk0YzliYmMwZDM2NGU1MTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ziTEFlvKaWGWySK6jxI18R4-kjbC7YESkC-PzmmRQys'
    }
};



const IMAGE_URL =
"https://image.tmdb.org/t/p/original";



/* =========================
   INITIAL LOAD
========================= */

loadHeroSection();



loadMovieRow(
    "https://api.themoviedb.org/3/trending/movie/week",
    ".trendingRow"
);



loadMovieRow(
    "https://api.themoviedb.org/3/movie/popular",
    ".popularRow"
);



loadMovieRow(
    "https://api.themoviedb.org/3/movie/top_rated",
    ".topRatedRow"
);

loadMovieRow(
    "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
    ".upcomingRow"
);




/* =========================
   HERO SECTION
========================= */

async function loadHeroSection(){

    const response = await fetch(

        "https://api.themoviedb.org/3/trending/movie/week",

        options
    );



    const data = await response.json();

    const movies = data.results;



    setHero(movies[0]);



    renderThumbnails(movies);

}




/* =========================
   HERO THUMBNAILS
========================= */

function renderThumbnails(movies){

    const row =
    document.querySelector(".thumbnailRow");



    row.innerHTML = "";



    movies.forEach(movie => {

        if(!movie.backdrop_path) return;



        const img =
        document.createElement("img");



        img.src =
        IMAGE_URL + movie.backdrop_path;



        img.classList.add("thumb");



        img.addEventListener("click", () => {

            setHero(movie);

        });



        row.appendChild(img);

    });

}




/* =========================
   HERO UPDATE
========================= */

async function setHero(movie){

    // HERO IMAGE

    document.querySelector(".heroImage").src =

    IMAGE_URL + movie.backdrop_path;



    // TITLE

    document.querySelector(".title").textContent =

    movie.title || movie.name;



    // DESCRIPTION

    document.querySelector(".description").textContent =

    movie.overview;



    // META

    document.querySelector(".metaInfo").textContent =

    `${movie.release_date?.split("-")[0] || "2025"}
     • ⭐ ${movie.vote_average?.toFixed(1)}
     • Popularity ${Math.floor(movie.popularity)}`;



    // VIDEO

    const iframe =
    document.querySelector(".heroVideo");



    iframe.src = "";



    iframe.style.opacity = 0;



    // FETCH TRAILER

    const response = await fetch(

        `https://api.themoviedb.org/3/movie/${movie.id}/videos`,

        options
    );



    const data =
    await response.json();



    const trailer =
    data.results.find(video =>

        video.type === "Trailer" &&

        video.site === "YouTube"
    );



    // PLAY VIDEO

    if(trailer){

        setTimeout(() => {

            iframe.src =

            `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1`;



            iframe.style.opacity = 1;

        }, 1500);

    }

}




/* =========================
   FETCH MOVIE ROW
========================= */

async function loadMovieRow(url, rowClass){

    const response =
    await fetch(url, options);



    const data =
    await response.json();



    const movies =
    data.results;



    renderMovieRow(movies, rowClass);

}




/* =========================
   RENDER MOVIE ROW
========================= */

function renderMovieRow(movies, rowClass){

    const row =
    document.querySelector(rowClass);



    row.innerHTML = "";



    movies.forEach(movie => {

        if(!movie.poster_path) return;



        // CARD

        const card =
        document.createElement("div");



        card.classList.add("movieCard");



        // DEFAULT POSTER

        card.innerHTML = `

            <img
                src="${IMAGE_URL + movie.poster_path}"
                class="moviePoster">
        `;



        let hoverTimer;



        /* =========================
           HOVER START
        ========================= */

        card.addEventListener("mouseenter", () => {

            hoverTimer = setTimeout(async () => {



                // REMOVE OTHER ACTIVE

                document
                .querySelectorAll(".movieCard.active")
                .forEach(activeCard => {

                    if(activeCard !== card){

                        activeCard.classList.remove("active");



                        activeCard.innerHTML = `

                            <img
                                src="${activeCard.dataset.poster}"
                                class="moviePoster">
                        `;
                    }

                });



                // SAVE POSTER

                card.dataset.poster =

                IMAGE_URL + movie.poster_path;



                // ACTIVE

                card.classList.add("active");



                // FETCH TRAILER

                const response = await fetch(

                    `https://api.themoviedb.org/3/movie/${movie.id}/videos`,

                    options
                );



                const data =
                await response.json();



                const trailer =
                data.results.find(video =>

                    video.type === "Trailer" &&

                    video.site === "YouTube"
                );



                // EXPANDED CONTENT

                card.innerHTML = `

                    <iframe
                        class="cardVideo"
                        src=""
                        allow="autoplay"
                        allowfullscreen>
                    </iframe>

                    <div class="cardContent">

                        <div class="cardButtons">

                            <button class="cardWatch">
                                ▶ Watch Now
                            </button>

                            <button class="cardAdd">
                                +
                            </button>

                        </div>

                        <div class="cardMeta">

                            ${movie.release_date?.split("-")[0]}
                            • ⭐ ${movie.vote_average.toFixed(1)}
                            • Popularity ${Math.floor(movie.popularity)}

                        </div>

                        <div class="cardDescription">

                            ${movie.overview}

                        </div>

                    </div>
                `;



                // PLAY TRAILER

                if(trailer){

                    setTimeout(() => {

                        const iframe =
                        card.querySelector("iframe");



                        iframe.src =

                        `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1`;

                    }, 500);UAL

                }

            }, 600);

        });




        /* =========================
           HOVER END
        ========================= */

        card.addEventListener("mouseleave", () => {

            clearTimeout(hoverTimer);



            setTimeout(() => {

                if(!card.matches(":hover")){

                    card.classList.remove("active");



                    card.innerHTML = `

                        <img
                            src="${IMAGE_URL + movie.poster_path}"
                            class="moviePoster">
                    `;
                }

            }, 300);

        });



        row.appendChild(card);

    });

}
window.addEventListener("scroll", () => {

    const scrollY = window.scrollY;



    const hero =
    document.querySelector(".hero");



    const overlay =
    document.querySelector(".overlay");



    const heroContent =
    document.querySelector(".heroContent");



    const thumbnailRow =
    document.querySelector(".thumbnailRow");



    // FADE HERO IMAGE

    hero.style.opacity =
    1 - (scrollY / 900);



    // DARKER OVERLAY

    overlay.style.background = `

        radial-gradient(
            circle at center,
            rgba(0,0,0,${0.15 + scrollY / 2500}),
            rgba(0,0,0,${0.82 + scrollY / 2000})
        ),

        linear-gradient(
            to top,
            rgba(4,7,20,1) 0%,
            rgba(4,7,20,${0.1 + scrollY / 2500}) 40%,
            rgba(4,7,20,${0.7 + scrollY / 1500}) 100%
        )
    `;



    // CONTENT FADE

    heroContent.style.opacity =
    1 - (scrollY / 700);



    thumbnailRow.style.opacity =
    1 - (scrollY / 700);

});

