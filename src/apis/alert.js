import Swal from 'sweetalert2';

export const alert = (title, text, icon, callback) => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: '확인',
  }).then(callback);
};

export const confirm = (title, text, icon, callback) => {
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소',
  }).then(callback);
}; 