# Spotify 오디오 피처 기반 인기곡 분류
## [2026-1] Machine Learning Term Project

---

## 1. Introduction

Spotify는 1억 개 이상의 트랙을 보유한 세계 최대 음악 스트리밍 플랫폼이다. 그러나 매일 수만 곡이 업로드되는 환경에서 대부분의 곡은 거의 재생되지 않는다. 아티스트와 음반 기획사 입장에서 "어떤 음악적 특성이 인기를 결정하는가"라는 질문은 실질적인 비즈니스 가치를 갖는다.

본 프로젝트는 Spotify가 자동 추출하는 **오디오 피처(danceability, energy, loudness 등) 만으로** 곡의 인기 여부를 예측하는 이진 분류 문제를 다룬다. 핵심 질문은 다음과 같다:

> **"아티스트의 유명세나 마케팅 없이, 소리 그 자체만으로 인기곡을 구분할 수 있는가?"**

이 질문이 흥미로운 이유는 두 가지다. 첫째, 오디오 피처는 발매 전에도 계산 가능하므로 예측 모델이 실제로 활용 가능하다. 둘째, 어떤 피처가 중요한지 분석하면 음악 제작 방향에 대한 인사이트를 얻을 수 있다.

---

## 2. Dataset

- **출처**: Kaggle — Spotify Tracks Dataset (maharshipandya, 2023)
- **규모**: 114,000곡, 114개 장르, 피처 20개
- **라이선스**: CC0 (Public Domain), 학술 사용 가능

### 주요 오디오 피처

| 피처 | 설명 | 범위 |
|------|------|------|
| danceability | 춤추기 적합한 정도 | 0–1 |
| energy | 강렬함·활동성 | 0–1 |
| loudness | 평균 음량 | dB |
| speechiness | 발화(말) 비율 | 0–1 |
| acousticness | 어쿠스틱 악기 비율 | 0–1 |
| instrumentalness | 보컬 없는 정도 | 0–1 |
| liveness | 라이브 공연 느낌 | 0–1 |
| valence | 긍정적·밝은 분위기 | 0–1 |
| tempo | 빠르기 | BPM |
| explicit | 선정적 가사 여부 | 0/1 |

### 타겟 변수 설계 및 고민

popularity 점수(0–100)를 이진 분류로 변환하기 위해 임계값(threshold)을 설정해야 했다. 처음에는 상위 50%(threshold=50)를 고려했으나, EDA 결과 popularity 분포가 0 근처에 심하게 쏠려 있어 상위 20%에 해당하는 **threshold=60**을 채택했다. 그러나 이로 인해 **비인기:인기 = 약 8:1의 심각한 클래스 불균형**이 발생했고, 이 문제는 이후 실험 전반에 걸쳐 핵심 도전 과제가 되었다.

---

## 3. Methodology

### 3.1 전처리

- 중복 track_id 제거, 결측치 행 삭제 (전체의 ~0.1%)
- duration_ms → duration_min 변환 (해석 용이성)
- **Train : Validation : Test = 6 : 2 : 2** (stratified split, 클래스 비율 유지)
- Logistic Regression에는 StandardScaler 적용; 트리 계열은 스케일링 불필요

### 3.2 모델 선택과 그 이유

**[Baseline] Logistic Regression**
가장 단순한 선형 분류기를 baseline으로 선택했다. 선형 모델의 한계가 비선형 모델 도입의 필요성을 정량적으로 입증하는 역할을 한다. class_weight='balanced'를 적용해 클래스 불균형을 보정했다.

**Random Forest**
여러 결정 트리의 예측을 앙상블하여 과적합을 줄이면서 비선형 패턴을 학습하는 모델이다. Feature importance를 통해 어떤 오디오 특성이 인기와 연관되는지 해석할 수 있다는 점에서 선택했다. class_weight='balanced' 적용.

