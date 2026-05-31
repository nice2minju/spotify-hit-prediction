# Spotify Hit Song Prediction

[2026-1] Machine Learning Term Project

## Problem
Predict whether a song is "popular" (popularity ≥ 60) based solely on Spotify audio features.

## Setup

```bash
pip install -r requirements.txt
```

## Data
1. Download `dataset.csv` from [Kaggle](https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset)
2. Place it in the `data/` folder

## Run
```bash
jupyter notebook spotify_ml.ipynb
```

## Project Structure
```
spotify-ml/
├── data/              # dataset.csv (download from Kaggle)
├── figures/           # generated plots
├── models/            # saved model files
├── spotify_ml.ipynb   # main notebook
├── report_draft.md    # report draft
├── requirements.txt
└── README.md
```
