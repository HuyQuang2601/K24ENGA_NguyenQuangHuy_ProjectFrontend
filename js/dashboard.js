document.addEventListener('DOMContentLoaded', function() {
    // Lấy phần tử avatar và modal đăng xuất
    const avatar = document.querySelector('.human'); // Class của avatar (hình ảnh)
    const logoutModal = document.getElementById('logoutModal');
    const logoutButton = document.getElementById('logoutButton');

    // Kiểm tra tồn tại của các phần tử
    if (!avatar) {
        console.error('Phần tử avatar (class .human) không được tìm thấy!');
        return;
    }
    if (!logoutModal) {
        console.error('Phần tử logoutModal không được tìm thấy!');
        return;
    }
    if (!logoutButton) {
        console.error('Phần tử logoutButton không được tìm thấy!');
        return;
    }

    // Debug số lượng phần tử .human
    const humans = document.querySelectorAll('.human');

    // Khi nhấp vào avatar, hiển thị modal đăng xuất
    avatar.addEventListener('click', function(e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
        e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
        logoutModal.style.display = 'block'; // Hiển thị modal
    });

    // Khi nhấp vào nút Đăng xuất, hiển thị xác nhận
    logoutButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
        const isConfirmed = confirm('Bạn có chắc chắn muốn đăng xuất?');

        if (isConfirmed) {
            Swal.fire({
                title: "Thành công",
                text: "Bạn đã đăng xuất thành công",
                icon: "success",
              });
              setTimeout(() => {
                window.location.href = "./login.html";
              }, 1500); 

            window.location.href = '/pages/login.html'; // Chuyển hướng về trang đăng nhập
            logoutModal.style.display = 'none'; // Ẩn modal sau khi đăng xuất
        }
    });

    // Đóng modal khi nhấp ra ngoài
    document.addEventListener('click', function(e) {
        if (logoutModal.style.display === 'block' && !logoutModal.contains(e.target) && e.target !== avatar) {
            logoutModal.style.display = 'none';
        }
    });
});


// Modal đăng xuất
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử cần thiết
    const logoutLink = document.getElementById('logoutLink'); // Liên kết "Đăng xuất" trong dropdown
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // Kiểm tra tồn tại của các phần tử
    if (!logoutLink) {
        console.error('Phần tử logoutLink không được tìm thấy!');
        return;
    }
    if (!logoutModal) {
        console.error('Phần tử logoutModal không được tìm thấy!');
        return;
    }
    if (!confirmLogout) {
        console.error('Phần tử confirmLogout không được tìm thấy!');
        return;
    }
    if (!cancelLogout) {
        console.error('Phần tử cancelLogout không được tìm thấy!');
        return;
    }

    // Khi nhấp vào liên kết "Đăng xuất" trong dropdown, hiển thị modal
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển hướng)
        logoutModal.style.display = 'block'; // Hiển thị modal
    });

    // Khi nhấp vào nút "Đăng xuất" trong modal, xác nhận
    confirmLogout.addEventListener('click', function(e) {
        e.stopPropagation();
        

            Swal.fire({
                title: "Thành công",
                text: "Bạn đã đăng xuất thành công",
                icon: "success",
            }).then(() => {
                setTimeout(() => {
                    window.location.href = "./login.html"; // Chuyển hướng về trang đăng nhập
                }, 1500);
            });
            logoutModal.style.display = 'none'; // Ẩn modal sau khi đăng xuất
        
    });

    // Khi nhấp vào nút "Hủy", đóng modal
    cancelLogout.addEventListener('click', function(e) {
        e.stopPropagation();
        logoutModal.style.display = 'none'; // Ẩn modal
    });

    // Đóng modal khi nhấp ra ngoài
    document.addEventListener('click', function(e) {
        if (logoutModal.style.display === 'block' && !logoutModal.contains(e.target) && e.target !== logoutLink) {
            logoutModal.style.display = 'none';
        }
    });
});