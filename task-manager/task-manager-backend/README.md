✅ Option 1 (Recommended): Expand rootDir

Change your tsconfig.json like this:

{
"compilerOptions": {
"target": "ES2020",
"module": "CommonJS",
"outDir": "dist",
"rootDir": ".",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true,
"resolveJsonModule": true
},
"include": ["src", "tests", "jest.config.ts"]
}

This tells TypeScript:

rootDir is your project root.

It should include your main code (src), tests, and the Jest config file.

✅ Works perfectly for most projects.

⚙️ Option 2: Move config inside src/

Move your config file into the src directory:

src/
├── jest.config.ts
├── index.ts
└── ...

Then update your Jest script in package.json:

"test": "jest --config ./src/jest.config.ts"

Not as clean, but avoids changing rootDir.

⚙️ Option 3: Ignore Jest config in TypeScript build

If you don’t want TypeScript to even process Jest configs:

{
"compilerOptions": {
...
},
"exclude": ["node_modules", "dist", "jest.config.ts"]
}

This simply ignores it — Jest still works fine because it uses ts-jest to handle .ts configs.

🧩 Bonus Tip:

Make sure you have these dev dependencies installed:

npm install --save-dev jest ts-jest @types/jest typescript

And initialize Jest for TypeScript:

npx ts-jest config:init

✅ Recommended Setup (clean & maintainable)

Here’s the clean structure for a backend using Jest + TypeScript:

task-manager-backend/
├── src/
│ ├── index.ts
│ ├── routes/
│ └── services/
├── tests/
│ ├── setup.ts
│ └── example.test.ts
├── jest.config.ts
├── tsconfig.json
└── package.json

And your jest.config.ts:

import type { Config } from 'jest';

const config: Config = {
preset: 'ts-jest',
testEnvironment: 'node',
verbose: true,
setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

export default config;

✅ Then npm test will just work.

npm test
