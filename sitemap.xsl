<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
				body {
					font-family: Helvetica, Arial, sans-serif;
					font-size: 16px;
				}
				table {
					border: none;
					border-collapse: collapse;
          width: 100%;
				}
				#sitemap tr:nth-child(odd) td {
					background-color: #eee !important;
				}
				#content {
					margin: 0 auto;
					width: 1000px;
				}
				.expl {
					margin: 18px 3px;
					line-height: 1.2em;
				}
				a {
					text-decoration: none;
				}
				a:hover {
					text-decoration: underline;
				}
				th {
					text-align:left;
				}
				thead th {
					border-bottom: 1px solid #000;
				}
        </style>
      </head>
      <body>
        <div id="content">
          <h1>XML Sitemap</h1>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
            <p class="expl">
					This XML Sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
 URLs.
            </p>
            <table id="sitemap" cellpadding="3">
              <thead>
                <tr>
                  <th width="60%">URL</th>
                  <th title="Last Modification Time" width="40%">Last Mod.</th>
                </tr>
              </thead>
              <tbody>
                <xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
                <xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
