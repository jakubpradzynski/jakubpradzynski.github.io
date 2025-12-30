# Jakub Prądzyński - Strona Osobista (Placeholder)

Prosta, animowana strona typu "W budowie" (Under Construction) dla domeny [jakubpradzynski.pl](https://jakubpradzynski.pl).

## Technologie

Projekt wykorzystuje **Vite** jako narzędzie budujące oraz React.

- **React**
- **Vite**
- **Framer Motion** (Animacje)
- **Tailwind CSS** (via CDN)
- **Lucide React** (Ikony)

## Uruchomienie lokalne

Wymagany Node.js.

1. Zainstaluj zależności:
```bash
npm install
```

2. Uruchom serwer deweloperski:
```bash
npm run dev
```

3. Otwórz stronę pod adresem wskazanym w terminalu (zazwyczaj `http://localhost:5173`).

## Budowanie i Deployment

Projekt posiada skonfigurowany workflow GitHub Actions w pliku `.github/workflows/pages-deploy.yml`.

Aby zbudować wersję produkcyjną lokalnie:
```bash
npm run build
```
Pliki wynikowe pojawią się w folderze `dist`.