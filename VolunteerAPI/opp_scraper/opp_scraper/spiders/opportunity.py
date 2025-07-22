import scrapy
import re
from datetime import datetime
from crontab import CronTab

# schema to match

# model Opportunity {
#   id               Int           @id @default(autoincrement())
#   name             String
#   tags             String[]      @default([])
#   requirements     String[]      @default([])
#   description      String?       
#   date             DateTime?     
#   createdAt        DateTime      @default(now())
#   location         String?       
#   skills           String[]      @default([])
#   imageUrl         String?     
#   volunteersNeeded Int?          
#   status           String        @default("active")
#   points           Int           @default(0) 
#   organization     Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
#   organizationId   Int
#   users            User[]        @relation("UserOpportunities")
#   savedByUsers     User[]        @relation("SavedOpportunities")
# }

class OpportunitySpider(scrapy.Spider):
    name = "opportunity"
    allowed_domains = ["idealist.org", "volunteermatch.org"]
    start_urls = [
        f"https://www.idealist.org/en/volunteer-opportunities?page={i}" for i in range(1, 25)
    ]

    def parse(self, response):
        for card in response.css("div[data-qa-id='search-result']"):
            description_url = response.urljoin(card.css("a::attr(href)").get())


            if description_url.startswith("https://www.volunteermatch.org/"):
                item = {
                    "name": card.css("h3.sc-2vqkkp-2 span::text").get(default="").strip(),
                    "organizationName": card.css("h4.sc-2vqkkp-3 div::text").get(default="").strip(),
                    "description_url": description_url,
                }

                yield response.follow(
                    description_url,
                    callback=self.parse_detail,
                    meta={"item": item}
                )

    def parse_detail(self, response):
        item = response.meta["item"]

        def extract(selector):
            return response.css(selector).get(default="").strip()

        def extract_all(selector):
            return [s.strip() for s in response.css(selector).getall() if s.strip()]
        
        def extract_tags(selector):
            raw = response.css(selector).get(default="")
            return [tag.strip() for tag in raw.split(",") if tag.strip()]
        
        def clean_location(raw_location):
            cleaned = re.sub(r'\s+', ' ', raw_location).strip()
            return cleaned if cleaned else None
        
        org_relative = extract("a.hvr-o::attr(href)")
        item.update({
            "orgDetail": org_relative,
            "tags": extract_tags("div.logistics__causes-list::text"),
            "requirements": extract_all("section.logistics__section--requirements li::text") or ["Everyone is welcome"],
            "description": " ".join(extract_all("div#short_desc p::text")),
            "when": self.parse_when(response),
            "volunteerLocation": clean_location(" ".join(response.css("address *::text").getall())) or None,
            "skills": extract_all("section.logistics__section--skills ul.list li.item::text"),
            "imageUrl": extract("img[name='org_image']::attr(src)"),
            "volunteersNeeded": self.extract_volunteers_needed(response),
        })

        if org_relative:
            org_url = response.urljoin(org_relative)
            yield response.follow(
                org_url,
                callback=self.parse_org_detail,
                meta={"item": item}
            )
        else:
            yield item
    
    def parse_org_detail(self, response):
        item = response.meta["item"]


        def extract_all(selector):
            return [s.strip() for s in response.css(selector).getall() if s.strip()]
        
        def clean_location(raw_location):
            cleaned = re.sub(r'\s+', ' ', raw_location).strip()
            return cleaned if cleaned else None
        
        #org details
        orgTags= extract_all("ul.org-dts__cause-list li.ellipsis::text"),
        orgLocation= clean_location(" ".join(response.css("address *::text").getall())) or None,

        item.update({
            "orgTags": orgTags,
            "orgLocation": orgLocation,
        })

        yield item
    

    def parse_date(self, date_str):
        if not date_str:
            return None
        date_str = date_str.strip()
        if "flexible" in date_str.lower() or "your schedule" in date_str.lower():
            return None
        for fmt in ["%b %d, %Y", "%B %d, %Y"]:
            try:
                return datetime.strptime(date_str, fmt).isoformat()
            except (ValueError, TypeError):
                continue
        return None


    def extract_volunteers_needed(self, response):
        text = response.css("li#all_interested_sum div::text").get(default="")
        match = re.search(r"Spots available:\s*(\d+)", text)
        return int(match.group(1)) if match else "Everyone is welcome!"
    
    def parse_when(self, response):
        raw_texts = response.css("section.logistics__section--when *::text").getall()
        cleaned = [t.strip() for t in raw_texts if t.strip() and t.strip().upper() != "WHEN"]
        result = {}

        if len(cleaned) > 0:
            result["date"] = cleaned[0]
        if len(cleaned) > 1:
            result["time"] = cleaned[1]
        if len(cleaned) > 2:
            result["timeslot"] = cleaned[2]

        return result if result else None
    
    
#command to save output as json: scrapy crawl opportunity 

# you need to download python first, at least version 3.11
# then you need to install scrapy with pip3 install scrapy
# then you need to navigate to this directory where the spider is located /opp_scraper
# then you can run the spider with scrapy crawl opportunity 
# then go back to volunteerapi directory in terminal and run node seed. js
# then go to http://localhost:5173/map in your browser to see the map populated with the opporunities or th eopportunity grid even
