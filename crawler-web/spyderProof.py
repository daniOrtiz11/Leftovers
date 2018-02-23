import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        'https://www.directoalpaladar.com/recetas-vegetarianas/receta-de-berenjenas-rellenas-de-verduras-con-queso-gouda-sin-lactosa',
    ]

    def parse(self, response):
        for article in response.css('div.article article-home'):
            yield {
                'titulo': article.css('span.text::text').extract_first(),
            }

        next_page = response.css('li.next a::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, self.parse)
			
