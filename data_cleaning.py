import pandas as pd
import re
import html
import nlpaug.augmenter.word as naw
import random


# Loading Data
df = pd.read_csv("Raw_Movie_Reviews.csv")
print("_____________________________________________________________")
print(f"Raw reviews: {len(df)}")
# print("_____________________________________________________________")
# print(df["movie"].value_counts())
# print("_____________________________________________________________")
# print(df["rating"].value_counts())

# Step 1: Removing Duplicates
print("_____________________________________________________________")
df = df.drop_duplicates(subset="text")
print(f"\n After removing Duplicates: {len(df)}")


# Step 2: Removing Empty Rows 
print("_____________________________________________________________")
df = df.dropna(subset=["text", "rating"])
df = df[df["text"].str.strip() != ""]
print(f"After removing Empty Rows: {len(df)}")

# Step 3: Text Normalization 
print("_____________________________________________________________")
def clean_text(text):
    text = str(text).strip()
    text = html.unescape(text)        # fix &amp; &quot; etc
    text = re.sub(r'\s+', ' ', text)  # remove extra spaces only
    return text.strip()
df["text"] = df["text"].apply(clean_text)
print(f"After Normalization: {len(df)}")

# Step 4: Filter by length
print("_____________________________________________________________")
df["length"] = df["text"].str.len()
df = df[(df["length"] >= 20)]
df = df.drop(columns=["length"])
print(f"After Length filter: {len(df)}")

# Step 5: Map ratings to labels 
print("_____________________________________________________________")
def map_label(rating):
    try:
        r = float(rating)
        if r <= 2:
            return "negative"
        elif r <= 3:
            return "neutral"
        else:
            return "positive"
    except:
        return None
df["label"] = df["rating"].apply(map_label)

# print(df.head(10))

# Step 6: Checking Class Balance 
print("_____________________________________________________________")
print(f"\nLabel distribution:")
print(df["label"].value_counts())

# Step 7: Data Augmentation 
print("_____________________________________________________________")
aug = naw.SynonymAug(aug_p=0.3) #SynonymAug: Function which replaces words with their synonyms. "aug_p" controls the percentage of words to be replaced.

def augment_reviews(df_minority, target_count, label):
    original_reviews = df_minority["text"].tolist() # Convert pandas column to python list because random.choice() works on lists.
    augmented_rows = []
    current_count = len(original_reviews)
    needed = target_count - current_count 
    while len(augmented_rows) < needed:
        original_text = random.choice(original_reviews)
        try:
            augmented_text = aug.augment(original_text)[0]
            if augmented_text != original_text:
                augmented_rows.append({
                "text": augmented_text,
                "rating": df_minority["rating"].iloc[0],
                "label": label,
                "movie": "augmented"
                })
        except:
            continue
    print(f"Generated {len(augmented_rows)} augmented reviews")
    return pd.DataFrame(augmented_rows)

# Split by class
df_positive = df[df["label"] == "positive"]
df_neutral  = df[df["label"] == "neutral"]
df_negative = df[df["label"] == "negative"]


target = 200

df_neutral_aug  = augment_reviews(df_neutral,  target, "neutral")
df_negative_aug = augment_reviews(df_negative, target, "negative")

# Combine original + augmented
df_final = pd.concat([
    df_positive,
    df_neutral,
    df_neutral_aug,
    df_negative,
    df_negative_aug
]).reset_index(drop=True)

# Shuffling so Augmented Rows are not all at the bottom
df_final = df_final.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"\nFinal label distribution:")
print(df_final["label"].value_counts())

df_final.to_csv("Cleaned_Movie_Reviews.csv", index=False)
print(f"\nSaved {len(df_final)} reviews to Cleaned_Movie_Reviews.csv")

        
   