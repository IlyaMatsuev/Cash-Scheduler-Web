const asBoolean = value => value === 'true';

const getSetting = (name, settingsQueryData, asBool = true) => {
    if (settingsQueryData && settingsQueryData.settings) {
        const setting = settingsQueryData.settings.find(s => s.setting.name === name)?.value;
        return asBool ? asBoolean(setting) : setting;
    }
};

export {getSetting, asBoolean}
