/**
 * Estado de pestaña (tema + mock) sin localStorage.
 * - sessionStorage: misma pestaña en http(s) y a veces en file://.
 * - window.name (JSON bajo prefijo b360tab:): misma pestaña al cambiar de .html con file://.
 * Lectura: bundle en name → session; escritura: siempre actualiza ambos para no pisar tema/mock.
 */
(function (global) {
    var THEME_KEY = 'temaPreferido';
    var MOCK_KEY = 'banca360_mock';
    var TAB_PREFIX = 'b360tab:';

    function readBundleFromName() {
        try {
            var n = global.name || '';
            if (n.indexOf(TAB_PREFIX) !== 0) return null;
            var o = JSON.parse(decodeURIComponent(n.slice(TAB_PREFIX.length)));
            return o && typeof o === 'object' ? o : null;
        } catch (e) {
            return null;
        }
    }

    function writeBundleToName(bundle) {
        try {
            global.name = TAB_PREFIX + encodeURIComponent(JSON.stringify(bundle));
        } catch (e) { /* */ }
    }

    function mergeIntoName(partial) {
        var cur = readBundleFromName() || {};
        Object.keys(partial).forEach(function (k) {
            cur[k] = partial[k];
        });
        writeBundleToName(cur);
    }

    function readTheme() {
        var b = readBundleFromName();
        if (b && (b.theme === 'dark' || b.theme === 'light')) return b.theme;
        try {
            var s = global.sessionStorage.getItem(THEME_KEY);
            if (s === 'dark' || s === 'light') return s;
        } catch (e) { /* */ }
        return null;
    }

    function writeTheme(next) {
        if (next !== 'dark' && next !== 'light') return;
        try {
            global.sessionStorage.setItem(THEME_KEY, next);
        } catch (e) { /* */ }
        mergeIntoName({ theme: next });
    }

    function readMockJson() {
        try {
            var raw = global.sessionStorage.getItem(MOCK_KEY);
            if (raw) return raw;
        } catch (e) { /* */ }
        var b = readBundleFromName();
        if (b && b.mockJson && typeof b.mockJson === 'string') return b.mockJson;
        return null;
    }

    function writeMockJson(jsonString) {
        try {
            global.sessionStorage.setItem(MOCK_KEY, jsonString);
        } catch (e) { /* */ }
        mergeIntoName({ mockJson: jsonString });
    }

    global.Banca360Theme = { read: readTheme, write: writeTheme };
    global.Banca360MockStore = { readJson: readMockJson, writeJson: writeMockJson };
})(typeof window !== 'undefined' ? window : this);
