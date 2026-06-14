import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { predictSentiment, resetSentiment } from '../features/sentiment/sentimentSlice';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

function Analysis() {
    const [review, setReview] = useState('');
    const textareaRef = useRef(null);
    const dispatch = useDispatch();

    const sentimentScores = useSelector((state) => state.sentiment.sentimentScores) || [];
    const status = useSelector((state) => state.sentiment.status);
    const error = useSelector((state) => state.sentiment.error);
    const userToken = useSelector((state) => state.user.token);

    const handleChange = (e) => {
        setReview(e.target.value);
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 'px';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userToken) {
            dispatch(resetSentiment());
            dispatch(predictSentiment({ review, token: userToken }));
        } else {
            console.error('User is not authenticated');
        }
    };

    const chartData = {
        labels: sentimentScores.map(score => score.label),
        datasets: [
            {
                label: 'Sentiment Scores',
                data: sentimentScores.map(score => score.score),
                backgroundColor: ['#f87171', '#93c5fd', '#4ade80'],
                borderColor: ['#f87171', '#93c5fd', '#4ade80'],
                borderWidth: 1,
            }
        ],
    };

    return (
        <div className="flex flex-col items-center px-4 py-6">

            {/* Form */}
            <div className="flex flex-col items-center w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                    <textarea
                        ref={textareaRef}
                        value={review}
                        onChange={handleChange}
                        placeholder="Enter your review about the movie!"
                        required
                        rows={3}
                        className="w-full border-2 border-gray-300 rounded-md hover:border-custom-blue focus:border-custom-blue focus:outline-none p-3 resize-none overflow-hidden font-condensed text-base"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="self-end font-condensed text-white px-6 py-2 font-normal bg-custom-blue rounded disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    >
                        {status === 'loading' ? 'Predicting...' : 'Predict'}
                    </button>
                </form>
            </div>

            {/* Error */}
            <div className="mt-4 w-full max-w-2xl">
                {status === 'failed' && (
                    <p className="text-center text-red-500 font-condensed">Error: {error}</p>
                )}
            </div>

            {/* Results */}
            {status === 'succeeded' && (
                <div className="mt-6 w-full max-w-2xl">
                    <ul className="flex items-center justify-center gap-4 flex-wrap mb-4">
                        {sentimentScores.length > 0 ? (
                            sentimentScores.map((score, index) => (
                                <li key={index} className="font-condensed text-black font-normal">
                                    {score.label}: {score.score.toFixed(2)}
                                </li>
                            ))
                        ) : (
                            <p>No sentiment scores available.</p>
                        )}
                    </ul>
                    <div className="flex justify-center">
                        <div style={{ width: '250px', height: '250px' }}>
                            <Pie data={chartData} />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Analysis;