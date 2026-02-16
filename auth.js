// Wedding Website Authentication
// Guests access via URL: https://anasandnabiha.us/?key=YOURPASSWORD

// Hide content immediately to prevent flash
document.documentElement.style.visibility = 'hidden';

(function() {
    'use strict';
    
    // Set your wedding password here
    const WEDDING_PASSWORD = 'anabiha2026';
    
    // Check if user has access
    function checkAuthentication() {
        // Check URL parameters for the key
        const urlParams = new URLSearchParams(window.location.search);
        const keyParam = urlParams.get('key');
        
        // If key is in URL and correct, store authentication
        if (keyParam === WEDDING_PASSWORD) {
            sessionStorage.setItem('weddingAuth', 'true');
            // Remove key from URL but keep other parameters
            urlParams.delete('key');
            const remainingParams = urlParams.toString();
            const cleanUrl = window.location.origin + window.location.pathname + 
                (remainingParams ? '?' + remainingParams : '');
            window.history.replaceState({}, document.title, cleanUrl);
            return true;
        }
        
        // Check if already authenticated in this session
        if (sessionStorage.getItem('weddingAuth') === 'true') {
            return true;
        }
        
        // Not authenticated
        return false;
    }
    
    // Show the page content
    function showContent() {
        document.documentElement.style.visibility = 'visible';
    }
    
    // Show access denied page
    function showAccessDenied() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: 'Playfair Display', serif;
                background: linear-gradient(135deg, #F4F6F4 0%, #E8EDE8 100%);
                text-align: center;
                padding: 20px;
            ">
                <div style="max-width: 500px;">
                    <h1 style="
                        font-size: 3em;
                        color: #7B8E7E;
                        margin-bottom: 20px;
                    ">🔒</h1>
                    <h2 style="
                        font-size: 2em;
                        color: #3A3F3A;
                        margin-bottom: 15px;
                    ">Private Event</h2>
                    <p style="
                        font-size: 1.2em;
                        color: #5A5F5A;
                        line-height: 1.6;
                        font-family: 'Lato', sans-serif;
                    ">
                        This wedding website is private and requires an invitation link to access.
                        <br><br>
                        Please check your invitation for the correct link.
                    </p>
                </div>
            </div>
        `;
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.visibility = 'visible';
    }
    
    // Run authentication check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!checkAuthentication()) {
                showAccessDenied();
            } else {
                showContent();
            }
        });
    } else {
        // DOM already loaded
        if (!checkAuthentication()) {
            showAccessDenied();
        } else {
            showContent();
        }
    }
})();
