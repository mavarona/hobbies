import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const formsDelete = document.querySelectorAll('.eliminar-comentario');
    if (formsDelete.length > 0) {
        formsDelete.forEach(form => {
            form.addEventListener('submit', deleteComment);
        });
    }
});

function deleteComment(e) {
    e.preventDefault();

    Swal.fire({
        title: 'Eliminar Comentario',
        text: "Un comentario borrado no se puede recuperar",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {

            const commentId = this.children[0].value;

            const data = {
                commentId
            }

            axios.post(this.action, data)
                .then(response => {

                    Swal.fire(
                        'Eliminado',
                        response.data,
                        'success'
                    );

                    this.parentElement.parentElement.remove();

                }).catch(err => {
                    if (err.response.status === 403 || err.response.status === 404) {

                        Swal.fire(
                            'Error',
                            err.response.data,
                            'error'
                        );
                    }
                });

        }
    });

}