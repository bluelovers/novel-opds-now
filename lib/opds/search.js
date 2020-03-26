"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterOPDSBook = exports.addOpenSearch = void 0;
const re_1 = __importDefault(require("../re"));
const list_1 = require("cjk-conv/lib/zh/table/list");
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
        try {
            searchTermsRe = re_1.default.create(searchTerms, 'ig');
        }
        catch (e) {
        }
        feed.books = feed.books
            .filter(book => {
            if (book.identifier && book.identifier.includes('book')) {
                if (searchTermsRe && searchTermsRe.test(book.title)
                    || book.title.includes(searchTerms)
                    || list_1.slugify(book.title).includes(list_1.slugify(searchTerms))) {
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