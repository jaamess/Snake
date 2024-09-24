// Language Detection and Translation Logic
document.addEventListener('DOMContentLoaded', function () {
    const userLang = navigator.language || navigator.userLanguage;
    const language = userLang.split('-')[0];
    let selectedLang = language in strings ? language : 'en';

    const dropdownContent = document.getElementById('dropdown-content');
    Object.keys(strings).forEach(langCode => {
        const langOption = document.createElement('a');
        langOption.href = '#';
        langOption.setAttribute('data-lang', langCode);
        langOption.textContent = getLanguageName(langCode);
        dropdownContent.appendChild(langOption);
    });

    function getLanguageName(langCode) {
        const languageNames = {
            en: 'English',
            es: 'Español',
            pt: 'Português',
            fr: 'Français',
            de: 'Deutsch',
            it: 'Italiano',
            nl: 'Nederlands',
            ru: 'Русский',
            tr: 'Türkçe',
            zh: '中文',
            ja: '日本語',
            ko: '한국어',
            ar: 'العربية',
            hi: 'हिन्दी',
            bn: 'বাংলা',
            ur: 'اردو',
            fa: 'فارسی',
            he: 'עברית',
            el: 'Ελληνικά',
            hu: 'Magyar',
            cs: 'Čeština',
            pl: 'Polski',
            ca: 'Català',
            sv: 'Svenska',
            upsideDownEnglish: 'ǝuƃlᴉsuƎ uʍop',
        };
        return languageNames[langCode] || langCode;
    }

    function translatePage(lang) {
        document.getElementById('instruction-text').textContent = strings[lang].selectGameMode;
        document.getElementById('classic-mode-btn').textContent = strings[lang].classicMode;
        document.getElementById('custom-mode-btn').textContent = strings[lang].doguiMode;
        document.getElementById('test-mode-btn').textContent = strings[lang].pro;

        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons[0].textContent = strings[lang].easy;
        difficultyButtons[1].textContent = strings[lang].medium;
        difficultyButtons[2].textContent = strings[lang].hard;
        difficultyButtons[3].textContent = strings[lang].insane;
        difficultyButtons[4].textContent = strings[lang].impossible;
    }

    translatePage(selectedLang);

    document.querySelectorAll('#dropdown-content a').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedLang = event.target.getAttribute('data-lang');
            translatePage(selectedLang);
        });
    })
});