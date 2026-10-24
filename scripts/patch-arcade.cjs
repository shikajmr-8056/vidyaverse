const fs = require('fs');

// 1. vite.config.ts
const vitePath = 'D:/repos/vidyaverse_games/apps/web/vite.config.ts';
let viteConfig = fs.readFileSync(vitePath, 'utf8');
if (!viteConfig.includes("base: './'")) {
  viteConfig = viteConfig.replace('defineConfig({', "defineConfig({\n  base: './',");
  fs.writeFileSync(vitePath, viteConfig, 'utf8');
  console.log('vite.config.ts updated');
}

// 2. main.tsx
const mainPath = 'D:/repos/vidyaverse_games/apps/web/src/main.tsx';
let mainTsx = fs.readFileSync(mainPath, 'utf8');
mainTsx = mainTsx.replace(/BrowserRouter/g, 'HashRouter');
fs.writeFileSync(mainPath, mainTsx, 'utf8');
console.log('main.tsx updated');

// 3. AppShell.tsx
const appShellPath = 'D:/repos/vidyaverse_games/apps/web/src/components/layout/AppShell.tsx';
let appShell = fs.readFileSync(appShellPath, 'utf8');
const searchStr = '  // Apply DOM tokens (theme + enlarged text mode) on mount';
const embedCode = `  // Detect if running embedded inside parent frame (VidyaVerse shell)
  const isEmbedded =
    typeof window !== 'undefined' &&
    (window.self !== window.top ||
      new URLSearchParams(window.location.search).get('embedded') === 'true' ||
      window.location.hash.includes('embedded=true'));

  if (isEmbedded) {
    return (
      <div className="flex h-screen w-full bg-canvas text-text-primary overflow-hidden transition-colors duration-200">
        <main
          className={\`flex-1 \${
            isWorkstation
              ? 'overflow-hidden flex flex-col p-0'
              : 'overflow-y-auto max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6'
          }\`}
          id="main-content"
        >
          <Outlet />
        </main>
      </div>
    );
  }
`;

if (!appShell.includes('const isEmbedded')) {
  appShell = appShell.replace(searchStr, embedCode + '\n' + searchStr);
  fs.writeFileSync(appShellPath, appShell, 'utf8');
  console.log('AppShell.tsx updated');
}
