// Bước 1: LẤY PHẦN TỬ
// JS SECTION: Register DOM references
const registerForm = document.getElementById("register-form")
const usernameInput = document.getElementById("username")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirm-password")


// Bước 2: XỬ LÝ ĐĂNG KÝ
// JS SECTION: Register submit handler
async function HandleRegister() {
    let username = usernameInput.value.trim()
    let email = emailInput.value.trim()
    let password = passwordInput.value.trim()
    let confirmPassword = confirmPasswordInput.value.trim()

    // Check xem có nhập đủ không ?
    if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin")
        return
    }

    // Kiểm tra mật khẩu có đúng ký tự quy định không ?
   
    // Check mật khẩu nhập lại có đúng không ?
    if (password !== confirmPassword) {
        alert("Nhập lại mật khẩu không khớp")
        return
    }

    // TODO: Dùng firebase để đăng nhập
    try {
        // B1: Tạo user bằng Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password)

        const uid = userCredential.user.uid

        // B2: Lưu thông tin user vào Firestore
        await db.collection("users").doc(uid).set({
            username: username,
            email: email,
            password: password,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            role_id: "user"
        })

        alert("Đăng ký thành công")

        window.location.href = "login.html"
    }
    catch (error) {
        alert(error.message)
        console.error(error)
    }

}

// BƯỚC 3: KẾT NỐI SỰ KIỆN
// JS SECTION: Register form event binding
registerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    HandleRegister()
})
