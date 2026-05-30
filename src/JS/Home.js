let homeMovieList = []

// JS SECTION: Logout button handler
function Logout() {
    const btn_logout = document.getElementById("btnLogout")

    if (!btn_logout) {
        return
    }

    btn_logout.addEventListener("click", async () => {
        if (confirm("Bạn có muốn đăng xuất")) {
            await auth.signOut()
            window.location.href = "login.html"
        }
    })
}

// JS SECTION: Firestore movie cards
function loadHomeMovies() {
    db.collection("movies")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
            homeMovieList = []

            snapshot.forEach((doc) => {
                homeMovieList.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            renderHomeMovies()
        }, (error) => {
            console.error(error)
            setHomeEmptyMessage("Không tải được danh sách phim.", true)
        })
}

function renderHomeMovies() {
    const movieList = document.getElementById("movie_list")
    const searchInput = document.querySelector(".site-search input[type='search']")
    const emptyMessage = document.getElementById("homeSearchEmpty")
    const keyword = normalizeSearchText(searchInput ? searchInput.value : "")

    if (!movieList) {
        return
    }

    if (homeMovieList.length === 0) {
        movieList.innerHTML = ""
        setHomeEmptyMessage("Chưa có phim nào được thêm từ Admin.", true)
        return
    }

    const filteredMovies = homeMovieList.filter((movie) => {
        const movieText = normalizeSearchText([
            movie.title,
            movie.category,
            movie.status,
            movie.releaseYear,
            movie.description,
            "Movie"
        ].join(" "))

        return !keyword || movieText.includes(keyword)
    })

    if (filteredMovies.length === 0) {
        movieList.innerHTML = ""
        setHomeEmptyMessage("Không tìm thấy phim phù hợp.", true)
        return
    }

    if (emptyMessage) {
        emptyMessage.classList.add("d-none")
    }

    movieList.innerHTML = filteredMovies.map((movie) => createMovieCardHTML(movie)).join("")
}

function createMovieCardHTML(movie) {
    const title = movie.title || "Chưa có tên phim"
    const category = movie.category || "Chưa có thể loại"
    const releaseYear = movie.releaseYear || "N/A"
    const status = movie.status || "Chưa cập nhật"
    const rating = movie.rating || 0
    const posterUrl = movie.posterUrl || ""

    return `
        <article class="Movie-card" data-movie-id="${escapeHTML(movie.id)}" role="button" tabindex="0">
          <div class="movie-poster">
            <img src="${escapeHTML(posterUrl)}" alt="Poster ${escapeHTML(title)}">
            <span class="rating">${escapeHTML(rating)}</span>
          </div>
          <div class="movie-info">
            <h3 class="Movie-title">${escapeHTML(title)}</h3>
            <p>${escapeHTML(category)}</p>
            <div class="movie-meta">
              <span><i class="bi bi-calendar3"></i> ${escapeHTML(releaseYear)}</span>
              <span><i class="bi bi-badge-hd"></i> ${escapeHTML(status)}</span>
            </div>
          </div>
        </article>
    `
}

function setHomeEmptyMessage(message, isVisible) {
    const emptyMessage = document.getElementById("homeSearchEmpty")

    if (!emptyMessage) {
        return
    }

    emptyMessage.textContent = message
    emptyMessage.classList.toggle("d-none", !isVisible)
}

// JS SECTION: Home movie search
function InitHomeSearch() {
    const form = document.getElementById("homeSearchForm")
    const input = document.querySelector(".site-search input[type='search']")
    const movieList = document.getElementById("movie_list")

    if (!form || !input || !movieList) {
        return
    }

    input.addEventListener("input", renderHomeMovies)

    form.addEventListener("submit", (event) => {
        event.preventDefault()
        renderHomeMovies()
        movieList.scrollIntoView({ behavior: "smooth", block: "start" })
    })
}

// JS SECTION: Home movie detail navigation
function InitMovieCardLinks() {
    const movieList = document.getElementById("movie_list")

    if (!movieList) {
        return
    }

    function openMovieDetail(card) {
        const movieId = card.dataset.movieId

        if (!movieId) {
            return
        }

        window.location.href = `MovieDetail.html?id=${encodeURIComponent(movieId)}`
    }

    movieList.addEventListener("click", (event) => {
        const card = event.target.closest(".Movie-card[data-movie-id]")

        if (card) {
            openMovieDetail(card)
        }
    })

    movieList.addEventListener("keydown", (event) => {
        const card = event.target.closest(".Movie-card[data-movie-id]")

        if (card && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault()
            openMovieDetail(card)
        }
    })
}

function normalizeSearchText(value) {
    return (value || "")
        .toString()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .toLowerCase()
}

function escapeHTML(value) {
    return (value || "")
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

// JS SECTION: Initialize home page events
Logout()
InitHomeSearch()
InitMovieCardLinks()
loadHomeMovies()
