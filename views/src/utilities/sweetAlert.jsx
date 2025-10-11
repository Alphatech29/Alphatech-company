import Swal from "sweetalert2";

const SweetAlert = {
  alert: (title, text, icon = "info", confirmText = "OK") => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: confirmText,
      timerProgressBar: false,
    });
  },

  confirm: (title, text, confirmText = "Yes", cancelText = "No") => {
    return Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
    }).then((result) => result.isConfirmed);
  },

  prompt: (title, text, confirmText = "Submit", cancelText = "Cancel") => {
    return Swal.fire({
      title,
      text,
      input: "text",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      inputValidator: (value) => (!value ? "You need to enter something!" : null),
    }).then((result) => (result.isConfirmed ? result.value : null));
  },
};

export default SweetAlert;
