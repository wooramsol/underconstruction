# wooramsol.com — 사이트 작업 기준

Ramsol's Repository 포트폴리오 사이트의 기본 규칙입니다. 새 프로젝트를 추가하거나 사이트를 수정할 때 이 문서를 기준으로 합니다. (사람이든 AI든 작업 전에 먼저 읽어주세요.)

GitHub Pages로 배포됩니다. `main` 브랜치에 push하면 wooramsol.com에 1~2분 안에 반영됩니다. 로컬 폴더와 GitHub는 항상 같은 상태로 유지합니다.

---

## 1. 이미지 기준

### 상세 페이지 이미지 (`프로젝트폴더/1.webp, 2.webp …`)

- **크기: 가로 최대 1200px, 세로 최대 1600px** (비율 유지, 이보다 작으면 그대로)
- **형식: WebP, 품질 82**
- 사진 회전 정보(EXIF)는 저장 전에 반영합니다.
- 파일명은 `1.webp`부터 순서대로 붙입니다. 상세 페이지에 이 순서대로 배치됩니다.

**왜 1200px인가:** 상세 페이지는 데스크톱 2열 Masonry, 모바일 1열입니다.

| 화면 | 이미지 표시 폭 | 픽셀 밀도 | 필요한 해상도 |
|---|---|---|---|
| 데스크톱 2열 | 약 490px | 2배 (레티나) | 약 980px |
| 모바일 1열 | 약 370px | 3배 (아이폰) | 약 1110px |

두 경우를 다 덮고 약간의 여유를 둔 값이 1200px입니다.
**레이아웃을 바꾸면 이 기준도 다시 계산해야 합니다.** 예를 들어 데스크톱을 1열(최대 1000px)로 바꾸면 약 2000px가 필요하고, 3열로 바꾸면 1200px도 넉넉합니다.

### 메인페이지 썸네일 (`프로젝트폴더/t_1.webp …`)

- 메인 이미지로 쓰는 원본마다 **높이 600px** 썸네일을 `t_` 접두어로 따로 만듭니다. 품질은 80입니다.
- 화면에는 높이 300px로 보이므로 레티나에서도 선명합니다.
- `index.html`의 `THUMBS` 목록에 `'폴더/원본.webp': ['폴더/t_원본.webp', 가로, 600]` 형식으로 등록합니다. 원본 대신 썸네일이 로드되고, 크기 정보 덕분에 로딩 중에 화면이 밀리지 않습니다.

### 메인 영상 (자동재생)

- **형식: mp4 (H.264), 무음, 높이 600px, 30fps, CRF 30**, `+faststart`
- 길이는 보통 앞 30초입니다. 짧은 영상은 끝까지 씁니다.
- 첫 장면을 `poster.webp`(높이 600px)로 같이 저장합니다. 영상이 로드되기 전이나 자동재생이 막힌 환경(예: 아이폰 저전력 모드)에서 이 이미지가 보입니다.
- 결과는 보통 0.4~1MB입니다. GIF는 쓰지 않습니다. 같은 길이면 10MB 이상 나옵니다.
- 영상은 화면에 들어올 때만 로드·재생되고, 화면 밖으로 나가면 일시정지합니다(`setupLazyVideos`).

```bash
ffmpeg -i 원본.mov -t 30 -an -vf "scale=-2:600,fps=30" -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -crf 30 -preset slow -movflags +faststart 폴더/main.mp4
ffmpeg -ss 2 -i 원본.mov -frames:v 1 -vf "scale=-2:600" -q:v 80 폴더/poster.webp
```

---

## 2. 새 프로젝트 추가하기

1. 프로젝트 폴더를 만듭니다. 폴더 이름은 소문자와 밑줄을 씁니다(예: `ad_hoc_lamp`).
2. 이미지를 위 기준으로 변환해 넣습니다. 메인 이미지로 쓸 것은 `t_` 썸네일도 만듭니다.
3. 상세 페이지가 필요하면 **`_project_template.html`을 복사**해서 `폴더이름.html`로 만듭니다.
   - 제목, 설명, 이미지 목록을 채웁니다.
   - 각 `<img>`에는 실제 `width`/`height`와 `loading="lazy"`를 넣습니다. Masonry 배치에 필요합니다.
4. `index.html`의 `projectData` 맨 위에 항목을 추가합니다.

