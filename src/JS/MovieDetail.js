// JS SECTION: Firestore movie detail renderer
async function InitMovieDetail() {
    const params = new URLSearchParams(window.location.search)
    const movieId = params.get("id")

    if (!movieId) {
        showMovieNotFound()
        return
    }

    try {
        const doc = await db.collection("movies").doc(movieId).get()

        if (!doc.exists) {
            showMovieNotFound()
            return
        }

        renderMovieDetail(doc.data())
    }
    catch (error) {
        console.error(error)
        showMovieNotFound()
    }
}

function renderMovieDetail(movie) {
    const title = movie.title || "Chưa có tên phim"
    const category = movie.category || "Chưa có thể loại"
    const year = movie.releaseYear || "N/A"
    const rating = movie.rating || 0
    const status = movie.status || "Chưa cập nhật"
    const description = movie.description || "Chưa có mô tả."

    setText("detailTitle", title)
    setText("detailCategory", category)
    setText("detailYear", year)
    setText("detailRating", rating)
    setText("detailRatingText", rating)
    setText("detailStatus", status)
    setText("detailDescription", description)

    const poster = document.getElementById("detailPoster")
    if (poster) {
        poster.src = movie.posterUrl || ""
        poster.alt = `Poster ${title}`
    }

    const movieLink = document.getElementById("detailMovieLink")
    if (movieLink && movie.movieUrl) {
        movieLink.href = movie.movieUrl
        movieLink.classList.remove("d-none")
    }
}

function showMovieNotFound() {
    const detail = document.getElementById("movieDetail")
    const notFound = document.getElementById("movieNotFound")

    if (detail) {
        detail.classList.add("d-none")
    }

    if (notFound) {
        notFound.classList.remove("d-none")
    }
}

function setText(id, value) {
    const element = document.getElementById(id)

    if (element) {
        element.textContent = value || ""
    }
}

InitMovieDetail()
