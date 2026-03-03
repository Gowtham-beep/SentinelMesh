import axios from 'axios';

async function test() {
    const API_URL = 'http://localhost:3001';
    try {
        // 1. Register new user
        const email = `test-${Date.now()}@test.com`;
        const signup = await axios.post(`${API_URL}/auth/signup`, { email, password: 'password123' });
        const token = signup.data.accessToken;
        console.log("Signup success:", email);

        // 2. Fetch Profile
        const profile = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Profile Data:", JSON.stringify(profile.data, null, 2));

        // 3. Update Password
        const pwUpdate = await axios.put(`${API_URL}/auth/password`,
            { currentPassword: 'password123', newPassword: 'newPassword456' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Password Update:", pwUpdate.data);

    } catch (err: any) {
        console.error("Test Failed:", err.response?.data || err.message);
    }
}

test();