**XGBoost**
Gradient boosting 방식으로 이전 트리가 틀린 샘플에 집중하여 순차적으로 성능을 개선한다. 클래스 불균형 대응을 위해 scale_pos_weight(= 비인기 수 / 인기 수)를 설정하여 소수 클래스(인기곡)에 더 큰 가중치를 부여했다. 또한 RandomizedSearchCV를 통한 체계적인 하이퍼파라미터 탐색을 수행했다.

### 3.3 클래스 불균형 문제 발견 및 대응

실험 초기, Logistic Regression의 Accuracy가 0.89임에도 **F1 score가 0.0000**이 나오는 현상을 관찰했다. 이는 모델이 모든 샘플을 "비인기곡"으로 예측할 때 발생하는 전형적인 **다수 클래스 편향**이다. Accuracy만 보면 89%로 좋아 보이지만, 실제로는 아무것도 학습하지 않은 것이다. 이 발견을 계기로 모든 모델에 클래스 불균형 보정을 도입하였다.

### 3.4 하이퍼파라미터 튜닝

RandomizedSearchCV (n_iter=20, cv=3, scoring='f1')로 탐색했으며, F1 score를 최적화 기준으로 삼은 이유는 클래스 불균형 상황에서 Accuracy보다 F1이 모델의 실질적 성능을 더 잘 반영하기 때문이다.

**Best XGBoost 파라미터:**
```
subsample=0.7, n_estimators=300, min_child_weight=5,
max_depth=9, learning_rate=0.05, colsample_bytree=0.8
```

---

## 4. Experiments & Results

### 4.1 성능 비교

| Model | Test Acc | Test F1 | Test AUC |
|-------|----------|---------|----------|
| Logistic Regression | 0.5429 | 0.2423 | 0.6435 |
| Random Forest (default) | 0.8875 | 0.0734 | 0.7180 |
| Random Forest (tuned) | 0.6166 | 0.2770 | 0.7026 |
| XGBoost (default) | 0.7652 | 0.2749 | 0.7010 |
| **XGBoost (tuned)** | 0.7453 | **0.2938** | **0.7216** |

### 4.2 Feature Importance (XGBoost 기준)

상위 피처: **explicit(0.14) > instrumentalness(0.10) > loudness(0.08) > acousticness(0.08)**

---

## 5. Analysis & Discussion

### 5.1 왜 XGBoost (tuned)가 가장 좋았나?

F1(0.2938)과 AUC(0.7216) 두 지표 모두에서 XGBoost tuned가 가장 우수했다. 이는 다음 두 가지 요인으로 설명할 수 있다.

첫째, **비선형 상호작용 포착**: Logistic Regression(AUC=0.6435)과의 격차는 오디오 피처 간 비선형 관계가 존재함을 시사한다. 예를 들어 loudness가 높더라도 acousticness가 함께 높으면 다른 패턴이 형성된다. 선형 모델은 이를 포착하지 못한다.

둘째, **소수 클래스 집중**: scale_pos_weight를 통해 인기곡 오분류에 더 높은 패널티를 부여함으로써, 다수 클래스에만 편향되는 문제를 완화했다. 이는 Random Forest (default)의 F1(0.0734)과 XGBoost (tuned)의 F1(0.2938) 차이에서 잘 드러난다.

### 5.2 주목할 만한 발견: explicit이 1위 피처

Feature Importance에서 **explicit(선정적 가사 여부)이 1위 피처**로 나타난 것은 흥미로운 결과다. 이는 순수한 음향 특성이 아닌 콘텐츠 특성이 인기와 강하게 연관됨을 의미한다. 실제로 현대 스트리밍 시장에서 힙합·R&B 장르가 높은 스트리밍 수를 기록하는 트렌드와 일치한다.

반면 **instrumentalness(보컬 없는 정도)가 2위**를 차지한 것은 보컬이 없는 곡(클래식, 재즈, 환경음악 등)이 비인기곡으로 분류되는 경향이 강하다는 것을 뜻한다. 즉, "대중적 인기 = 보컬이 있는 곡"이라는 패턴이 데이터에 반영되어 있다.

