"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const types_1 = require("../lib/novel-cache/types");
const index_1 = require("../lib/opds/index");
const other_1 = require("../lib/opds/other");
const opds_1 = require("../lib/demonovel/opds");
const search_1 = require("../lib/opds/search");
const bluebird_1 = __importDefault(require("bluebird"));
function searchHandler() {
    const router = express_1.Router();
    router.use('/:siteID/:searchTerms', async (req, res) => {
        let { siteID, searchTerms } = req.params;
        let feed;
        let onlyBook;
        if (!siteID || siteID === 'all') {
            feed = await opds_1.makeOPDSType('all');
            feed.books = await bluebird_1.default
                .resolve(Object.keys(types_1.builded_map))
                .reduce(async (books, siteID) => {
                let feed2 = await index_1.makeOPDSSite(siteID);
                books.push(...feed2.books);
                return books;
            }, feed.books);
            let feed2 = await other_1.makeOPDSOther();
            feed.books.push(...feed2.books);
            onlyBook = true;
            feed.links = feed.links || [];
            feed.links = feed.links.filter(entry => entry.rel != 'search');
            feed = await search_1.addOpenSearch(feed, 'all');
        }
        else if (siteID === 'demonovel') {
            feed = await opds_1.makeOPDSType('all');
        }
        else if (siteID === 'other') {
            feed = await other_1.makeOPDSOther();
        }
        else {
            feed = await index_1.makeOPDSSite(siteID);
        }
        if (searchTerms) {
            feed = await search_1.filterOPDSBook(feed, {
                searchTerms,
                onlyBook,
            });
        }
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    router.use('/:siteID.xml', async (req, res) => {
        res.setHeader('Content-Type', 'application/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <!--<ShortName>Web Search</ShortName>
  <Description>Use Example.com to search the Web.</Description>
  <Tags>example web</Tags>
  <Contact>admin@example.com</Contact>   
  TODO: 這裡應該可以做點別的, 摘抄自OpenSearch的定義
  http://www.opensearch.org/Specifications/OpenSearch/1.1 
  --> 
    <Url type="application/atom+xml;profile=opds-catalog;kind=acquisition"
     template="/search/${req.params.siteID}/{searchTerms}" />
<!--
  <LongName>Example.com Web Search</LongName>
  <Image height="64" width="64" type="image/png">http://example.com/websearch.png</Image>
  <Image height="16" width="16" type="image/vnd.microsoft.icon">http://example.com/websearch.ico</Image>
  <Query role="example" searchTerms="cat" />
  <Developer>Example.com Development Team</Developer>
  <Attribution>
    Search data Copyright 2005, Example.com, Inc., All Rights Reserved
  </Attribution>
  <SyndicationRight>open</SyndicationRight>
  <AdultContent>false</AdultContent>
  <Language>en-us</Language>
    example說能放更多奇怪的東西進去, 這邊不需要
  --> 
  <OutputEncoding>UTF-8</OutputEncoding>
  <InputEncoding>UTF-8</InputEncoding>
</OpenSearchDescription>`);
    });
    return router;
}
exports.default = searchHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQWlDO0FBQ2pDLG9EQUFnRjtBQUNoRiw2Q0FBaUU7QUFJakUsNkNBQWtEO0FBRWxELGdEQUFxRDtBQUNyRCwrQ0FBbUU7QUFDbkUsd0RBQWdDO0FBRWhDLFNBQVMsYUFBYTtJQUVyQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRXRELElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUN6QyxJQUFJLElBQWlCLENBQUM7UUFDdEIsSUFBSSxRQUFpQixDQUFDO1FBRXRCLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxLQUFLLEtBQUssRUFDL0I7WUFDQyxJQUFJLEdBQUcsTUFBTSxtQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRWhDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxrQkFBUTtpQkFDekIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQVcsQ0FBZSxDQUFDO2lCQUMvQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFFL0IsSUFBSSxLQUFLLEdBQUcsTUFBTSxvQkFBWSxDQUFDLE1BQWEsQ0FBQyxDQUFDO2dCQUU5QyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUzQixPQUFPLEtBQUssQ0FBQztZQUNkLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQ2Q7WUFFRCxJQUFJLEtBQUssR0FBRyxNQUFNLHFCQUFhLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVoQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBRWhCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUM7WUFFL0QsSUFBSSxHQUFHLE1BQU0sc0JBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDeEM7YUFDSSxJQUFJLE1BQU0sS0FBSyxXQUFXLEVBQy9CO1lBQ0MsSUFBSSxHQUFHLE1BQU0sbUJBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNoQzthQUNJLElBQUksTUFBTSxLQUFLLE9BQU8sRUFDM0I7WUFDQyxJQUFJLEdBQUcsTUFBTSxxQkFBYSxFQUFFLENBQUE7U0FDNUI7YUFFRDtZQUNDLElBQUksR0FBRyxNQUFNLG9CQUFZLENBQUMsTUFBYSxDQUFDLENBQUM7U0FDekM7UUFFRCxJQUFJLFdBQVcsRUFDZjtZQUNDLElBQUksR0FBRyxNQUFNLHVCQUFjLENBQUMsSUFBSSxFQUFFO2dCQUNqQyxXQUFXO2dCQUNYLFFBQVE7YUFDUixDQUFDLENBQUM7U0FDSDtRQUVELEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUN2QixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFHN0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDOzs7Ozs7Ozs7O3lCQVVjLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBaUJqQixDQUFDLENBQUE7SUFDekIsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQTtBQUNkLENBQUM7QUFFRCxrQkFBZSxhQUFhLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGlkX3RpdGxlc19tYXAsIGJ1aWxkZWRfbWFwLCBJU2l0ZUlEcyB9IGZyb20gJy4uL2xpYi9ub3ZlbC1jYWNoZS90eXBlcyc7XG5pbXBvcnQgbWFrZU9QRFNQb3J0YWwsIHsgbWFrZU9QRFNTaXRlIH0gZnJvbSAnLi4vbGliL29wZHMvaW5kZXgnO1xuaW1wb3J0IG9wZHNEZW1vTm92ZWxIYW5kbGVyIGZyb20gJy4vb3Bkcy9kZW1vbm92ZWwnO1xuaW1wb3J0IHVwZGF0ZUNhY2hlQWxsIGZyb20gJy4uL2xpYi9ub3ZlbC1jYWNoZS91cGRhdGUnO1xuaW1wb3J0IHVwZGF0ZUNhY2hlIGZyb20gJy4uL2xpYi9kZW1vbm92ZWwvdXBkYXRlJztcbmltcG9ydCB7IG1ha2VPUERTT3RoZXIgfSBmcm9tICcuLi9saWIvb3Bkcy9vdGhlcic7XG5pbXBvcnQgeyBPUERTVjEgfSBmcm9tICdvcGRzLWV4dHJhJztcbmltcG9ydCB7IG1ha2VPUERTVHlwZSB9IGZyb20gJy4uL2xpYi9kZW1vbm92ZWwvb3Bkcyc7XG5pbXBvcnQgeyBmaWx0ZXJPUERTQm9vaywgYWRkT3BlblNlYXJjaCB9IGZyb20gJy4uL2xpYi9vcGRzL3NlYXJjaCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuXG5mdW5jdGlvbiBzZWFyY2hIYW5kbGVyKClcbntcblx0Y29uc3Qgcm91dGVyID0gUm91dGVyKCk7XG5cblx0cm91dGVyLnVzZSgnLzpzaXRlSUQvOnNlYXJjaFRlcm1zJywgYXN5bmMgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0bGV0IHsgc2l0ZUlELCBzZWFyY2hUZXJtcyB9ID0gcmVxLnBhcmFtcztcblx0XHRsZXQgZmVlZDogT1BEU1YxLkZlZWQ7XG5cdFx0bGV0IG9ubHlCb29rOiBib29sZWFuO1xuXG5cdFx0aWYgKCFzaXRlSUQgfHwgc2l0ZUlEID09PSAnYWxsJylcblx0XHR7XG5cdFx0XHRmZWVkID0gYXdhaXQgbWFrZU9QRFNUeXBlKCdhbGwnKVxuXG5cdFx0XHRmZWVkLmJvb2tzID0gYXdhaXQgQmx1ZWJpcmRcblx0XHRcdFx0LnJlc29sdmUoT2JqZWN0LmtleXMoYnVpbGRlZF9tYXApIGFzIElTaXRlSURzW10pXG5cdFx0XHRcdC5yZWR1Y2UoYXN5bmMgKGJvb2tzLCBzaXRlSUQpID0+IHtcblxuXHRcdFx0XHRcdGxldCBmZWVkMiA9IGF3YWl0IG1ha2VPUERTU2l0ZShzaXRlSUQgYXMgYW55KTtcblxuXHRcdFx0XHRcdGJvb2tzLnB1c2goLi4uZmVlZDIuYm9va3MpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGJvb2tzO1xuXHRcdFx0XHR9LCBmZWVkLmJvb2tzKVxuXHRcdFx0O1xuXG5cdFx0XHRsZXQgZmVlZDIgPSBhd2FpdCBtYWtlT1BEU090aGVyKCk7XG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goLi4uZmVlZDIuYm9va3MpO1xuXG5cdFx0XHRvbmx5Qm9vayA9IHRydWU7XG5cblx0XHRcdGZlZWQubGlua3MgPSBmZWVkLmxpbmtzIHx8IFtdO1xuXHRcdFx0ZmVlZC5saW5rcyA9IGZlZWQubGlua3MuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LnJlbCAhPSAnc2VhcmNoJyk7XG5cblx0XHRcdGZlZWQgPSBhd2FpdCBhZGRPcGVuU2VhcmNoKGZlZWQsICdhbGwnKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoc2l0ZUlEID09PSAnZGVtb25vdmVsJylcblx0XHR7XG5cdFx0XHRmZWVkID0gYXdhaXQgbWFrZU9QRFNUeXBlKCdhbGwnKVxuXHRcdH1cblx0XHRlbHNlIGlmIChzaXRlSUQgPT09ICdvdGhlcicpXG5cdFx0e1xuXHRcdFx0ZmVlZCA9IGF3YWl0IG1ha2VPUERTT3RoZXIoKVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0ZmVlZCA9IGF3YWl0IG1ha2VPUERTU2l0ZShzaXRlSUQgYXMgYW55KTtcblx0XHR9XG5cblx0XHRpZiAoc2VhcmNoVGVybXMpXG5cdFx0e1xuXHRcdFx0ZmVlZCA9IGF3YWl0IGZpbHRlck9QRFNCb29rKGZlZWQsIHtcblx0XHRcdFx0c2VhcmNoVGVybXMsXG5cdFx0XHRcdG9ubHlCb29rLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdHJlcy5zZW5kKGZlZWQudG9YTUwoKSlcblx0fSk7XG5cblx0cm91dGVyLnVzZSgnLzpzaXRlSUQueG1sJywgYXN5bmMgKHJlcSwgcmVzKSA9PlxuXHR7XG5cblx0XHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veG1sJyk7XG5cdFx0cmVzLnNlbmQoYDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCI/PlxuPE9wZW5TZWFyY2hEZXNjcmlwdGlvbiB4bWxucz1cImh0dHA6Ly9hOS5jb20vLS9zcGVjL29wZW5zZWFyY2gvMS4xL1wiPlxuICA8IS0tPFNob3J0TmFtZT5XZWIgU2VhcmNoPC9TaG9ydE5hbWU+XG4gIDxEZXNjcmlwdGlvbj5Vc2UgRXhhbXBsZS5jb20gdG8gc2VhcmNoIHRoZSBXZWIuPC9EZXNjcmlwdGlvbj5cbiAgPFRhZ3M+ZXhhbXBsZSB3ZWI8L1RhZ3M+XG4gIDxDb250YWN0PmFkbWluQGV4YW1wbGUuY29tPC9Db250YWN0PiAgIFxuICBUT0RPOiDpgJnoo6Hmh4noqbLlj6/ku6XlgZrpu57liKXnmoQsIOaRmOaKhOiHqk9wZW5TZWFyY2jnmoTlrprnvqlcbiAgaHR0cDovL3d3dy5vcGVuc2VhcmNoLm9yZy9TcGVjaWZpY2F0aW9ucy9PcGVuU2VhcmNoLzEuMSBcbiAgLS0+IFxuICAgIDxVcmwgdHlwZT1cImFwcGxpY2F0aW9uL2F0b20reG1sO3Byb2ZpbGU9b3Bkcy1jYXRhbG9nO2tpbmQ9YWNxdWlzaXRpb25cIlxuICAgICB0ZW1wbGF0ZT1cIi9zZWFyY2gvJHtyZXEucGFyYW1zLnNpdGVJRH0ve3NlYXJjaFRlcm1zfVwiIC8+XG48IS0tXG4gIDxMb25nTmFtZT5FeGFtcGxlLmNvbSBXZWIgU2VhcmNoPC9Mb25nTmFtZT5cbiAgPEltYWdlIGhlaWdodD1cIjY0XCIgd2lkdGg9XCI2NFwiIHR5cGU9XCJpbWFnZS9wbmdcIj5odHRwOi8vZXhhbXBsZS5jb20vd2Vic2VhcmNoLnBuZzwvSW1hZ2U+XG4gIDxJbWFnZSBoZWlnaHQ9XCIxNlwiIHdpZHRoPVwiMTZcIiB0eXBlPVwiaW1hZ2Uvdm5kLm1pY3Jvc29mdC5pY29uXCI+aHR0cDovL2V4YW1wbGUuY29tL3dlYnNlYXJjaC5pY288L0ltYWdlPlxuICA8UXVlcnkgcm9sZT1cImV4YW1wbGVcIiBzZWFyY2hUZXJtcz1cImNhdFwiIC8+XG4gIDxEZXZlbG9wZXI+RXhhbXBsZS5jb20gRGV2ZWxvcG1lbnQgVGVhbTwvRGV2ZWxvcGVyPlxuICA8QXR0cmlidXRpb24+XG4gICAgU2VhcmNoIGRhdGEgQ29weXJpZ2h0IDIwMDUsIEV4YW1wbGUuY29tLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkXG4gIDwvQXR0cmlidXRpb24+XG4gIDxTeW5kaWNhdGlvblJpZ2h0Pm9wZW48L1N5bmRpY2F0aW9uUmlnaHQ+XG4gIDxBZHVsdENvbnRlbnQ+ZmFsc2U8L0FkdWx0Q29udGVudD5cbiAgPExhbmd1YWdlPmVuLXVzPC9MYW5ndWFnZT5cbiAgICBleGFtcGxl6Kqq6IO95pS+5pu05aSa5aWH5oCq55qE5p2x6KW/6YCy5Y67LCDpgJnpgorkuI3pnIDopoFcbiAgLS0+IFxuICA8T3V0cHV0RW5jb2Rpbmc+VVRGLTg8L091dHB1dEVuY29kaW5nPlxuICA8SW5wdXRFbmNvZGluZz5VVEYtODwvSW5wdXRFbmNvZGluZz5cbjwvT3BlblNlYXJjaERlc2NyaXB0aW9uPmApXG5cdH0pO1xuXG5cdHJldHVybiByb3V0ZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VhcmNoSGFuZGxlclxuIl19