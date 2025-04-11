// Lấy tất cả các phần tử cần thiết
const penIcons = document.querySelectorAll(".pen");
const formCategory = document.getElementById("formCategory");
const inputName = formCategory
  ? formCategory.querySelector('input[type="text"]')
  : null;
const radioActive = formCategory
  ? formCategory.querySelector('input[name="active"]:nth-child(1)')
  : null;
const radioInactive = formCategory
  ? formCategory.querySelector('input[name="active"]:nth-child(3)')
  : null;
const btnClose =
  document.getElementById("btnCloseFormCategory") ||
  document.getElementById("iconCloseFormCategory");
const btnAdd = document.getElementById("btnAddFormCategory");
const buttonAddCategory = document.getElementById("buttonAddCategory");
const categoryTableBody = document.querySelector(".category-table tbody");
const trashIcons = document.querySelectorAll(".trash");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const deleteSubjectName = document.getElementById("deleteSubjectName");
const inputSearch = document.querySelector(".input-search");
const filterSelect = document.querySelector(".select#filterSelect");
const sortSelect = document.querySelector(".select#sortSelect");
const pagination = document.querySelector(".pagination");
const pageNumbers = document.getElementById("pageNumbers");
const prevBtn = pagination ? pagination.querySelector(".prev") : null;
const nextBtn = pagination ? pagination.querySelector(".next") : null;
const successModal = document.getElementById("successModal");
const closeSuccessBtn = document.querySelector("#successModal .closeBtn");

let currentRow = null;
const STORAGE_KEY = "categories";
let currentPage = 1;
const itemsPerPage = 7; // Giữ nguyên 7 mục mỗi trang

// Hàm để tải danh sách môn học từ localStorage
function loadCategories() {
  let categories = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // Đảm bảo tất cả mục có thời gian tạo
  categories = categories.map((category) => ({
    ...category,
    createdAt: category.createdAt || new Date().toISOString(),
  }));
  saveCategories(categories);
  renderCategories(categories);
}

// Hàm để lưu danh sách môn học vào localStorage
function saveCategories(categories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

// Hàm để render danh sách môn học với phân trang và sắp xếp
function renderCategories(categories) {
  let filteredCategories = [...categories];

  // Áp dụng lọc
  const filterStatus = filterSelect ? filterSelect.value : "";
  if (filterStatus) {
    filteredCategories = filteredCategories.filter(
      (category) => category.status === filterStatus
    );
  }

  // Áp dụng sắp xếp dựa trên lựa chọn từ dropdown
  const sortBy = sortSelect ? sortSelect.value : "nameAsc";
  filteredCategories.sort((a, b) => {
    if (sortBy === "nameAsc") {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    } else if (sortBy === "nameDesc") {
      return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
    } else if (sortBy === "dateAsc") {
      return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
    } else if (sortBy === "dateDesc") {
      return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1;
    }
    return 0; // Default case
  });

  // Phân trang
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(start, end);

  // Render danh sách (không hiển thị createdAt)
  if (categoryTableBody) {
    categoryTableBody.innerHTML = "";
    paginatedCategories.forEach((category) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${category.name}</td>
                <td>
                    <div class="status ${
                      category.status === "Đang hoạt động"
                        ? "status-active"
                        : "status-inactive"
                    }">
                        <div class="dot ${
                          category.status === "Đang hoạt động"
                            ? "active"
                            : "inactive"
                        }"></div>
                        <span>${category.status}</span>
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
    updatePagination(totalPages, totalItems);
  }
}

// Cập nhật phân trang
function updatePagination(totalPages, totalItems) {
  if (pageNumbers) {
    pageNumbers.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.className = "page-btn" + (i === currentPage ? " active" : "");
      button.textContent = i;
      button.addEventListener("click", () => {
        currentPage = i;
        renderCategories(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
      });
      pageNumbers.appendChild(button);
    }
  }

  if (prevBtn && nextBtn) {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderCategories(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderCategories(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
      }
    });
  }
}

// Sắp xếp theo lựa chọn từ dropdown
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    currentPage = 1; // Reset về trang đầu khi sắp xếp
    renderCategories(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  });
}

// Lọc theo trạng thái
if (filterSelect) {
  filterSelect.addEventListener("change", (e) => {
    currentPage = 1; // Reset về trang đầu khi lọc
    renderCategories(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  });
}

// Tìm kiếm
if (inputSearch) {
  inputSearch.addEventListener("input", (e) => {
    searchCategories(e.target.value);
  });

  inputSearch.addEventListener("blur", () => {
    if (!inputSearch.value) {
      loadCategories();
    }
  });
}

function searchCategories(searchTerm) {
  const categories = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  currentPage = 1; // Reset về trang đầu khi tìm kiếm
  renderCategories(filteredCategories);
}

// Tải danh sách khi trang được tải
document.addEventListener("DOMContentLoaded", loadCategories);

// Hàm gắn sự kiện cho các nút pen và trash
function attachEventListeners() {
    if (categoryTableBody) {
      categoryTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("pen")) {
          const row = e.target.closest("tr");
          showEditForm(row);
        } else if (e.target.classList.contains("trash")) {
          const row = e.target.closest("tr");
          showDeleteModal(row);
        }
      });
    }
  }
  
  // Gọi hàm này một lần khi trang được tải
  document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    attachEventListeners(); // Chỉ cần gọi một lần
  });
