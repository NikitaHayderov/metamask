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