```js
// 사이트 안의 상세 페이지로 이동하는 프로젝트
{ folder: 'ad_hoc_lamp', title: 'Ad Hoc Lamp', images: ['1.webp', '2.webp'], main: 0, desc: `본문` },

// 외부 링크(앱, 유튜브 등)로 이동하고 메인에 영상을 쓰는 프로젝트
{ folder: 'blinktype', title: 'BlinkType', link: 'https://…', images: ['main.mp4'],
  poster: 'poster.webp', mediaSize: [가로, 600], main: 0, desc: `본문` },
```

- `images`: 메인에 보일 이미지/영상 파일들
- `main`: 모바일에서 보여줄 대표 이미지의 순번(0부터)
- `link`: 있으면 썸네일 클릭 시 그 주소로 새 탭에서 이동하고, 없으면 `폴더이름.html`로 이동합니다.
- `desc`: 줄바꿈은 `\n`입니다. 링크는 `<a href="…" target="_blank" rel="noopener">…</a>`로 넣습니다.
- 본문 끝 데모 링크는 한 줄 띄우고 `Demo: 링크` 형식으로 씁니다.

5. **`node build.js`를 실행합니다.** 메인페이지 프로젝트 목록을 `index.html`에 HTML로 미리 써 넣는 단계입니다. 검색엔진과 링크 미리보기가 JS 없이도 프로젝트를 읽을 수 있게 해줍니다. 빠뜨려도 화면은 정상으로 보이지만(JS가 다시 그림), 검색에는 옛 목록이 노출됩니다.
6. 상세 페이지를 만들었다면 **`og.jpg`**(1200×630, 대표 이미지를 잘라서 JPEG 품질 82)를 프로젝트 폴더에 넣고, **`sitemap.xml`**에 주소를 추가합니다.

---

## 3. SEO 기준

목표는 **이름 검색 시 이 사이트가 뜨는 것**입니다. 키워드: Ramsol, Ramsol Jeong, wooramsol, 람솔, 정우람솔, 우람솔, Inventor, Product Designer.

- **메인페이지**: 제목·설명·Open Graph·`Person` 구조화 데이터(JSON-LD, 이름 별칭과 SNS 링크 포함)가 들어 있습니다. 화면 상단에는 "Ramsol Jeong · 정우람솔 · Inventor & Product Designer" 한 줄이 보입니다. SNS 계정이 늘면 JSON-LD의 `sameAs`에 추가합니다.
- **모든 페이지 `<head>`**: `viewport`, `description`, `canonical`, `og:*`(이미지는 `og.jpg`), 파비콘. 제목 형식은 `프로젝트명 — Ramsol Jeong (정우람솔), Product Designer`입니다.
- **이미지 alt**: `프로젝트명 by Ramsol Jeong — image N`
- **`sitemap.xml` / `robots.txt`**: 새 페이지를 만들면 sitemap에 추가합니다.
- **검색엔진 등록**: Google Search Console과 네이버 서치어드바이저에 `https://wooramsol.com/sitemap.xml`을 제출해둡니다.

---

## 4. 레이아웃 규칙

- **메인페이지 (데스크톱):** 이미지(높이 300px) 옆에 텍스트가 붙습니다. 텍스트는 남은 폭에 맞춰 줄이 바뀝니다. 텍스트 칸이 220px보다 좁아지면 이미지가 비율을 유지하며 작아집니다. 텍스트가 이미지 아래로 내려가거나 화면 밖으로 나가지 않습니다.
- **메인페이지 (모바일, 폭 850px 이하):** 대표 이미지 1장 → 텍스트, 세로 1열입니다.
- **상세 페이지:** 데스크톱은 2열 Masonry(`gallery.css` + `gallery.js`)로, 위에서부터 읽는 순서를 유지합니다. 모바일(폭 600px 이하)은 1열입니다.
- 폰트는 Arial(시스템 폰트)입니다. `fonts/`의 Coral Pixels는 보관용이고 현재 쓰지 않습니다.

---

## 5. 소프트웨어 프로젝트

앱 자체는 각자의 GitHub 레포에서 관리하고 GitHub Pages로 배포합니다(예: `wooramsol/blinktype`). 이 사이트에는 썸네일·영상과 소개 글만 두고, `link`로 앱 주소에 연결합니다.

---

## 6. 보안 메모

- Open Diary 글·댓글은 화면에 넣기 전에 `escapeHtml`로 처리합니다. 사용자 입력을 `innerHTML`에 그대로 넣지 않습니다.
- Open Diary의 삭제·수정은 Firestore 규칙으로 막혀 있습니다. 삭제는 Firebase 콘솔에서 합니다.
- 개인 문서(신분증 등) 이미지는 이 레포에 올리지 않습니다. 레포는 공개되어 있고 git 기록에도 남습니다.
- 외부 링크에는 항상 `rel="noopener"`를 붙입니다.
