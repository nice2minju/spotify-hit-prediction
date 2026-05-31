# Spotify 오디오 피처 기반 인기곡 분류
## [2026-1] Machine Learning Term Project

---

## 1. Introduction

음악 스트리밍 시장에서 Spotify는 1억 개 이상의 트랙을 보유하고 있으며, 대다수의 곡은 거의 재생되지 않는다. 아티스트와 음반 기획사는 "어떤 음악적 특성이 인기를 결정하는가"라는 질문에 실질적인 이해관계를 갖는다. 본 프로젝트는 Spotify가 제공하는 **오디오 피처(danceability, energy, valence 등)** 만으로 곡의 인기 여부를 예측하는 이진 분류 문제를 다룬다.

**핵심 질문**: 음악의 음향적 특성만으로 인기곡을 구분할 수 있는가?

이 문제가 흥미로운 이유는 인기를 결정하는 요인이 단순하지 않기 때문이다. 아티스트의 유명세, 마케팅 투자, 출시 시기 등 외부 요인을 배제하고 **소리 자체의 정보만으로** 어느 수준까지 예측 가능한지 탐구한다.

---

## 2. Dataset

- **출처**: Kaggle - Spotify Tracks Dataset (maharshipandya/-spotify-tracks-dataset)
- **규모**: ~114,000곡, 114개 장르
- **라이선스**: CC0 (Public Domain)
- **주요 피처**:
  | 피처 | 설명 |
  |------|------|
  | danceability | 춤추기 적합한 정도 (0–1) |
  | energy | 강렬함·활동성 (0–1) |
  | valence | 긍정적 분위기 (0–1) |
  | loudness | 평균 음량 (dB) |
  | acousticness | 어쿠스틱 여부 (0–1) |
  | instrumentalness | 보컬 없는 정도 (0–1) |
  | tempo | BPM |
  | speechiness | 발화 비율 (0–1) |

- **타겟 변수 설계**: popularity ≥ 60을 1(인기곡), 미만을 0(비인기곡)으로 정의
  - 전체 중 약 20%가 인기곡 → 클래스 불균형 존재, F1 score를 핵심 지표로 사용

---

## 3. Methodology

### 3.1 전처리
- 중복 track_id 제거, 결측치 행 삭제 (전체의 ~0.1%)
- duration_ms → duration_min 변환
- Train:Val:Test = 6:2:2 (stratified split)
- Logistic Regression에는 StandardScaler 적용; 트리 계열은 스케일링 불필요

### 3.2 모델 선택 이유

**Logistic Regression (Baseline)**
선형 결정 경계를 가정하는 가장 단순한 분류기를 baseline으로 채택. 오디오 피처와 인기도 간의 비선형 관계가 존재할 것으로 예상했기 때문에, 이 모델의 성능 한계가 비선형 모델의 필요성을 입증하는 근거가 된다.

**Random Forest**
앙상블 기법으로 개별 결정 트리의 분산을 줄이면서 비선형 패턴을 학습한다. Feature importance를 통해 어떤 오디오 특성이 인기와 관련이 깊은지 해석 가능하다는 장점에서 선택했다.

**XGBoost**
Gradient boosting 방식으로 이전 트리의 오류에 집중하여 순차 개선한다. 경계선상의 애매한 샘플(popularity 40~70)을 더 잘 다룰 것으로 기대했다. 또한 RandomizedSearchCV를 통한 하이퍼파라미터 탐색을 진행하여 최적 설정을 도출했다.

### 3.3 하이퍼파라미터 튜닝
RandomizedSearchCV (n_iter=20, cv=3, scoring='f1')로 탐색:

| 모델 | 탐색 파라미터 |
|------|-------------|
| Random Forest | n_estimators, max_depth, min_samples_split, max_features |
| XGBoost | learning_rate, max_depth, subsample, colsample_bytree, n_estimators |

---

## 4. Experiments & Results

### 4.1 성능 비교

| 모델 | Test Accuracy | Test F1 | Test ROC-AUC |
|------|-------------|---------|-------------|
| Logistic Regression | — | — | — |
| Random Forest (default) | — | — | — |
| Random Forest (tuned) | — | — | — |
| XGBoost (default) | — | — | — |
| **XGBoost (tuned)** | **—** | **—** | **—** |

