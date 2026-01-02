# 토비의 클린 스프링: 도메인 모델 패턴과 헥사고날 아키텍처 Part 1

## 📚 강의 정보

- **강의명**: [토비의 클린 스프링 - 도메인 모델 패턴과 헥사고날 아키텍처 Part 1](https://www.inflearn.com/course/토비-클린스프링-도메인모델패턴-헥사고날-part1)
- **강사**: 이일민 (토비)
- **총 강의 시간**: 14시간 31분 (43개 강의)

## 🎯 학습 목표

- 도메인 모델 중심의 설계 및 개발 전략 습득
- DDD(Domain-Driven Design)의 다양한 패턴과 실천 방법
- 헥사고날 아키텍처의 특징과 효과, 적용 방법
- 다양한 테스트 기법 및 아키텍처 테스트 도구 활용
- 클린한 도메인 모델링
- 예외 처리 기법
- Aggregate를 활용한 모듈 구성

## 🏗️ 학습 방식

- 기존 Java/Spring으로 작성된 강의를 학습
- 학습한 내용을 TypeScript/NestJS로 전환하여 적용

## 🛠️ 기술 스택

- TypeScript
- Bun
- NestJS
- TypeORM
- bun:test
- PostgreSQL

## 📁 프로젝트 구조

```
.
├── splearn-java/         # Java/Spring 강의 코드
│   ├── src/
│   └── docs/
├── splearn-typescript/   # TypeScript/NestJS 전환 코드
│   ├── src/
│   └── docs/
└── README.md
```

## 📝 주요 학습 내용

### 1. 도메인 모델 중심 개발 전략
- DDD 핵심 원리와 패턴
- Ubiquitous Language를 활용한 의사소통
- 도메인 모델 문서화 (Markdown)

### 2. 헥사고날 아키텍처
- 핵심 개념과 계층 구조
- 인터페이스 구성 방법
- 환경 독립적인 테스트 작성

### 3. 계층 간 의존성 규칙
- 각 계층의 책임에 따른 기능 배치
- 코드 구조화 방법
- 높은 응집도와 유지보수성

### 4. Aggregate를 활용한 모듈 설계
- 불변식(Invariant) 발견 및 처리
- Aggregate Root 활용
- Repository 패턴

### 5. 도메인 모델과 엔티티
- ORM 기술의 특징과 목적
- 도메인 객체 생성 전략

### 6. 아키텍처 테스팅
- 테스트 코드 작성 전략
- 정적 분석 도구 활용
- 코드 안정성 및 일관성 향상

## 🔗 참고 자료

- [토비의 클린 스프링 로드맵](https://inf.run/Bbzks)
- [Hexagonal Architecture (Ports and Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design Reference](https://www.domainlanguage.com/ddd/reference/)
- [NestJS Documentation](https://docs.nestjs.com/)
