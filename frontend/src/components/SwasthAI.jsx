// SwasthAI.jsx
import React, { useState, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';

const SwasthAI = () => {
    const [prediction, setPrediction] = useState("");
    const fileInput = useRef();

    const speak = (text) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(text);
        synth.speak(utter);
    };


    const loadModelAndPredict = async (imgElement) => {
        const modelURL = "/model/model.json";
        const metadataURL = "/model/metadata.json";

        const model = await tmImage.load(modelURL, metadataURL);
        const predictionResult = await model.predict(imgElement);
        const topPrediction = predictionResult.reduce((a, b) =>
            a.probability > b.probability ? a : b
        );
        setPrediction(`${topPrediction.className} (${(topPrediction.probability * 100).toFixed(2)}%)`);
        localStorage.setItem("swasthai_prediction", topPrediction.className);
        speak(`This looks like ${topPrediction.className}. Please report it.`);
    };

    const handleFileChange = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) {
            console.error("No file selected");
            return;
        }

        const img = new Image();
        const fileURL = URL.createObjectURL(file);
        img.src = fileURL;

        img.onload = () => {
            loadModelAndPredict(img);
            URL.revokeObjectURL(fileURL); // cleanup after load
        };

        img.onerror = () => {
            console.error("Failed to load image");
            URL.revokeObjectURL(fileURL); // cleanup even on error
        };
    };


    return (
        <div className="p-4 border rounded-xl shadow-md bg-white max-w-md mx-auto my-6">
            <h2 className="text-xl font-bold mb-4 text-center">🧠 SwasthAI Detector</h2>
            <input type="file" accept="image/*" ref={fileInput} onChange={handleFileChange} className="mb-4" />
            {prediction && <div className="text-green-600 font-medium">Prediction: {prediction}</div>}
        </div>
    );
};

export default SwasthAI;
