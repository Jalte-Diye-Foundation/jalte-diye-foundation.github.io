(function () {
    const host = window.location.hostname;
    const localHosts = ["localhost", "127.0.0.1", "::1"];

    if (!localHosts.includes(host)) {
        window.location.replace("../index.html");
    }
})();
