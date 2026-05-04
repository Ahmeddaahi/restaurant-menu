/**
 * Jua Café - Translation Manager
 */

import { uiTranslations } from './data.js';

class TranslationManager {
    constructor() {
        try {
            this.currentLang = localStorage.getItem('selectedLang') || 'en';
        } catch (e) {
            this.currentLang = 'en';
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        try {
            localStorage.setItem('selectedLang', lang);
        } catch (e) { }
    }

    getLanguage() {
        return this.currentLang;
    }

    translate(key) {
        const langData = uiTranslations[this.currentLang];
        if (!langData) return key;
        return langData[key] || key;
    }

    /**
     * Update static elements in the DOM
     */
    updateStaticText() {
        const t = uiTranslations[this.currentLang];
        if (!t) return;

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (t[key]) {
                el.textContent = t[key];
            }
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (t[key]) {
                el.placeholder = t[key];
            }
        });
    }

    /**
     * Update language switcher buttons in the DOM
     */
    updateLanguageButtons() {
        const soBtn = document.getElementById('lang-so');
        const enBtn = document.getElementById('lang-en');
        const container = document.getElementById('lang-toggle-container');

        if (soBtn && enBtn && container) {
            const current = this.currentLang;
            container.setAttribute('data-lang', current);

            if (current === 'so') {
                soBtn.classList.add('active');
                enBtn.classList.remove('active');
            } else {
                enBtn.classList.add('active');
                soBtn.classList.remove('active');
            }
        }
    }
}

export const translator = new TranslationManager();
