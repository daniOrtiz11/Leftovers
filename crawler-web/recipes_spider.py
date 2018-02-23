import scrapy


class RecipesSpider(scrapy.Spider):
    name = "recipes"
    start_urls = [
        'https://webosfritos.es/2018/02/guiso-de-conejo/',
    ]

    def parse(self, response):
        for recipe in response.css('div.pf-content'):
            yield {
                'titulo': recipe.css("h2::text").extract_first(),
            }

        next_page = response.css('li.next a::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, self.parse)
			
