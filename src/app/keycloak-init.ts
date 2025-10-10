import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
    return async () => {
        try {
            console.log('Initializing Keycloak...');
            await keycloak.init({
                config: {
                    url: 'http://localhost:8080',
                    realm: 'demo',
                    clientId: 'retail-app'
                },
                initOptions: {
                    onLoad: 'login-required',
                    checkLoginIframe: false,
                    pkceMethod: 'S256',
                    responseMode: 'fragment'
                },
                enableBearerInterceptor: true,
                bearerExcludedUrls: ['/assets']
            });
            console.log('Keycloak initialized successfully!');
        } catch (error) {
            console.error('Keycloak initialization failed', error);
        }
    };
}
