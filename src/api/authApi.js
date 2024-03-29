export async function getNonce(walletAddress) {
    console.log(`Making an API request to get nonce for address: ${walletAddress}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `nonce-${Math.random().toString().slice(2, 10)}`;
}

export async function authenticateViaMetaMask(walletAddress, signature, username, action) {
    console.log(`Making an API POST request for ${action} with walletAddress: ${walletAddress}, signature: ${signature}, username: ${username}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, token: "mock-token" };
}

export async function getWalletAddress() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        } catch (error) {
            console.error("Failed to get wallet", error);
            alert('Failed to connect MetaMask');
        }
    } else {
        alert('MetaMask is not installed');
    }
}
export async function signMessage(walletAddress, nonce, action) {
    const message = `${action === 'login' ? 'Sign-in' : 'Sign-up'} to TEST_APP with nonce: ${nonce}`;
    try {
        return await window.ethereum.request({
            method: 'personal_sign',
            params: [message, walletAddress],
        });
    } catch (error) {
        console.error("Failed to sign", error);
        alert('Failed to sign');
    }
}
async function networkDelaySimulation() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function authenticateLogin({ username, password }) {
    if (username === "user" && password === "password") {
        return { success: true, token: "fake-jwt-token" };
    } else {
        return { success: false, message: "Invalid username or password." };
    }
}

async function authenticateSignup({ email }) {
    if (email === "haveAcc@test.com") {
        return { success: false, message: "User already exists." };
    } else {
        return { success: true, token: "fake-jwt-token" };
    }
}

export async function authenticateUser(userType, credentials) {
    await networkDelaySimulation();

    switch (userType) {
        case 'login':
            return authenticateLogin(credentials);
        case 'signup':
            return authenticateSignup(credentials);
        default:
            return { success: false, message: "Unknown user type." };
    }
}