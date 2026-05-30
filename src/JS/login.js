// BƯỚC 1: LẤY PHẦN TỬ
// JS SECTION: Login DOM references
const form = document.querySelector("form")
const emailInput = document.getElementById("floatingInput")
const passwordInput = document.getElementById("floatingPassword")
const rememberCheckbox = document.getElementById("remember-me")


// BƯỚC 2: XỬ LÝ LOGIN
// JS SECTION: Login submit handler
async function handleLogin()
{
    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()
    const remember = rememberCheckbox.checked

    // check dữ liệu
    if(!email || !password)
    {
        alert("Vui lòng nhập email và mật khẩu")
        return
    }

    try
    {
        // đăng nhập
        const userCredential = await auth.signInWithEmailAndPassword(email, password)
        console.log(userCredential)

        console.log("Login success:", userCredential.user.uid)

        alert("Đăng nhập thành công")

        // chuyển trang
        const userDoc = await db.collection("users").doc(userCredential.user.uid).get()
        const userData = userDoc.data()

        if (userDoc.exists && userData.role_id === "admin") {
            window.location.href = "Admin.html"
            return
        }

        window.location.href = "Home.html"
    }
    catch(error)
    {
        alert(error.message)
        console.error(error)
    }
}

// BƯỚC 3: EVENT SUBMIT
// JS SECTION: Login form event binding
form.addEventListener("submit", (e) => {
    e.preventDefault()
    handleLogin()
})
