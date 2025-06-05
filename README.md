# ScrollStop - Digital Detox App

Un'applicazione di benessere digitale progettata per rompere le abitudini di scrolling compulsivo attraverso una sfida personalizzata di 30 giorni.

## Tecnologie utilizzate
- React con TypeScript
- Tailwind CSS per il design responsivo
- Vite per il build tool
- Express.js per il backend
- localStorage per la persistenza dei dati

## Deployment su Netlify

### Prerequisiti
1. Account GitHub
2. Account Netlify
3. Git installato localmente

### Passaggi per il deployment

1. **Inizializza repository Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Crea repository su GitHub**
   - Vai su GitHub.com
   - Clicca "New repository"
   - Nomina il repository (es. "scrollstop-app")
   - Non aggiungere README, .gitignore o licenza

3. **Collega al repository GitHub**
   ```bash
   git remote add origin https://github.com/TUO-USERNAME/scrollstop-app.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy su Netlify**
   - Vai su netlify.com
   - Clicca "New site from Git"
   - Connetti GitHub
   - Seleziona il repository
   - Le impostazioni sono già configurate nel netlify.toml

## Sviluppo locale

```bash
npm install
npm run dev
```

## Build di produzione

```bash
npm run build
```