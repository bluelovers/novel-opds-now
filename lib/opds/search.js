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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLCtDQUE2QjtBQUM3QixxREFBcUQ7QUFFckQsU0FBZ0IsYUFBYSxDQUFDLElBQWlCLEVBQUUsTUFBeUI7SUFFekUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNmLEdBQUcsRUFBRSxRQUFRO1FBQ2IsSUFBSSxFQUFFLFdBQVcsTUFBTSxNQUFNO1FBQzdCLElBQUksRUFBRSx1Q0FBdUM7S0FDdEMsQ0FBQyxDQUFBO0lBRVQsT0FBTyxJQUFJLENBQUE7QUFDWixDQUFDO0FBVkQsc0NBVUM7QUFFRCxTQUFnQixjQUFjLENBQUMsSUFBaUIsRUFBRSxpQkFHakQ7SUFFQSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsaUJBQWlCLENBQUM7SUFFeEMsSUFBSSxXQUFXLEVBQ2Y7UUFDQyxJQUFJLFdBQVcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztRQUM5QyxJQUFJLGFBQXFCLENBQUM7UUFFMUIsSUFDQTtZQUNDLGFBQWEsR0FBRyxZQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUNsRDtRQUNELE9BQU8sQ0FBQyxFQUNSO1NBRUM7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLO2FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUVkLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDdkQ7Z0JBQ0MsSUFDQyxhQUFhLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO3VCQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7dUJBQ2hDLGNBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUV0RDtvQkFDQyxPQUFPLElBQUksQ0FBQztpQkFDWjtnQkFFRCxPQUFPLEtBQUssQ0FBQTthQUNaO1lBRUQsT0FBTyxXQUFXLENBQUE7UUFDbkIsQ0FBQyxDQUFDLENBQ0Y7S0FDRDtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQztBQTVDRCx3Q0E0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPUERTVjEgfSBmcm9tICdvcGRzLWV4dHJhJztcbmltcG9ydCB7IElTaXRlSURzIH0gZnJvbSAnLi4vbm92ZWwtY2FjaGUvdHlwZXMnO1xuaW1wb3J0IHpoUmVnRXhwIGZyb20gJy4uL3JlJztcbmltcG9ydCB7IHNsdWdpZnkgfSBmcm9tICdjamstY29udi9saWIvemgvdGFibGUvbGlzdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRPcGVuU2VhcmNoKGZlZWQ6IE9QRFNWMS5GZWVkLCBzaXRlSUQ6IElTaXRlSURzIHwgc3RyaW5nKVxue1xuXHRmZWVkLmxpbmtzID0gZmVlZC5saW5rcyB8fCBbXTtcblx0ZmVlZC5saW5rcy5wdXNoKHtcblx0XHRyZWw6IFwic2VhcmNoXCIsXG5cdFx0aHJlZjogYC9zZWFyY2gvJHtzaXRlSUR9LnhtbGAsXG5cdFx0dHlwZTogXCJhcHBsaWNhdGlvbi9vcGVuc2VhcmNoZGVzY3JpcHRpb24reG1sXCIsXG5cdH0gYXMgYW55KVxuXG5cdHJldHVybiBmZWVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJPUERTQm9vayhmZWVkOiBPUERTVjEuRmVlZCwgc2VhcmNoVGVybU9wdGlvbnM6IHtcblx0c2VhcmNoVGVybXM6IHN0cmluZyxcblx0b25seUJvb2s/OiBib29sZWFuLFxufSlcbntcblx0bGV0IHsgc2VhcmNoVGVybXMgfSA9IHNlYXJjaFRlcm1PcHRpb25zO1xuXG5cdGlmIChzZWFyY2hUZXJtcylcblx0e1xuXHRcdGxldCBkZWZhdWx0Qm9vbCA9ICFzZWFyY2hUZXJtT3B0aW9ucy5vbmx5Qm9vaztcblx0XHRsZXQgc2VhcmNoVGVybXNSZTogUmVnRXhwO1xuXG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0c2VhcmNoVGVybXNSZSA9IHpoUmVnRXhwLmNyZWF0ZShzZWFyY2hUZXJtcywgJ2lnJylcblx0XHR9XG5cdFx0Y2F0Y2ggKGUpXG5cdFx0e1xuXG5cdFx0fVxuXG5cdFx0ZmVlZC5ib29rcyA9IGZlZWQuYm9va3Ncblx0XHRcdC5maWx0ZXIoYm9vayA9PiB7XG5cblx0XHRcdFx0aWYgKGJvb2suaWRlbnRpZmllciAmJiBib29rLmlkZW50aWZpZXIuaW5jbHVkZXMoJ2Jvb2snKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdHNlYXJjaFRlcm1zUmUgJiYgc2VhcmNoVGVybXNSZS50ZXN0KGJvb2sudGl0bGUpXG5cdFx0XHRcdFx0XHR8fCBib29rLnRpdGxlLmluY2x1ZGVzKHNlYXJjaFRlcm1zKVxuXHRcdFx0XHRcdFx0fHwgc2x1Z2lmeShib29rLnRpdGxlKS5pbmNsdWRlcyhzbHVnaWZ5KHNlYXJjaFRlcm1zKSlcblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdEJvb2xcblx0XHRcdH0pXG5cdFx0O1xuXHR9XG5cblx0cmV0dXJuIGZlZWQ7XG59XG4iXX0=