### 5.3 실패 케이스 분석

**Val-Test F1 격차**: XGBoost tuned의 Val F1(0.5931)과 Test F1(0.2938) 사이의 큰 격차는 하이퍼파라미터 탐색 과정에서의 과적합을 나타낸다. RandomizedSearchCV가 validation set에 과도하게 최적화된 파라미터를 선택했을 가능성이 있다.

**낮은 전반적 F1 (최고 0.29)의 근본 원인**: 오디오 피처만으로는 인기를 충분히 설명하지 못한다는 것이 핵심이다. 동일한 오디오 특성을 가진 두 곡이 완전히 다른 인기를 가질 수 있다 — 한 곡은 유명 아티스트가, 다른 곡은 신인이 만든 경우처럼. 이러한 **오디오 외 요인의 부재**가 학습 난이도를 근본적으로 높인다.

**어떤 샘플이 어려운가**: popularity 45~65 구간의 '경계선상' 곡들에서 오분류가 집중된다. 이진 분류 자체의 한계로, 연속적인 popularity를 하나의 선으로 나누는 것이 본질적으로 어렵다.

### 5.4 결과가 배포에 충분한가?

현재 F1=0.2938, AUC=0.7216은 실제 배포에는 부족하다. 그러나 이 결과는 중요한 사실을 시사한다: **오디오 피처만으로도 랜덤(AUC=0.5)보다 유의미하게 높은 예측이 가능하다.** 아티스트 정보, 마케팅 데이터, 출시 시기 등을 추가하면 실용적인 수준에 도달할 수 있을 것으로 기대된다.

---

## 6. Conclusion

본 프로젝트는 Spotify 오디오 피처만으로 인기곡을 예측하는 ML 파이프라인을 구축하고, Logistic Regression → Random Forest → XGBoost의 성능을 체계적으로 비교했다. 실험 과정에서 클래스 불균형 문제를 발견하고 class_weight / scale_pos_weight로 대응하는 과정 자체가 중요한 학습이었다. 최종적으로 XGBoost (tuned)가 F1=0.2938, AUC=0.7216으로 가장 우수한 성능을 보였으며, explicit과 instrumentalness가 가장 중요한 예측 인자로 분석됐다.

---

## 7. Future Work

1. **아티스트 인지도 피처 추가**: 팔로워 수, 이전 곡 평균 인기도 → 가장 효과적일 것으로 기대
2. **출시 트렌드 반영**: 연도별로 인기 장르·피처가 달라지므로, 출시 연도를 피처로 추가
3. **장르별 분리 모델**: explicit 1위 결과에서 보듯 장르마다 인기 패턴이 다르므로 장르 내 분류 시도
4. **Regression으로 전환**: 이진 분류 대신 popularity 점수를 직접 예측하여 threshold 임의성 제거
5. **불균형 처리 고도화**: SMOTE 등 오버샘플링 기법 적용 후 성능 비교
6. **Raw audio 활용**: Mel-spectrogram + CNN으로 오디오 파일에서 직접 학습 (더 많은 자원 필요)

---

## References

- Pandya, M. (2023). Spotify Tracks Dataset. Kaggle. https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset
- Chen, T., & Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System. *KDD 2016*.
- Lundberg, S. M., & Lee, S. I. (2017). A Unified Approach to Interpreting Model Predictions. *NeurIPS 2017*.
- Breiman, L. (2001). Random Forests. *Machine Learning, 45*(1), 5–32.

---

## AI 활용 내역

본 프로젝트에서 Claude (Anthropic)를 다음 용도로 활용하였다:
- 전체 실험 코드 구조 설계 및 초안 생성
- 보고서 섹션 구성 및 문장 초안 제안

모든 실험의 실행, 결과 확인, 분석 및 해석, 클래스 불균형 문제 해결 과정은 직접 수행하였다. 코드 수정(class_weight, scale_pos_weight 적용) 및 결과 판단은 직접 결정하였다.
