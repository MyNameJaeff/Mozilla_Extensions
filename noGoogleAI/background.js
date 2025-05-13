chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        let url = new URL(details.url);
        if (url.hostname.includes("google.com") && url.pathname === "/search") {
            let params = url.searchParams;
            let query = params.get("q");
            if (query && !query.includes("-ai")) {
                params.set("q", query + " -ai");
                url.search = params.toString();
                return { redirectUrl: url.toString() };
            }
        }
    },
    { urls: ["*://www.google.com/search*"] },
    ["blocking"]
);
