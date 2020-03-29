class MessageList {
    constructor(notifications) {
        this.messageList = $('.messages-list')[0];
        this.notificationPerPage = 8;
        this.pagesCount = Math.ceil(notifications.length / 8);
        this.currentPage = 1;
        this.notifications = notifications;
        this.notificationPanelCollapsed = true;
        this.render(this.currentPage);
    }

    render(pageNumber) {
        $('.message-list-wrapper').remove();
        const messageListWrapper = $('<ul class="message-list-wrapper"></ul>');
        this.renderPaginationBarPages(this.notifications.length);

        if (this.notifications.length === 0) {
            const emptyMessageContainer = $('<div class="empty-message-container"></div>');
            messageListWrapper.append(emptyMessageContainer);
        } else {
            const messagesOffset = this.notificationPerPage * (pageNumber - 1);
            const pageNotifications = this.notifications.slice(messagesOffset, messagesOffset + this.notificationPerPage);
            pageNotifications.forEach(notification => {
                const escapeHtmlPattern = /<[^>]+>/g;
                const messageEntry = $(`<li data-id="${notification.id}"></li>`);
                messageEntry.bind('click', event => this.expandNotification(event));

                const messageTitleDiv = $(`<div class="message-title">${notification.title.replace(escapeHtmlPattern, '')}</div>`);
                const messageContentDiv = $(`<div class="message-content">${notification.content.replace(escapeHtmlPattern, '')}</div>`);

                messageEntry.append(messageTitleDiv, messageContentDiv);
                messageListWrapper.append(messageEntry);
            });
        }

        $(this.messageList).append(messageListWrapper);
    }

    renderPaginationBarPages(notificationLength) {
        const paginationBarWrapper = $('.messages-filter-bar .pagination');

        if (notificationLength <= this.notificationPerPage) {
            return;
        }
        if (paginationBarWrapper[0].hasChildNodes()) {
            return;
        }
        const prevPageButton = $('<li class="page-item control" data-action="prev" style="visibility: hidden"><a class="page-link">&#60;</a></li>');
        const nextPageButton = $('<li class="page-item control" data-action="next"><a class="page-link">&#62;</a></li>');

        const paginationControls = [prevPageButton];
        for (let i = 1; i <= this.pagesCount; i++) {
            const pageButton = $(`<li class="page-item" data-action="page"><a class="page-link">${i}</a></li>`);
            if (i === this.currentPage) {
                pageButton.addClass('active');
            }
            paginationControls.push(pageButton);
        }
        paginationControls.push(nextPageButton);
        paginationBarWrapper.append(...paginationControls);
    }

    page(pageNumber) {
        if (this.currentPage === pageNumber) {
            return;
        }
        this.collapseNotification();
        this.render(this.currentPage = pageNumber);
        this.toggleChevrons();
    }

    next() {
        this.collapseNotification();
        this.render(++this.currentPage);
        this.toggleChevrons();
    }

    prev() {
        this.collapseNotification();
        this.render(--this.currentPage);
        this.toggleChevrons();
    }

    async toggleChevrons() {
        const prevButton = $('.pagination .page-item[data-action="prev"]');
        const nextButton = $('.pagination .page-item[data-action="next"]');

        if (this.currentPage === this.pagesCount) {
            nextButton.css('visibility', 'hidden');
            prevButton.css('visibility', 'visible');
        } else if (this.currentPage === 1) {
            prevButton.css('visibility', 'hidden');
            nextButton.css('visibility', 'visible');
        } else {
            nextButton.css('visibility', 'visible');
            prevButton.css('visibility', 'visible');
        }
    }

    async expandNotification(event) {
        const notificationId = Number($(event.currentTarget).data('id'));
        const messageContainer = $('.message-container');
        if (this.selectedNotificationId === notificationId) {
            return;
        }
        if (this.notificationPanelCollapsed) {
            messageContainer.show();
        }

        this.unselectNotification();
        this.selectNotification(event.currentTarget);

        this.notificationPanelCollapsed = false;
        this.selectedNotificationId = notificationId;
        const targetNotification = this.notifications.find(notification => notification.id === notificationId);

        messageContainer.animate({left: '35%'}, 100).promise().then(() => {
            const notificationWrapper = $('.message-container .message-wrapper');
            notificationWrapper.find('.title').html(`<h3>${targetNotification.title}</h3>`);
            notificationWrapper.find('.content').html(targetNotification.content);

            messageContainer.animate({left: 0, flex: 1}, 100);
        });
    }

    async collapseNotification() {
        this.notificationPanelCollapsed = true;
        this.unselectNotification();
        const messageContainer = $('.message-container');
        messageContainer.animate({left: '35%', flex: 0}, 100, () => messageContainer.hide());
    }

    selectNotification(target) {
        $(target).addClass('message-selected');
    }

    unselectNotification() {
        $('.messages-list .message-selected').removeClass('message-selected');
    }
}

let messagesList;

function initMessageList(notifications) {
    messagesList = new MessageList([
        {
            id: 0,
            title: 'Important Title!!!Important Title!!!Important Title!!!Important Title!!!Important Title!!!',
            content: 'Hello world'
        },
        {
            id: 1,
            title: 'Another Important Title!!!',
            content: '<h1>Hello world</h1>'
        },
        {
            id: 2,
            title: 'Important Title!!!Important Title!!!Important Title!!!Important Title!!!Important Title!!!',
            content: 'Hello world'
        },
        {
            id: 3,
            title: 'Another Important Title!!!',
            content: 'Hello world'
        },
        {
            id: 4,
            title: 'Important Title!!!Important Title!!!Important Title!!!Important Title!!!Important Title!!!',
            content: 'Hello world'
        },
        {
            id: 5,
            title: 'Another Important Title!!!',
            content: 'Hello world'
        },
        {
            id: 6,
            title: 'Important Title!!!Important Title!!!Important Title!!!Important Title!!!Important Title!!!',
            content: 'Hello world'
        },
        {
            id: 7,
            title: 'Another Important Title!!!',
            content: 'Hello world'
        },
        {
            id: 8,
            title: 'Important Title!!!Important Title!!!Important Title!!!Important Title!!!Important Title!!!',
            content: 'Hello world'
        },
        {
            id: 9,
            title: 'Another Important Title!!!',
            content: 'Hello world'
        }
    ]);

    const paginationControls = $('.pagination .page-item');

    paginationControls.click(function () {
        const activePageButton = $('.pagination .page-item.active').removeClass('active');
        const currentControlButton = $(this);
        let currentPageNumber;

        if (currentControlButton.hasClass('control')) {
            const newActivePageButton = activePageButton[currentControlButton.data('action')]().addClass('active');
            currentPageNumber = Number(newActivePageButton.text());
        } else {
            currentControlButton.addClass('active');
            currentPageNumber = Number(currentControlButton.text());
        }

        const action = currentControlButton.data('action');
        if (action) {
            messagesList[action](currentPageNumber);
        }
    });
}
