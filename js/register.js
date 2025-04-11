document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn submit mặc định

    // Lấy các input
    const fullName = document.getElementById('fullName');
    const firstName = document.getElementById('firstName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const terms = document.getElementById('terms');

    // Lấy các nhóm form và thông báo lỗi
    const groups = document.querySelectorAll('.form-group');
    let isValid = true;

    // Xóa trạng thái lỗi trước đó
    groups.forEach(group => {
        group.classList.remove('invalid');
        const errorMessage = group.querySelector('.error-message');
        errorMessage.textContent = '';
    });

    // Kiểm tra từng trường
    if (!fullName.value.trim()) {
        fullName.closest('.form-group').classList.add('invalid');
        fullName.closest('.form-group').querySelector('.error-message').textContent = 'Vui lòng nhập họ và tên đệm';
        isValid = false;
    }

    if (!firstName.value.trim()) {
        firstName.closest('.form-group').classList.add('invalid');
        firstName.closest('.form-group').querySelector('.error-message').textContent = 'Vui lòng nhập tên';
        isValid = false;
    }

    if (!email.value.trim()) {
        email.closest('.form-group').classList.add('invalid');
        email.closest('.form-group').querySelector('.error-message').textContent = 'Vui lòng nhập email';
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        email.closest('.form-group').classList.add('invalid');
        email.closest('.form-group').querySelector('.error-message').textContent = 'Vui lòng nhập email hợp lệ';
        isValid = false;
    }

    if (!password.value.trim()) {
        password.closest('.form-group').classList.add('invalid');
        password.closest('.form-group').querySelector('.error-message').textContent = 'Vui lòng nhập mật khẩu';
        isValid = false;
    }

    if (!terms.checked) {
        terms.closest('.form-group').classList.add('invalid');
        terms.closest('.form-group').querySelector('.error-message').textContent = 'Vui lòng đồng ý với chính sách và điều khoản';
        isValid = false;
    }

    // Nếu form hợp lệ, lưu vào localStorage và chuyển hướng
    if (isValid) {
        // Lấy danh sách người dùng hiện có từ localStorage (nếu có)
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Thêm người dùng mới
        const newUser = {
            fullName: fullName.value.trim(),
            firstName: firstName.value.trim(),
            email: email.value.trim(),
            password: password.value.trim()
        };
        users.push(newUser);

        // Lưu lại vào localStorage
        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
            title: "Thành công",
            text: "Bạn đã đăng kí thành công",
            icon: "success",
          });
          setTimeout(() => {
            window.location.href = "./login.html";
          }, 1500); 
        }
    });

// Hàm kiểm tra định dạng email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}