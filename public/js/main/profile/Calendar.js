class Calendar {

    constructor() {
        this.elem = $('.calendar')[0];
        this.today(() => {});
    }

    render() {
        if (this.view) {
            $(this.view).html('');
        }
        this.view = document.createElement('div');
        this.view.className = 'calendar-view';
        this.elem.appendChild(this.view);

        let calendarTable = document.createElement('table');
        let calendarTableBody = document.createElement('tbody');

        calendarTable.className = 'table table-bordered';
        calendarTable.appendChild(calendarTableBody);

        let todayDate = moment();
        let countingDate = this.date.clone().startOf('month').startOf('week');
        let activeMonth = this.date.clone().month();

        for (let week = 0; week < 6; week++) {
            let calendarRow = document.createElement('tr');
            calendarRow.className = 'calendar-month-row';
            for (let day = 0; day < 7; day++) {
                let calendarDay = document.createElement('td');
                calendarDay.appendChild(document.createTextNode(countingDate.format('D')));
                if (activeMonth !== countingDate.month()) {
                    calendarDay.className = 'calendar-prior-months-date';
                }
                if (todayDate.isSame(countingDate, 'day')) {
                    calendarDay.classList.add('calendar-today');
                }
                calendarRow.appendChild(calendarDay);
                countingDate.add(1, 'day');
            }
            calendarTableBody.appendChild(calendarRow);
        }

        this.view.appendChild(calendarTable);
        $('.calendar-current-date').html(this.date.format('MMMM, YYYY'));
    }

    next(callback) {
        this.date.endOf('month').add(1, 'day');
        this.render();
        callback();
    }

    prev(callback) {
        this.date.startOf('month').subtract(1, 'day');
        this.render();
        callback();
    }

    today(callback) {
        if (this.date && this.date.isSame(moment(), 'month')) {
            callback();
            return;
        }
        this.date = moment();
        this.render();
        callback();
    }
}

let calendar;

function initCalendar() {
    calendar = new Calendar();
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
