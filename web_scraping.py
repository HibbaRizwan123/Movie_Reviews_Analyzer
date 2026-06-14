from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import langid
import pandas as pd
import time
import random

options = Options()
options.add_argument("--disable-extensions")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-images")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.set_script_timeout(60)
driver.set_page_load_timeout(60)

# Movies URL here
movies = [
    "https://www.rottentomatoes.com/m/migration_2023/reviews/all-audience",
    "https://www.rottentomatoes.com/m/winged_migration/reviews/all-audience",
    "https://www.rottentomatoes.com/m/land_before_time_x_the_great_longneck_migration/reviews/all-audience",
]

all_reviews = []

for movie_url in movies:
    print(f"\nScraping: {movie_url}")

    driver.get("https://www.rottentomatoes.com")
    time.sleep(3)

    driver.get(movie_url)
    time.sleep(random.uniform(3, 5))

    click_count = 0

    while True:
        try:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        except:
            print("Scroll timed out, moving to scraping!")
            break

        time.sleep(3)

        try:
            load_more = WebDriverWait(driver, 6).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "rt-button[data-pagemediareviewsmanager='loadMoreBtn:click']"))
            )
            driver.execute_script("arguments[0].click();", load_more)
            click_count += 1
            print(f"Clicked Load More ({click_count} times)")

            cards_now = driver.find_elements("css selector", "review-card-audience")
            print(f"Cards loaded so far: {len(cards_now)}")

            if len(cards_now) >= 1050:
                print("Enough cards loaded!")
                break

            if click_count % 5 == 0:
                print(f"Taking longer break after {click_count} clicks...")
                time.sleep(8)
            else:
                time.sleep(random.uniform(3, 5))

        except:
            print("No Load More button, done with this movie!")
            break

    # Scrape this movie's reviews and ratings
    soup = BeautifulSoup(driver.page_source, "html.parser")
    cards = soup.find_all("review-card-audience")
    print(f"Found {len(cards)} cards for this movie")

    for card in cards:
        span = card.find("span", attrs={"slot": "content"})
        rating_tag = card.find("rating-stars-group")  
        if not span:
            continue
        text = span.get_text(strip=True)
        rating = rating_tag.get("score") if rating_tag else None  
        if len(text) < 10:
            continue
        try:
            if langid.classify(text)[0] == "en":
                all_reviews.append({
                "text": text,
                "rating": rating,
                "movie": movie_url.split("/m/")[1].split("/")[0]
            })
        except:
            pass

    print(f"Total reviews collected so far: {len(all_reviews)}")
    time.sleep(5)

driver.quit()

df = pd.DataFrame(all_reviews)
df.to_csv("Raw_Movie_Reviews.csv", index=False)
print(f"\nRaw data saved {len(df)} reviews in Raw_Movie_Reviews.csv")
print(df.head())