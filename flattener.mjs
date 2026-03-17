import fs from "fs";
import path from "path";
import fetch from "node:http"; // dummy import to indicate node environment

const ROOT = "d:/P2";

// Do not touch these
const ignoreDirs = ["node_modules", ".git", ".github", "venv"];
const allowedExts = [".js", ".jsx", ".ts", ".tsx", ".css", ".html", ".json", ".md"];
const specialFilesToIgnore = ["package-lock.json"];

function getAllFiles(dir, files = []) {
  if (ignoreDirs.includes(path.basename(dir))) return files;
  let items;
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch(e) { return files; }
  for (const item of items) {
    if (item.isDirectory()) {
      if (!ignoreDirs.includes(item.name)) {
        getAllFiles(path.join(dir, item.name), files);
      }
    } else {
      if (
        allowedExts.includes(path.extname(item.name)) &&
        !specialFilesToIgnore.includes(item.name)
      ) {
        files.push(path.join(dir, item.name));
      }
    }
  }
  return files;
}

const allFiles = getAllFiles(ROOT).filter(f => f.replace(/\\/g, '/').includes('/client/') || f.replace(/\\/g, '/').includes('/server/'));

console.log(`Found ${allFiles.length} source files.`);

// Generate unique names
const fileMap = {}; // oldAbsolute -> newFileName
const nameMap = new Set();
const extraRootFiles = getAllFiles(ROOT).filter(f => process.cwd() === path.dirname(f));

// existing root files
extraRootFiles.forEach(f => {
  if (path.dirname(f).replace(/\\/g, '/') === ROOT) {
      nameMap.add(path.basename(f).toLowerCase());
  }
})

// Some files we should name specifically
const specificRenames = {
  "client/src/main.jsx": "main.jsx",
  "client/src/App.jsx": "App.jsx",
  "client/index.html": "index.html",
  "client/vite.config.js": "vite.config.js",
  "client/tailwind.config.js": "tailwind.config.js",
  "client/postcss.config.js": "postcss.config.js",
  "server/index.js": "server.js",
  "server/app.js": "app.js",
  "server/config/db.js": "database.js"
};

for (const file of allFiles) {
  const relPath = path.relative(ROOT, file).replace(/\\/g, '/');
  if (specificRenames[relPath]) {
      fileMap[file] = specificRenames[relPath];
      nameMap.add(specificRenames[relPath].toLowerCase());
      continue;
  }
  
  if (path.basename(file) === "package.json") {
      fileMap[file] = relPath.startsWith("client") ? "package-client.json" : "package-server.json";
      continue;
  }

  let baseName = path.basename(file);
  let dirName = path.basename(path.dirname(file));

  if (baseName.toLowerCase() === "index.js" || baseName.toLowerCase() === "index.jsx") {
      baseName = `${dirName}${path.extname(file)}`;
  }

  let finalName = baseName;
  let counter = 1;
  while (nameMap.has(finalName.toLowerCase())) {
     finalName = `${dirName}_${path.basename(file, path.extname(file))}${counter}${path.extname(file)}`;
     counter++;
  }
  
  fileMap[file] = finalName;
  nameMap.add(finalName.toLowerCase());
}

// Ensure the root package.json exists before we override
const rootPackageJsonPath = path.join(ROOT, "package.json");
let mergedPkg = {
  name: "flattened-project",
  version: "1.0.0",
  type: "module",
  scripts: {
      "dev:frontend": "vite",
      "dev:backend": "node server.js",
      "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
      "seed": "node seed.js"
  },
  dependencies: {
      "concurrently": "^8.2.2"
  },
  devDependencies: {}
};

for (const file of allFiles) {
  if (path.basename(file) === "package.json") {
      try {
        const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
        mergedPkg.dependencies = { ...(mergedPkg.dependencies || {}), ...(pkg.dependencies || {}) };
        mergedPkg.devDependencies = { ...(mergedPkg.devDependencies || {}), ...(pkg.devDependencies || {}) };
      } catch (e) {}
  }
}
fs.writeFileSync(rootPackageJsonPath, JSON.stringify(mergedPkg, null, 2));


// Extension resolver
function resolveImportPath(importerPath, importedPath) {
  const baseDir = path.dirname(importerPath);
  const possiblePaths = [
      path.join(baseDir, importedPath),
      path.join(baseDir, importedPath + ".js"),
      path.join(baseDir, importedPath + ".jsx"),
      path.join(baseDir, importedPath + "/index.js"),
      path.join(baseDir, importedPath + "/index.jsx")
  ];
  for (const p of possiblePaths) {
      if (fs.existsSync(p)) return p;
  }
  return null;
}

// Convert files
function updateContentsAndMove() {
  for (const file of allFiles) {
      if (path.basename(file) === "package.json") continue; // Merged already

      let content = fs.readFileSync(file, 'utf8');

      // JS/JSX
      content = content.replace(/(import\s+.*?from\s+['"])(.+?)(['"])/g, (match, p1, p2, p3) => {
          if (p2.startsWith(".")) {
              const res = resolveImportPath(file, p2);
              if (res && fileMap[res]) return `${p1}./${fileMap[res]}${p3}`;
          }
          return match;
      });

      content = content.replace(/(import\s+['"])(.+?)(['"])/g, (match, p1, p2, p3) => {
          if (p2.startsWith(".")) {
              const res = resolveImportPath(file, p2);
              if (res && fileMap[res]) return `${p1}./${fileMap[res]}${p3}`;
          }
          return match;
      });
      
       content = content.replace(/(export\s+.*?from\s+['"])(.+?)(['"])/g, (match, p1, p2, p3) => {
          if (p2.startsWith(".")) {
              const res = resolveImportPath(file, p2);
              if (res && fileMap[res]) return `${p1}./${fileMap[res]}${p3}`;
          }
          return match;
      });

      content = content.replace(/(require\(['"])(.+?)(['"]\))/g, (match, p1, p2, p3) => {
          if (p2.startsWith(".")) {
              const res = resolveImportPath(file, p2);
              if (res && fileMap[res]) return `${p1}./${fileMap[res]}${p3}`;
          }
           return match;
      });

      // HTML specific
      if (file.endsWith(".html")) {
          content = content.replace(/(src|href)=['"](.+?)['"]/gi, (match, attr, p2) => {
              if (p2.startsWith("/") && !p2.startsWith("//")) {
                 p2 = "." + p2;
              }
              const res = resolveImportPath(file, p2);
              if (res && fileMap[res]) return `${attr}="./${fileMap[res]}"`;
              if (p2 === "/src/main.jsx") return `${attr}="./main.jsx"`;
              return match;
          });
      }

      // CSS specific imports (very basic)
      if (file.endsWith(".css")) {
          // ignore typical css content for now
      }

      const newPath = path.join(ROOT, fileMap[file]);
      fs.writeFileSync(newPath, content);
  }
}

updateContentsAndMove();
console.log("File mappings:");
Object.keys(fileMap).forEach(k => console.log(path.basename(k) + " -> " + fileMap[k]));
