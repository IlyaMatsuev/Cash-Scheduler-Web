
class SettingsList {
    constructor() {
        this.settingsListContainer = $('.settings-container');
        this.settingsEditSection = this.settingsListContainer.find('.settings-editor');
        this.currentUnit = 'settings-general';
        this.render(this.currentUnit);
    }

    render(unitName) {
        return this.loadUnit(unitName)
            .then(() => {
                const userSettings = this.settings;
                const settingsInputs = this.settingsEditSection.find('input');

                settingsInputs.each(function () {
                    const settingItemName = $(this).attr('id');
                    const userSettingItem = userSettings.find(item => item.name === settingItemName);
                    if (userSettingItem) {
                        if ($(this).attr('type') === 'checkbox') {
                            $(this).attr('checked', userSettingItem.value === 'true');
                        } else {
                            $(this).val(userSettingItem.value);
                        }
                    }
                    $(this).change(settingChanged);
                });
            });
    }

    loadUnit(unitName) {
        this.clearSettingsEditSection();
        this.currentUnit = unitName;
        return this.getSettingsForUnit(unitName)
            .then(() => loadTemplate(unitName, '.settings-editor'))
            .then(() => this.currentUnit = unitName);
    }

    getSettingsForUnit(unitName) {
        return graphql(
            'getUserSettings',
            `query{getUserSettings(unitName: "${unitName}"){id, name, value, unit_name}}`
        ).then(settings => this.settings = settings);
    }

    clearSettingsEditSection() {
        this.settingsEditSection.empty();
    }
}

const applySettingsHandlers = {
    'display-balance-enabled': changeBalanceVisibility,
    'notification-sound-enabled': turnNotificationSound
};
let settingsList;

function initSettingList() {
    settingsList = new SettingsList();
    bindSettingListHandlers();
}

function bindSettingListHandlers() {
    const settingUnits = $('.settings-units-list > .setting-unit');

    settingUnits.click(function () {
        const selectedUnit = $(this).data('action');

        if (selectedUnit === settingsList.currentUnit) {
            return;
        }
        fadeSpinnerIn()
            .then(() => settingsList.render(selectedUnit))
            .then(() => {
                settingUnits.removeClass('active');
                $(this).addClass('active');
            }).then(fadeSpinnerOut);
    });
}

function settingChanged() {
    const settingName = $(this).attr('id');
    const settingUnitName = settingsList.currentUnit;
    let newSettingValue;
    if ($(this).attr('type') === 'checkbox') {
        newSettingValue = $(this).is(':checked');
    } else {
        newSettingValue = $(this).val();
    }

    fadeSpinnerIn()
        .then(() => updateUserSetting(settingName, newSettingValue, settingUnitName))
        .then(() => {
            if (applySettingsHandlers[settingName]) {
                applySettingsHandlers[settingName](newSettingValue);
            }
        })
        .then(fadeSpinnerOut);
}


function updateUserSetting(settingName, value, unitName) {
    return graphql(
        'updateUserSetting',
        `mutation{updateUserSetting(setting: {name: "${settingName}", value: "${value}", unit_name: "${unitName}"}) {id, name, value, unit_name}}`
    );
}


async function changeBalanceVisibility(value) {
    const balanceHeader = $('nav > .user-balance');
    if (value) {
        const user = await getUser();
        const currencySign = '$';
        balanceHeader.text(`${currencySign} ${user.balance}`);
        appearElementSlowly('nav > .user-balance');
    } else {
        disappearElementSlowly('nav > .user-balance');
    }
}

async function turnNotificationSound(value) {
    const playSoundButton = $('.play-new-notification-sound');
    if (value) {
        playSoundButton.removeClass('off');
    } else {
        playSoundButton.addClass('off');
    }
}
