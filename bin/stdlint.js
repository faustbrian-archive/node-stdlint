const { ESLint } = require("eslint");
const { existsSync } = require("fs");
const { resolve } = require("path");

(async function main() {
	// 1. Create an instance with the `fix` option.
	const eslint = new ESLint({
		cwd: resolve(__dirname, ".."),
		baseConfig: require(resolve(__dirname, ".eslintrc.js")),
		fix: true,
		ignorePath: resolve(__dirname, ".eslintignore"),
	});

    // 2. Determine paths to process
    const paths = [];

    if (existsSync(resolve(process.cwd(), "source"))) {
        paths.push(resolve(process.cwd(), "source/**/*.ts"));
    }

    if (existsSync(resolve(process.cwd(), "test"))) {
        paths.push(resolve(process.cwd(), "test/**/*.ts"));
    }

	// 3. Lint files. This doesn't modify target files.
	const results = await eslint.lintFiles(paths);

	// 4. Modify the files with the fixed code.
	await ESLint.outputFixes(results);

	// 5. Format the results.
	const formatter = await eslint.loadFormatter("stylish");
	const resultText = formatter.format(results);

	// 6. Output it.
	console.log(resultText);
})().catch((error) => {
	process.exitCode = 1;
	console.error(error);
});
