from fastapi import APIRouter
from models.review_model import ReviewInput
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
import torch

analysis_router = APIRouter()

# Loading fine-tuned model
MODEL_PATH = "./reviews_analysis_model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

labels = ['Negative', 'Neutral', 'Positive']

@analysis_router.post("/dashboard/predict")
async def predict_sentiment(review_input: ReviewInput):
    review = review_input.review

    # Preprocess
    review_words = []
    for word in review.split(' '):
        if word.startswith('@') and len(word) > 1:
            word = '@user'
        elif word.startswith('http'):
            word = "http"
        review_words.append(word)
    review_process = " ".join(review_words)

    # Tokenize
    encoded_review = tokenizer(
        review_process,
        return_tensors='pt',
        max_length=128,
        truncation=True,
        padding=True
    )

    # Predict
    with torch.no_grad():
        output = model(**encoded_review)

    scores = output[0][0].detach().numpy()
    scores = softmax(scores)

    # Response
    sentiment_scores = []
    for i in range(len(scores)):
        sentiment_scores.append({
            "label": labels[i],
            "score": float(scores[i])
        })

    top_label = labels[scores.argmax()]
    top_score = float(scores.max())

    return {
        "sentiment_scores": sentiment_scores,
        "predicted_label": top_label,
        "confidence": round(top_score, 4)
    }