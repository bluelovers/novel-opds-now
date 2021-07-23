"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterOPDSBook = exports.addOpenSearch = void 0;
const tslib_1 = require("tslib");
const re_1 = (0, tslib_1.__importDefault)(require("../re"));
const list_1 = require("cjk-conv/lib/zh/table/list");
const const_1 = require("opds-extra/lib/const");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
function addOpenSearch(feed, siteID) {
    feed.links = feed.links || [];
    feed.links.push({
        rel: "search",
        href: `/search/${siteID}.xml`,
        type: "application/opensearchdescription+xml",
    });
    return feed;
}
exports.addOpenSearch = addOpenSearch;
function filterOPDSBook(feed, searchTermOptions) {
    let { searchTerms } = searchTermOptions;
    if (searchTerms) {
        let defaultBool = !searchTermOptions.onlyBook;
        let searchTermsRe;
        let searchTermsSlugify = (0, list_1.slugify)(searchTerms);
        try {
            searchTermsRe = re_1.default.create(searchTerms, 'ig');
        }
        catch (e) {
        }
        logger_1.default.dir({
            searchTerms,
            searchTermsRe,
            searchTermsSlugify,
        });
        feed.books = feed.books
            .filter(book => {
            var _a, _b, _c, _d, _e;
            if (((_a = book.identifier) === null || _a === void 0 ? void 0 : _a.includes('book')) || ((_c = (_b = book.links) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.rel) === const_1.EnumLinkRel.ACQUISITION || ((_e = (_d = book.links) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.type) === const_1.EnumMIME.epub) {
                if ((searchTermsRe === null || searchTermsRe === void 0 ? void 0 : searchTermsRe.test(book.title))
                    || book.title.includes(searchTerms)
                    || (0, list_1.slugify)(book.title).includes(searchTermsSlugify)) {
                    return true;
                }
                return false;
            }
            return defaultBool;
        });
    }
    return feed;
}
exports.filterOPDSBook = filterOPDSBook;
//# sourceMappingURL=search.js.map