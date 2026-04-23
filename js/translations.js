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
        
        // Update Hero
        const heroSubtitle = document.querySelector('section p');
        if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
        
        const heroTitle = document.querySelector('section h2');
        if (heroTitle) heroTitle.textContent = t.heroTitle;
        
        // Update Bottom Nav
        const navItems = document.querySelectorAll('nav div span');
        if (navItems.length >= 3) {
            navItems[0].textContent = t.menuTab;
            navItems[1].textContent = t.favoritesTab;
            navItems[2].textContent = t.historyTab;
        }
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
            btn.classList.add('bg-brand-primary', 'text-white');
            btn.classList.remove('bg-gray-100', 'text-gray-600');
        } else {
            btn.classList.add('bg-gray-100', 'text-gray-600');
            btn.classList.remove('bg-brand-primary', 'text-white');
        }
    }
}

export const translator = new TranslationManager();
