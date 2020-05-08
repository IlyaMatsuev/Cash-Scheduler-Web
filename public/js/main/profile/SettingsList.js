
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
                        switch ($(this).attr('type')) {
                            case 'checkbox':
                                $(this).attr('checked', userSettingItem.value === 'true');
                                break;
                            case 'text':
                                $(this).val(userSettingItem.value);
                                break;
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
    switch ($(this).attr('type')) {
        case 'checkbox':
            newSettingValue = $(this).is(':checked');
            break;
        case 'text':
            newSettingValue = $(this).val();
            break;
        default:
            newSettingValue = $(this).val();
            break;
    }
    fadeSpinnerIn()
        .then(() => graphql(
            'updateUserSetting',
            `mutation{updateUserSetting(setting: {name: "${settingName}", value: "${newSettingValue}", unit_name: "${settingUnitName}"}) {id, name, value, unit_name}}`
        )).then(fadeSpinnerOut);
}

