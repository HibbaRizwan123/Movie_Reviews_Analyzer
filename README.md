# 🎬 Movie Reviews Analyzer
This project analyzes movie reviews and classifies them as **Positive**, **Negative**, or **Neutral** using a fine-tuned transformer model trained on real reviews.

## 🛠️ Tech Stack
### 💻 Frontend
- React.js
- TailwindCSS


### ⚙️ Backend
- Python
- FastAPI
- dotenv for environment variables

## 🧠 Model Integration
Fine-tuned **cardiffnlp/twitter-roberta-base-sentiment-latest** on a custom movie reviews dataset.

## 🌐 Dataset Source
Scraped 742 movie reviews from [Rotten Tomatoes](https://www.rottentomatoes.com) using **Selenium** and **BeautifulSoup**. Only English reviews were collected using language detection.

## ⚙️ Data Cleaning
- Removed duplicate reviews
- Removed empty and null rows
- Fixed HTML entities using Python's built-in `html` module
- Removed extra whitespace
- Filtered reviews by length (minimum 20 characters) 
- Mapped star ratings to sentiment labels (1 to 2 stars as Negative, 3 stars as Neutral, 4 to 5 stars as Positive)

## ⚠️ Problem Faced & Its Solution
The main problem faced during this project was ***class imbalance***. The dataset contained 574 positive samples, 73 negative samples, and 86 neutral samples, which shows that the positive class was dominating compared to the other two classes, making the model biased toward positive reviews.

To solve this issue three choices were considered :***Undersampling***, ***Oversampling***, and ***Augmentation***. Synonym augmentation was chosen for the negative and neutral reviews so that the model is able to observe different patterns, unlike oversampling where exact reviews are simply copied and pasted which makes the model memorize the same sentences instead of learning diverse patterns. Undersampling was not a suitable choice since the original dataset size was only 742 reviews so removing positive samples would shrink the training data which hurt the model's performance. 
Both minority classes were augmented to 200 samples each resulting in a final dataset of 974 reviews.

Additionally, class weights were applied during fine-tuning to penalize the model heavily for misclassifying minority classes, adding a second layer of bias prevention at the training level.

## 📊 Model Performance


## 🤗 Fine-tuned Model
The fine-tuned model is publicly available on Hugging Face. You can download or use it directly in your own projects.

👉 [Movie Reviews Sentiment Model on Hugging Face](https://huggingface.co/hibbariz/movieReview_analysis_model)


## 🚀 How to Run Locally
### Backend
```bash
git clone https://github.com/HibbaRizwan123/Movie-Reviews-Analyzer
cd Movie-Reviews-Analyzer
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables
Create a `.env` file in the root directory:
```
MONGO_URI=your_mongodb_atlas_connection_string
SECRET_KEY=your_secret_key
```
