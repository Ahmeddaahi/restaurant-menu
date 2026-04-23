/**
 * Jua Café - Translation Manager
 */

import { uiTranslations } from './data.js';

class TranslationManager {
    constructor() {
        this.currentLang = localStorage.getItem('selectedLang') || 'so';
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('selectedLang', lang);
    }

    getLanguage() {
        return this.currentLang;
    }

    translate(key) {
        return uiTranslations[this.currentLang][key] || key;
    }

    /**
     * Update static elements in the DOM
     */
    updateStaticText() {
        const t = uiTranslations[this.currentLang];
        
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
            const isActive = (btnLang) => this.currentLang === btnLang;
            
            this._toggleBtnStyle(soBtn, isActive('so'));
            this._toggleBtnStyle(enBtn, isActive('en'));
        }
    }

    _toggleBtnStyle(btn, active) {
        if (active) {
            btn.classList.add('bg-primary', 'text-white', 'shadow-sm');
            btn.classList.remove('text-gray-500');
        } else {
            btn.classList.add('text-gray-500');
            btn.classList.remove('bg-primary', 'text-white', 'shadow-sm');
        }
    }
}

export const translator = new TranslationManager();