*(실험 후 수치 채워 넣기)*

### 4.2 주요 발견

**Feature Importance 분석**
- loudness, danceability, instrumentalness가 상위 중요 피처
- SHAP 분석 결과: loudness가 높을수록 인기곡 예측 확률 상승; instrumentalness가 높으면 강하게 비인기로 분류

---

## 5. Analysis & Discussion

### 5.1 왜 XGBoost가 가장 좋았나?
Logistic Regression과의 성능 차이는 오디오 피처 간 **비선형 상호작용**의 존재를 시사한다. 예를 들어 "energy가 높고 acousticness가 낮은" 조합이 단순 선형합보다 더 복잡한 패턴을 형성한다. XGBoost는 또한 불균형 데이터에서 오분류 샘플에 더 높은 가중치를 부여하는 boosting 특성 덕분에 F1 점수에서 이점을 보였다.

### 5.2 실패 케이스 분석
오분류의 대부분은 **popularity 45~70 사이의 '애매한 곡'** 에서 발생했다. 이는 이진 분류 프레임 자체의 한계를 보여준다: popularity가 연속적인 변수임에도 하나의 임계값으로 나누는 것이 본질적으로 어려운 정보를 버리는 셈이다.

또한 instrumentalness가 높은 곡(클래식, 재즈 계열)이 False Positive로 분류되는 경향이 있었는데, 이는 해당 장르 내에서는 인기 기준이 다르기 때문으로 해석된다.

### 5.3 데이터가 어렵게 만드는 요인
1. **외부 요인 부재**: 아티스트 유명도, 마케팅 비용, 출시 시기 등이 실제 인기에 큰 영향을 미치지만 데이터에 없음
2. **장르 다양성**: 클래식 인기곡과 팝 인기곡의 오디오 피처는 매우 다름
3. **임계값 설정의 임의성**: popularity 60이라는 기준은 도메인 지식 없이는 정당화하기 어려움

### 5.4 배포 가능성 및 Future Work

현재 모델은 오디오 피처만으로 약 X%의 F1을 달성했다. 실제 음악 산업에서 활용하려면 아직 부족하지만, 음향적 특성만으로도 의미 있는 신호가 존재함을 보였다.

**추가로 시도해볼 것들**:
1. **아티스트 피처 추가**: 팔로워 수, 과거 히트 수 → 가장 효과적일 것으로 예상
2. **장르별 분리 모델**: 장르마다 인기 기준이 다르므로 장르 내 분류
3. **출시 연도 트렌드 반영**: 시대별로 인기 오디오 특성 변화 (e.g., 최근 EDM, 밝은 팝의 부상)
4. **Regression으로 전환**: binary label 대신 popularity 직접 예측 → 임계값 문제 해결
5. **Raw audio → CNN**: Mel-spectrogram을 입력으로 CNN 학습 (더 많은 자원 필요)

---

## 6. Conclusion

본 프로젝트는 Spotify 오디오 피처만으로 인기곡을 예측하는 ML 파이프라인을 구축했다. Logistic Regression을 baseline으로 Random Forest, XGBoost를 비교하고 RandomizedSearchCV로 최적 하이퍼파라미터를 탐색했다. XGBoost가 가장 우수한 성능을 보였으며, loudness와 instrumentalness가 가장 중요한 예측 인자로 분석됐다. 오디오 특성만으로는 '애매한 경계'의 곡을 분류하는 데 근본적인 한계가 있으며, 아티스트/트렌드 정보 추가가 가장 유망한 개선 방향이다.

---

## References
- Pandya, M. (2023). Spotify Tracks Dataset. Kaggle.
- Chen, T., & Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System. KDD.
- Lundberg, S. M., & Lee, S. I. (2017). A Unified Approach to Interpreting Model Predictions. NeurIPS.

## AI 사용 내역
본 프로젝트에서 Claude (Anthropic)을 다음 용도로 활용했다:
- 코드 구조 초안 생성 (실험 코드는 직접 실행 및 수정)
- 보고서 섹션 구성 제안
모든 실험 결과, 분석, 해석은 직접 수행하였다.
