module.exports = {
    setEvents: () => {

        $('form').submit((e) => {
            e.preventDefault();
        });
    }
};