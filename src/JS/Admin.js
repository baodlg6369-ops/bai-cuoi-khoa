let movieDataList = []

// JS SECTION: Admin access guard
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        alert("Vui lòng đăng nhập")
        window.location.href = "login.html"
        return
    }

    const doc = await db.collection("users").doc(user.uid).get()
    if (!doc.exists || doc.data().role_id !== "admin") {
        alert("Bạn không có quyền truy cập trang này")
        window.location.href = "login.html"
        return
    }

    const loadingOverlay = document.getElementById("loadingOverlay")
    if (loadingOverlay) {
        loadingOverlay.style.display = "none"
    }

    InitAdmin()
})

// JS SECTION: Admin page initialization
function InitAdmin() {
    loadMovie()
    AddForm()
    Logout()
    InitAdminSearch()
}

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

// JS SECTION: Add movie form handler
function AddForm() {
    const form = document.getElementById("movieForm")

    if (!form) {
        return
    }

    const btnSubmit = form.querySelector("button[type='submit']")

    form.addEventListener("submit", async (event) => {
        event.preventDefault()

        const title = document.getElementById("movie_title").value.trim()
        const year = document.getElementById("movie_year").value.trim()
        const posterUrl = document.getElementById("movie_poster_url").value.trim()
        const movieUrl = document.getElementById("movie_url").value.trim()
        const status = document.getElementById("movie_status").value
        const category = document.getElementById("movie_category").value
        const description = document.getElementById("movie_description").value.trim()

        if (!title || !posterUrl || !movieUrl || !category || !description) {
            alert("Vui lòng điền đầy đủ thông tin")
            return
        }

        if (Number(year) < 1900) {
            alert("Năm phát hành không hợp lệ")
            return
        }

        btnSubmit.disabled = true

        try {
            await db.collection("movies").add({
                title: title,
                releaseYear: Number(year),
                posterUrl: posterUrl,
                movieUrl: movieUrl,
                status: status,
                category: category,
                description: description,
                rating: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })

            alert(`Đã thêm phim ${title} !!!`)
            form.reset()
        }
        catch (error) {
            alert("Lỗi: " + error.message)
        }
        finally {
            btnSubmit.disabled = false
        }
    })
}

// JS SECTION: Firestore movie list loader
function loadMovie() {
    db.collection("movies")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
            movieDataList = []

            snapshot.forEach((doc) => {
                movieDataList.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            renderMovieTable()
        })
}

// JS SECTION: Admin movie search
function InitAdminSearch() {
    const searchInput = document.querySelector(".admin-search input[type='search']")

    if (!searchInput) {
        return
    }

    searchInput.addEventListener("input", renderMovieTable)
}

function renderMovieTable() {
    const tbody = document.getElementById("productTableBody")
    const searchInput = document.querySelector(".admin-search input[type='search']")
    const keyword = normalizeSearchText(searchInput ? searchInput.value : "")

    if (!tbody) {
        return
    }

    if (movieDataList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">Chưa có sản phẩm nào</td></tr>`
        return
    }

    const filteredMovies = movieDataList.filter((movie) => {
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
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">Không tìm thấy phim phù hợp</td></tr>`
        return
    }

    tbody.innerHTML = ""

    filteredMovies.forEach((movie, index) => {
        const statusText = movie.status || "Chưa cập nhật"
        const statusClass = getStatusBadgeClass(statusText)

        tbody.innerHTML +=
            `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <img class="poster-thumb" src="${escapeHTML(movie.posterUrl)}" alt="${escapeHTML(movie.title)}">
                        </td>
                        <td>
                            <div class="fw-semibold">${escapeHTML(movie.title)}</div>
                            <small class="text-muted">${escapeHTML(movie.category)}</small>
                        </td>
                        <td>${escapeHTML(movie.releaseYear)}</td>
                        <td>Movie</td>
                        <td><span class="${statusClass}">${escapeHTML(statusText)}</span></td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-danger" type="button" title="Xoa" onclick="deleteMovie('${movie.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `
    })
}

function getStatusBadgeClass(status) {
    const value = normalizeSearchText(status)

    if (value.includes("dang") || value.includes("chi")) {
        return "badge-soft badge-showing"
    }

    if (value.includes("hoan") || value.includes("thanh") || (value.includes("ho") && value.includes("th"))) {
        return "badge-soft badge-completed"
    }

    if (value.includes("sap") || value.includes("ra")) {
        return "badge-soft badge-upcoming"
    }

    if (value.includes("an") || value.includes("phim")) {
        return "badge-soft badge-hidden"
    }

    return "badge-soft badge-default"
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

// JS SECTION: Delete movie action
async function deleteMovie(docID) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này: ")) {
        return
    }

    try {
        await db.collection("movies").doc(docID).delete()
    }
    catch (error) {
        alert("Lỗi khi xóa sản phẩm: " + error.message)
    }
}
