"""
Hardware price scraper for Chinese market.
Targets public product listing pages from ZOL (中关村在线) and SMZDM (什么值得买).

Usage: python scripts/scraper.py
Output: public/data/hardware.json

Note: This is a reference implementation. Due to anti-scraping measures on
Chinese e-commerce sites, you may need to:
1. Use proxies or rotating User-Agents
2. Adjust selectors as site structures change
3. Fall back to manual data updates if scraping is blocked
"""

import json
import os
import re
import sys
import time
from datetime import date
from typing import Optional

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing dependencies. Install with: pip install requests beautifulsoup4")
    sys.exit(1)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "data", "hardware.json"
)

TODAY = date.today().isoformat()


def fetch_page(url: str, retries: int = 2) -> Optional[str]:
    """Fetch a URL with retries and polite delays."""
    for attempt in range(retries):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            resp.raise_for_status()
            resp.encoding = resp.apparent_encoding or "utf-8"
            return resp.text
        except Exception as e:
            print(f"  Attempt {attempt + 1} failed for {url}: {e}")
            if attempt < retries - 1:
                time.sleep(3)
    return None


def scrape_zol_cpu() -> list[dict]:
    """
    Scrape CPU listings from ZOL product page.
    URL subject to change — update if ZOL restructures.
    """
    items: list[dict] = []
    url = "https://detail.zol.com.cn/cpu/"
    print(f"Fetching CPU data from {url} ...")
    html = fetch_page(url)
    if not html:
        print("  Failed to fetch CPU page")
        return items

    soup = BeautifulSoup(html, "html.parser")
    # ZOL product list items — selectors may need adjustment
    for item in soup.select(".product-list .item"):
        try:
            title_el = item.select_one(".title a")
            price_el = item.select_one(".price")
            if not title_el:
                continue

            model = title_el.get_text(strip=True)
            price_text = price_el.get_text(strip=True) if price_el else "0"
            price_match = re.search(r"[\d]+", price_text.replace(",", ""))
            price = int(price_match.group()) if price_match else 0

            if price > 0:
                items.append({
                    "id": f"cpu-zol-{len(items)}",
                    "category": "cpu",
                    "brand": "Intel" if "intel" in model.lower() or "酷睿" in model else "AMD",
                    "model": model,
                    "specs": {},
                    "price": price,
                    "priceDate": TODAY,
                    "source": "中关村在线",
                    "score": 50,
                })
        except Exception as e:
            print(f"  Parse error: {e}")
            continue

    print(f"  Found {len(items)} CPUs")
    return items


def load_existing_data() -> list[dict]:
    """Load existing hardware data as fallback base."""
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return []


def merge_items(existing: list[dict], scraped: list[dict]) -> list[dict]:
    """
    Merge scraped data into existing data.
    - New items are added
    - Existing items keep their data unless scraped has a newer price
    """
    existing_map: dict[str, dict] = {item["id"]: item for item in existing}

    for item in scraped:
        if item["id"] in existing_map:
            existing_map[item["id"]]["price"] = item["price"]
            existing_map[item["id"]]["priceDate"] = TODAY
        else:
            existing_map[item["id"]] = item

    merged = list(existing_map.values())
    # Sort by category then score
    merged.sort(key=lambda x: (x["category"], -x["score"]))
    return merged


def main():
    print("=" * 50)
    print(f"Hardware Scraper — {TODAY}")
    print("=" * 50)

    existing = load_existing_data()
    print(f"Loaded {len(existing)} existing items")

    all_scraped: list[dict] = []

    # Attempt to scrape each category
    # Currently ZOL-only; extend with SMZDM or JD as needed
    all_scraped.extend(scrape_zol_cpu())

    # TODO: Add scrapers for GPU, RAM, monitor, etc.
    # scrape_zol_gpu()
    # scrape_smzdm_deals()

    if all_scraped:
        merged = merge_items(existing, all_scraped)
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(merged, f, ensure_ascii=False, indent=2)
        print(f"\nSaved {len(merged)} items to {OUTPUT_PATH}")
    else:
        print("\nNo new data scraped. Existing data preserved.")

    print("Done.")


if __name__ == "__main__":
    main()
