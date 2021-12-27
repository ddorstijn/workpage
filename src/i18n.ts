import { addMessages, register, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from '../translations/en.json';
import nl from '../translations/nl.json';
import de from '../translations/de.json';

addMessages('en', en);
addMessages('nl', nl);
addMessages('de', de);

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});