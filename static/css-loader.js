// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    GM.addStyle(await (await fetch('http://localhost:5000/dist/style.dev.user.css')).text());
})();