// Hàm hiển thị form để cập nhật môn học
function showEditForm(row) {
  currentRow = row;
  const name = row.cells[0].textContent;
  const status = row.cells[1].querySelector("span").textContent;

  if (inputName && radioActive && radioInactive) {
    inputName.value = name;
    if (status === "Đang hoạt động") {
      radioActive.checked = true;
    } else {
      radioInactive.checked = true;
    }

    if (formCategory) {
      formCategory.style.display = "block";
      formCategory.querySelector("h3").textContent = "Cập nhật môn học";
    }
  }
}

function showDeleteModal(row) {
  currentRow = row;
  const categoryName = row.cells[0].textContent;
  deleteSubjectName.textContent = categoryName;
  deleteModal.style.display = "flex";
}

// Xử lý khi nhấn nút "Hủy" hoặc nút đóng form
if (btnClose && formCategory) {
  [btnClose, document.getElementById("iconCloseFormCategory")].forEach(
    (closeBtn) => {
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          formCategory.style.display = "none";
          formCategory.querySelector("h3").textContent = "Thêm mới môn học";
          if (inputName) inputName.value = "";
          if (radioActive) radioActive.checked = false;
          if (radioInactive) radioInactive.checked = false;
          currentRow = null;
        });
      }
    }
  );
}

btnAdd.addEventListener("click", () => {
    const newName = inputName.value.trim();
    const newStatus = radioActive.checked ? "Đang hoạt động" : "Ngừng hoạt động";
  
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  
    document.getElementById("nameError").style.display = "none";
    document.getElementById("duplicateError").style.display = "none";
  
    if (!newName) {
      document.getElementById("nameError").style.display = "block";
      return;
    }
  
    let isDuplicate = false;
    if (currentRow) {
      const currentIndex = Array.from(categoryTableBody.children).indexOf(currentRow);
      const currentName = categories[currentIndex].name.toLowerCase();
      isDuplicate = categories.some(
        (category, index) =>
          category.name.toLowerCase() === newName.toLowerCase() &&
          index !== currentIndex
      );
    } else {
      isDuplicate = categories.some(
        (category) => category.name.toLowerCase() === newName.toLowerCase()
      );
    }
  
    if (isDuplicate) {
      document.getElementById("duplicateError").style.display = "block";
      return;
    }
  
    if (currentRow) {
      const index = Array.from(categoryTableBody.children).indexOf(currentRow);
      let categories = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  
      categories[index] = { name: newName, status: newStatus, createdAt: categories[index].createdAt || new Date().toISOString() };
  
      saveCategories(categories);
  
      currentRow.cells[0].textContent = newName;
      const statusDiv = currentRow.cells[1].querySelector(".status");
      statusDiv.querySelector("span").textContent = newStatus;
      statusDiv.className = `status ${newStatus === "Đang hoạt động" ? "status-active" : "status-inactive"}`;
      statusDiv.querySelector(".dot").className = `dot ${newStatus === "Đang hoạt động" ? "active" : "inactive"}`;
  
      if (formCategory) {
        formCategory.classList.remove("show");
        formCategory.querySelector("h3").textContent = "Thêm mới môn học";
      }
  
      if (inputName) inputName.value = "";
      if (radioActive) radioActive.checked = false;
      if (radioInactive) radioInactive.checked = false;
      currentRow = null;
  
      Swal.fire({
        title: "Thành công",
        text: "Bạn đã cập nhật môn học thành công",
        icon: "success",
      }).then(() => {
        setTimeout(() => {}, 1000);
      });
  
      attachEventListeners();
    } else {
      categories.push({ name: newName, status: newStatus });
      saveCategories(categories);
  
      renderCategories(categories);
  
      const totalItems = categories.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
  
      if (totalItems > currentPage * itemsPerPage) {
        currentPage++;
        renderCategories(categories);
      }
  
      if (formCategory) {
        formCategory.classList.remove("show");
        formCategory.querySelector("h3").textContent = "Thêm mới môn học";
      }

    formCategory.style.display = "none";

  
      if (inputName) inputName.value = "";
      if (radioActive) radioActive.checked = false;
      if (radioInactive) radioInactive.checked = false;
      currentRow = null;
  
      Swal.fire({
        title: "Thành công",
        text: "Bạn đã thêm mới môn thành công",
        icon: "success",
      }).then(() => {
        setTimeout(() => {}, 1000);
      });
    }
  });

