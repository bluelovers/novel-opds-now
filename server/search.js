"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const types_1 = require("../lib/site/types");
const index_1 = require("../lib/opds/index");
const other_1 = require("../lib/opds/other");
const opds_1 = require("../lib/site/demonovel/opds");
const search_1 = require("../lib/opds/search");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const showClient_1 = require("./util/showClient");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
function searchHandler() {
    const router = (0, express_1.Router)();
    router.use('/*', (req, res, next) => {
        logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
        (0, showClient_1.showClient)(req, res, next);
        next();
    });
    router.use('/:siteID/:searchTerms', async (req, res) => {
        let { siteID, searchTerms } = req.params;
        let feed;
        let onlyBook;
        if (!siteID || siteID === 'all') {
            feed = await (0, opds_1.makeOPDSType)('all');
            feed.books = await bluebird_1.default
                .resolve(Object.keys(types_1.builded_map))
                .reduce(async (books, siteID) => {
                let feed2 = await (0, index_1.makeOPDSSite)(siteID);
                books.push(...feed2.books);
                return books;
            }, feed.books);
            let feed2 = await (0, other_1.makeOPDSOther)();
            feed.books.push(...feed2.books);
            onlyBook = true;
            feed.links = feed.links || [];
            feed.links = feed.links.filter(entry => entry.rel != 'search');
            feed = await (0, search_1.addOpenSearch)(feed, 'all');
        }
        else if (siteID === 'demonovel') {
            feed = await (0, opds_1.makeOPDSType)('all');
        }
        else if (siteID === 'other') {
            feed = await (0, other_1.makeOPDSOther)();
        }
        else {
            feed = await (0, index_1.makeOPDSSite)(siteID);
        }
        if (searchTerms) {
            feed = await (0, search_1.filterOPDSBook)(feed, {
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
//# sourceMappingURL=search.js.map