module.exports = {
    setEvents: () => {

        $('form').submit((e) => {
            e.preventDefault();
        });
    },

    showModal: (html) => {
        const dialog = document.querySelector('dialog');
        $('#modal').html(html);
        dialog.showModal();

    }
};