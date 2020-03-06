import { Router } from 'express';
import { id_titles_map } from '../lib/novel-cache/types';
import makeOPDSPortal, { makeOPDSSite } from '../lib/opds/index';
import opdsDemoNovelHandler from './opds/demonovel';
import updateCacheAll from '../lib/novel-cache/update';
import updateCache from '../lib/demonovel/update';
import { makeOPDSOther } from '../lib/opds/other';

function searchHandler()
{
    const router = Router();

    router.use('/:siteID/:searchTerms', async (req, res) =>
    {
        let feed = await makeOPDSSite(req.params.siteID as any, req.params.searchTerms);
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML())
    });

    router.use('/:siteID.xml', async (req, res) =>
    {

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
</OpenSearchDescription>`)
    });



    return router
}

export default searchHandler
