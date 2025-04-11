document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.querySelector(".button");

  // Kiểm tra tồn tại của các phần tử
  if (!emailInput || !passwordInput || !loginBtn) {
    console.error("Một hoặc nhiều phần tử không được tìm thấy:", {
      emailInput,
      passwordInput,
      loginBtn,
    });
    return;
  }

  // Ánh xạ các thông báo lỗi vào <span class="error-message"> hiện có
  const emailGroup = emailInput.closest(".box-2.form-group");
  const passwordGroup = passwordInput.closest(".box-3.form-group");
  const errorMessages = {
    emailNone: emailGroup ? emailGroup.querySelector(".error-message") : null,
    emailInvalid: emailGroup
      ? emailGroup.querySelector(".error-message")
      : null,
    emailError: emailGroup ? emailGroup.querySelector(".error-message") : null,
    passwordNone: passwordGroup
      ? passwordGroup.querySelector(".error-message")
      : null,
    passwordError: passwordGroup
      ? passwordGroup.querySelector(".error-message")
      : null,
  };

  // Kiểm tra xem các thông báo lỗi có tồn tại không
  Object.values(errorMessages).forEach((msg, key) => {
    if (!msg)
      console.error(
        `Thông báo lỗi cho ${
          Object.keys(errorMessages)[key]
        } không được tìm thấy!`
      );
  });

  const hideAllErrors = () => {
    [emailGroup, passwordGroup].forEach((group) => {
      if (group) group.classList.remove("invalid");
    });
    Object.values(errorMessages).forEach((msg) => {
      if (msg) {
        msg.classList.add("hidden");
        msg.textContent = "";
      }
    });
    console.log("All errors hidden");
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const findUserByEmail = (email) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.find((user) => user.email === email);
  };

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    hideAllErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    // Kiểm tra email
    if (email === "") {
      if (errorMessages.emailNone) {
        errorMessages.emailNone.textContent = "Vui lòng nhập email";
        errorMessages.emailNone.classList.remove("hidden");
        emailGroup.classList.add("invalid");
      }
      isValid = false;
    } else if (!isValidEmail(email)) {
      if (errorMessages.emailInvalid) {
        errorMessages.emailInvalid.textContent = "Vui lòng nhập email hợp lệ";
        errorMessages.emailInvalid.classList.remove("hidden");
        emailGroup.classList.add("invalid");
      }
      isValid = false;
    }

    const user = findUserByEmail(email);

    // Kiểm tra người dùng tồn tại
    if (!user && email !== "") {
      if (errorMessages.emailError) {
        errorMessages.emailError.textContent = "Email không chính xác";
        errorMessages.emailError.classList.remove("hidden");
        emailGroup.classList.add("invalid");
      }
      isValid = false;
    }

    // Kiểm tra mật khẩu
    if (password === "") {
      if (errorMessages.passwordNone) {
        errorMessages.passwordNone.textContent = "Vui lòng nhập mật khẩu";
        errorMessages.passwordNone.classList.remove("hidden");
        passwordGroup.classList.add("invalid");
      }
      isValid = false;
    } else if (user && user.password !== password) {
      if (errorMessages.passwordError) {
        errorMessages.passwordError.textContent = "Mật khẩu không chính xác";
        errorMessages.passwordError.classList.remove("hidden");
        passwordGroup.classList.add("invalid");
      }
      isValid = false;
    }

    // Đăng nhập thành công
    if (isValid && user) {
      Swal.fire({
        title: "Thành công",
        text: "Bạn đã đăng nhập thành công",
        icon: "success",
      });
      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 1500);
    }

    console.log("Validation result:", { isValid, email, password, user });
  });
});
