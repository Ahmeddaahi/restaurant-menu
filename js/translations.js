/**
 * Jua Café - Translation Manager
 */

import { uiTranslations } from './data.js';

class TranslationManager {
    constructor() {
        try {
            this.currentLang = localStorage.getItem('selectedLang') || 'so';
        } catch (e) {
            this.currentLang = 'so';
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

        // Update Page Title
        const menuTitle = document.querySelector('[data-translate="menuTab"]');
        if (menuTitle) menuTitle.textContent = t.menuTab;
    }

    /**
     * Update language switcher buttons in the DOM
     */
    updateLanguageButtons() {
        const soBtn = document.getElementById('lang-so');
        const enBtn = document.getElementById('lang-en');

        if (soBtn && enBtn) {
            const current = this.currentLang;

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
