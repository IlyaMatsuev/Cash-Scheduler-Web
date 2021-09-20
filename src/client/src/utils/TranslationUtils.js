import en from '../translations/en.json';
import ru from '../translations/ru.json';
import fr from '../translations/fr.json';
import ua from '../translations/ua.json';


const langs = {
    en,
    ru,
    fr,
    ua
};

export function get(label, group) {
    if (group) {
        return langs[getLang()][group][label] || en[group][label] || label;
    }
    return langs[getLang()][label] || en[label] || label;
}

export function setLang(lang) {
    if (langs[lang]) {
        document.documentElement.lang = lang;
    }
}

export function getLang() {
    return document.documentElement.lang;
}
