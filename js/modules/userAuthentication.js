define([
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager"
], (OAuthInfo, esriId) => {

    const userAuthenticationModule = [];

    const info = new OAuthInfo({
        appId: "ewP4KhzNqP19llp8",
        portalUrl: "https://cobecconsulting.maps.arcgis.com",
        authNamespace: "portal_oauth_inline",
        flowType: "auto",
        popup: false
    });

    userAuthenticationModule.authenticateUser = () => {
        esriId.registerOAuthInfos([info]);
        esriId.getCredential(info.portalUrl + "/sharing");
        esriId.checkSignInStatus(info.portalUrl + "/sharing")
            .then(() => {
                console.log("Sign In Successful.");
            }).catch(() => {
                console.log("User not signed in.")
            });
    };

    return userAuthenticationModule;

});