// Xử lý nút "Thêm mới môn học"
if (buttonAddCategory && formCategory) {
  buttonAddCategory.addEventListener("click", () => {
    formCategory.style.display = "block";
    formCategory.querySelector("h3").textContent = "Thêm mới môn học";
    if (inputName) inputName.value = "";
    if (radioActive) radioActive.checked = false;
    if (radioInactive) radioInactive.checked = false;
    currentRow = null;
  });
}

// Xử lý xác nhận xóa (cập nhật để hiển thị successModal)
confirmDeleteButton.addEventListener("click", () => {
  if (currentRow) {
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const index = Array.from(categoryTableBody.children).indexOf(currentRow);
    categories.splice(index, 1);
    saveCategories(categories);
    currentRow.remove();
    deleteModal.style.display = "none";
    currentRow = null;

    // Hiển thị modal thành công
    successModal.style.display = "block";

    // Ẩn modal thành công sau 1 giây (tùy chỉnh)
    setTimeout(() => {
      successModal.style.display = "none";
    }, 1500);
  }
});

// Xử lý đóng modal thành công
closeSuccessBtn.addEventListener("click", () => {
  successModal.style.display = "none";
});

// Đóng modal thành công khi nhấp ra ngoài
document.addEventListener("click", (e) => {
  if (
    successModal.style.display === "flex" &&
    !successModal.contains(e.target)
  ) {
    successModal.style.display = "none";
  }
});

// Xử lý hủy xóa
if (cancelDeleteButton && deleteModal) {
  cancelDeleteButton.addEventListener("click", () => {
    deleteModal.style.display = "none";
    currentRow = null;
  });
}

document.addEventListener("click", (e) => {
  if (
    deleteModal &&
    deleteModal.style.display === "flex" &&
    !deleteModal.contains(e.target) &&
    !e.target.classList.contains("trash")
  ) {
    deleteModal.style.display = "none";
    currentRow = null;
  }
});

// Đăng xuất (giữ nguyên)
document.addEventListener("DOMContentLoaded", function () {
  const avatar = document.querySelector(".img-4");
  const logoutModal = document.getElementById("logoutModal");
  const logoutButton = document.getElementById("logoutButton");

  if (avatar && logoutModal && logoutButton) {
    avatar.addEventListener("click", function () {
      logoutModal.style.display = "flex";
    });

    logoutButton.addEventListener("click", function () {
      Swal.fire({
        title: "Thành công",
        text: "Bạn đã đăng xuất thành công",
        icon: "success",
      });
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1500);

      window.location.href = "/pages/login.html";
      logoutModal.style.display = "none";
    });

    document.addEventListener("click", function (event) {
      if (!logoutModal.contains(event.target) && event.target !== avatar) {
        logoutModal.style.display = "none";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.getElementById("logoutLink");
  const logoutModal = document.getElementById("logoutModal");
  const confirmLogout = document.getElementById("confirmLogout");
  const cancelLogout = document.getElementById("cancelLogout");

  // Kiểm tra tồn tại của các phần tử
  if (!logoutLink || !logoutModal || !confirmLogout || !cancelLogout) {
    console.error("Một hoặc nhiều phần tử không được tìm thấy!");
    return;
  }

  // Xử lý khi nhấp vào "Đăng xuất" trong dropdown
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
    e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
    // Ẩn dropdown sau khi chọn
    const dropdown = bootstrap.Dropdown.getInstance(
      document.getElementById("avatarDropdown")
    );
    if (dropdown) {
      dropdown.hide();
    }
    // Hiển thị modal đăng xuất
    logoutModal.style.display = "block";
  });

  // Xử lý nút Đăng xuất trong modal
  confirmLogout.addEventListener("click", function (e) {
    e.stopPropagation();

    Swal.fire({
      title: "Thành công",
      text: "Bạn đã đăng xuất thành công",
      icon: "success",
    }).then(() => {
      setTimeout(() => {
        window.location.href = "./login.html"; // Điều chỉnh đường dẫn nếu cần
      }, 1500);
    });
    logoutModal.style.display = "none";
  });

  // Xử lý nút Hủy trong modal
  cancelLogout.addEventListener("click", function (e) {
    e.stopPropagation();
    logoutModal.style.display = "none";
  });

  // Đóng modal khi nhấp ra ngoài
  document.addEventListener("click", function (e) {
    if (
      logoutModal.style.display === "block" &&
      !logoutModal.contains(e.target)
    ) {
      logoutModal.style.display = "none";
    }
  });
});
