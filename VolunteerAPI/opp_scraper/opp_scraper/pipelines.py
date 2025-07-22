# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
#from itemadapter import ItemAdapter
import json
import os

class DeduplicatingJsonWriterPipeline:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(base_dir, "opportunity.json")
    print(filename)

    def open_spider(self, spider):
        self.seen_urls = set()
        self.items = []

        if os.path.exists(self.filename):
            with open(self.filename, "r") as f:
                try:
                    existing = json.load(f)
                    for item in existing:
                        self.seen_urls.add(item["description_url"])  
                        self.items.append(item)
                except json.JSONDecodeError:
                    pass

    def process_item(self, item, spider):
        if item["description_url"] not in self.seen_urls:
            self.items.append(item)
            self.seen_urls.add(item["description_url"])
        return item

    def close_spider(self, spider):
        with open(self.filename, "w") as f:
            json.dump(self.items, f, indent=2)
