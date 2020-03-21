$(() => {
    checkPageAccess()
        .then(access => {
            if (access) {
                appearBodySlowly();
                loadPageContent();
            }
        });
});

function loadPageContent() {
    initCalendar();
}

function initCalendar() {
    let calendar = new Calendar();
    const calendarControls = $('[data-toggle="calendar"]');

    const disableCalendarControls = () => calendarControls.attr('disabled', true);
    const enableCalendarControls = () => calendarControls.attr('disabled', false);

    calendarControls.click(function () {
        disableCalendarControls();
        const action = $(this).data('action');
        if (action) {
            calendar[action](enableCalendarControls);
        }
    });

    $(calendar.elem).on('wheel', event => {
        disableCalendarControls();
        setTimeout(() => {
            if (event.originalEvent.deltaY < 0) {
                calendar.next(enableCalendarControls);
            } else {
                calendar.prev(enableCalendarControls);
            }
        }, 100);
    });
}

function signOut() {
    fetch('/auth/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({accessToken: window.localStorage.getItem('accessToken')})
    }).then(response => {
        if (response.status === 400) {
            console.log(response.json());
        } else {
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('refreshToken');
            window.location.href = '/';
        }
    });
}
