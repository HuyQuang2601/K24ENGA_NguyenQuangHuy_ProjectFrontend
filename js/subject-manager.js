document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử cần thiết
    const buttonAddCategory = document.getElementById('buttonAddCategory');
    const formCategory = document.getElementById('formCategory');
    const iconCloseFormCategory = document.getElementById('iconCloseFormCategory');
    const btnCloseFormCategory = document.getElementById('btnCloseFormCategory');
    const btnAddFormCategory = document.getElementById('btnAddFormCategory');
    const categoryTableBody = document.querySelector('.category-table tbody');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const deleteSubjectName = document.getElementById('deleteSubjectName');
    const pagination = document.querySelector('.pagination');
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = pagination ? pagination.querySelector('.prev') : null;
    const nextBtn = pagination ? pagination.querySelector('.next') : null;
    const inputSearch = document.querySelector('.input-search');

    let currentRow = null;
    const STORAGE_KEY = 'subjects';
    let currentPage = 1;
    const itemsPerPage = 7;

    // Hàm tải danh sách bài học từ localStorage
    function loadSubjects() {
        const subjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        renderSubjects(subjects);
    }

    // Hàm lưu danh sách bài học vào localStorage
    function saveSubjects(subjects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    }

    // Hàm render danh sách bài học với phân trang và tìm kiếm
    function renderSubjects(subjects) {
        const searchTerm = inputSearch ? inputSearch.value.trim().toLowerCase() : '';
        let filteredSubjects = subjects;

        // Lọc theo tên bài học nếu có từ khóa tìm kiếm
        if (searchTerm) {
            filteredSubjects = subjects.filter(subject => 
                subject.name.toLowerCase().includes(searchTerm)
            );
        }

        const totalItems = filteredSubjects.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedSubjects = filteredSubjects.slice(start, end);

        categoryTableBody.innerHTML = '';
        paginatedSubjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="subjectCheckbox"></td>
                <td>${subject.name}</td>
                <td>${subject.subjectName}</td>
                <td>${subject.time}</td>
                <td>
                    <div class="status ${subject.status === 'Đã hoàn thành' ? 'status-active' : 'status-inactive'}">
                        <div class="dot ${subject.status === 'Đã hoàn thành' ? 'active' : 'inactive'}"></div>
                        <span>${subject.status}</span>
                    </div>
                </td>
                <td>
                    <img class="trash" src="/assets/icons/trash.png" alt="">
                    <img class="pen" src="/assets/icons/pen.png" alt="">
                </td>
            `;
            categoryTableBody.appendChild(row);
        });
        attachEventListeners();
        updatePagination(totalPages);
    }

    // Hàm cập nhật phân trang
    function updatePagination(totalPages) {
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.className = 'page-btn' + (i === currentPage ? ' active' : '');
                button.textContent = i;
                button.addEventListener('click', () => {
                    currentPage = i;
                    renderSubjects(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
                });
                pageNumbers.appendChild(button);
            }
        }

        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;

            prevBtn.removeEventListener('click', prevHandler);
            nextBtn.removeEventListener('click', nextHandler);

            prevBtn.addEventListener('click', prevHandler);
            nextBtn.addEventListener('click', nextHandler);
        }
    }

    function prevHandler() {
        if (currentPage > 1) {
            currentPage--;
            renderSubjects(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
        }
    }

    function nextHandler() {
        const subjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const totalPages = Math.ceil(subjects.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderSubjects(subjects);
        }
    }

    // Gắn sự kiện cho các nút pen và trash
    function attachEventListeners() {
        document.querySelectorAll('.pen').forEach(pen => {
            pen.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                showEditForm(row);
            });
        });

        document.querySelectorAll('.trash').forEach(trash => {
            trash.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                showDeleteModal(row);
            });
        });
    }

    // Hiển thị form cập nhật khi click bút chì
    function showEditForm(row) {
        currentRow = row;
        const name = row.cells[1].textContent;
        const subjectName = row.cells[2].textContent;
        const time = row.cells[3].textContent;
        const status = row.cells[4].querySelector('span').textContent;

        document.getElementById('categoryName').value = name;
        document.getElementById('subjectName').value = subjectName;
        document.getElementById('timeEdit').value = time;
        if (status === 'Đã hoàn thành') {
            document.getElementById('activeEdit').checked = true;
        } else {
            document.getElementById('inactiveEdit').checked = true;
        }

        formCategory.style.display = 'flex';
        formCategory.querySelector('h3').textContent = 'Cập nhật bài học';

        // Ẩn các thông báo lỗi khi mở form
        document.getElementById('nameError').style.display = 'none';
        document.getElementById('duplicateError').style.display = 'none';
        document.getElementById('subjectError').style.display = 'none';
        document.getElementById('timeError').style.display = 'none';
    }

    // Hiển thị modal xóa
    function showDeleteModal(row) {
        currentRow = row;
        const subjectName = row.cells[1].textContent;
        deleteSubjectName.textContent = subjectName;
        deleteModal.style.display = 'flex';
    }

    // Xử lý thêm mới/cập nhật bài học với validate bằng chữ đỏ
    btnAddFormCategory.addEventListener('click', () => {
        const name = document.getElementById('categoryName').value.trim();
        const subjectName = document.getElementById('subjectName').value.trim();
        const time = parseInt(document.getElementById('timeEdit').value.trim(), 10);
        const status = document.getElementById('activeEdit').checked ? 'Đã hoàn thành' : 'Chưa hoàn thành';

        // Ẩn tất cả thông báo lỗi trước khi kiểm tra
        document.getElementById('nameError').style.display = 'none';
        document.getElementById('duplicateError').style.display = 'none';
        document.getElementById('subjectError').style.display = 'none';
        document.getElementById('timeError').style.display = 'none';

        let hasError = false;

        // Validate Tên bài học không được để trống
        if (!name) {
            document.getElementById('nameError').style.display = 'block';
            hasError = true;
        }

        // Validate Tên bài học không được trùng
        const subjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        let isDuplicate = false;
        if (currentRow) {
            const currentIndex = Array.from(categoryTableBody.children).indexOf(currentRow);
            isDuplicate = subjects.some((subject, index) => 
                subject.name.toLowerCase() === name.toLowerCase() && index !== currentIndex
            );
        } else {
            isDuplicate = subjects.some(subject => 
                subject.name.toLowerCase() === name.toLowerCase()
            );
        }
        if (isDuplicate) {
            document.getElementById('duplicateError').style.display = 'block';
            hasError = true;
        }

        // Validate Tên môn học không được để trống
        if (!subjectName) {
            document.getElementById('subjectError').style.display = 'block';
            hasError = true;
        }

        // Validate Thời gian học phải lớn hơn 0
        if (!time || time <= 0) {
            document.getElementById('timeError').style.display = 'block';
            hasError = true;
        }

        if (hasError) return;

        // Nếu không có lỗi, tiếp tục xử lý
        if (currentRow) {
            const index = Array.from(categoryTableBody.children).indexOf(currentRow);
            subjects[index] = { name, subjectName, time, status };

            currentRow.cells[1].textContent = name;
            currentRow.cells[2].textContent = subjectName;
            currentRow.cells[3].textContent = time;
            const statusDiv = currentRow.cells[4].querySelector('.status');
            const dot = statusDiv.querySelector('.dot');
            statusDiv.querySelector('span').textContent = status;
            statusDiv.className = `status ${status === 'Đã hoàn thành' ? 'status-active' : 'status-inactive'}`;
            dot.className = `dot ${status === 'Đã hoàn thành' ? 'active' : 'inactive'}`;
            dot.style.backgroundColor = status === 'Đã hoàn thành' ? 'green' : 'red';

            Swal.fire({
                title: "Thành công",
                text: "Bạn đã cập nhật bài học thành công",
                icon: "success",
            }).then(() => {
                setTimeout(() => {}, 1000);
            });
        } else {
            subjects.push({ name, subjectName, time, status });
            saveSubjects(subjects);
            renderSubjects(subjects);

            const totalItems = subjects.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (totalItems > currentPage * itemsPerPage) {
                currentPage = totalPages;
                renderSubjects(subjects);
            }

            Swal.fire({
                title: "Thành công",
                text: "Bạn đã thêm mới bài học thành công",
                icon: "success",
            }).then(() => {
                setTimeout(() => {}, 1000);
            });
        }

        saveSubjects(subjects);
        formCategory.style.display = 'none';
        document.getElementById('categoryName').value = '';
        document.getElementById('subjectName').value = '';
        document.getElementById('timeEdit').value = '';
        document.getElementById('activeEdit').checked = false;
        document.getElementById('inactiveEdit').checked = false;
        currentRow = null;
    });

    // Xử lý thêm mới bài học
    buttonAddCategory.addEventListener('click', () => {
        formCategory.style.display = 'flex';
        formCategory.querySelector('h3').textContent = 'Thêm mới bài học';
        document.getElementById('categoryName').value = '';
        document.getElementById('subjectName').value = '';
        document.getElementById('timeEdit').value = '';
        document.getElementById('activeEdit').checked = false;
        document.getElementById('inactiveEdit').checked = false;
        currentRow = null;

        // Ẩn các thông báo lỗi khi mở form
        document.getElementById('nameError').style.display = 'none';
        document.getElementById('duplicateError').style.display = 'none';
        document.getElementById('subjectError').style.display = 'none';
        document.getElementById('timeError').style.display = 'none';
    });

    // Đóng form
    [iconCloseFormCategory, btnCloseFormCategory].forEach(btn => {
        btn.addEventListener('click', () => {
            formCategory.style.display = 'none';
            currentRow = null;
        });
    });

    // Xử lý xóa bài học
    confirmDeleteButton.addEventListener('click', () => {
        if (currentRow) {
            const subjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const index = Array.from(categoryTableBody.children).indexOf(currentRow);
            subjects.splice(index, 1);
            saveSubjects(subjects);
            renderSubjects(subjects);
            deleteModal.style.display = 'none';
            currentRow = null;

            Swal.fire({
                title: "Thành công",
                text: "Bạn đã xóa bài học thành công",
                icon: "success",
            }).then(() => {
                setTimeout(() => {}, 1000);
            });
        }
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        currentRow = null;
    });

    document.addEventListener('click', (e) => {
        if (deleteModal.style.display === 'flex' && !deleteModal.contains(e.target) && !e.target.classList.contains('trash')) {
            deleteModal.style.display = 'none';
            currentRow = null;
        }
    });

    // Đăng xuất
    const avatar = document.querySelector('.img-4');
    const logoutModal = document.getElementById('logoutModal');
    const logoutButton = document.getElementById('logoutButton');

    avatar.addEventListener('click', () => {
        logoutModal.style.display = 'flex';
    });

    logoutButton.addEventListener('click', () => {
        const isConfirmed = confirm('Bạn có chắc chắn muốn đăng xuất?');
        if (isConfirmed) {
            Swal.fire({
                title: 'Thành công',
                text: 'Bạn đã đăng xuất thành công',
                icon: 'success'
            }).then(() => {
                setTimeout(() => {
                    window.location.href = '/pages/login.html';
                }, 1500);
            });
            logoutModal.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!logoutModal.contains(event.target) && event.target !== avatar) {
            logoutModal.style.display = 'none';
        }
    });

    // Thêm sự kiện tìm kiếm
    if (inputSearch) {
        inputSearch.addEventListener('input', () => {
            currentPage = 1; // Reset về trang 1 khi tìm kiếm
            renderSubjects(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
        });

        inputSearch.addEventListener('blur', () => {
            if (!inputSearch.value.trim()) {
                currentPage = 1;
                renderSubjects(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
            }
        });
    }

    // Tải danh sách khi trang mở
    loadSubjects();
});