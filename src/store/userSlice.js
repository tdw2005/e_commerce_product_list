import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        isLoggedIn: false,
        users: [ // 模拟用户数据
            { username: 'admin', password: '123456', email: 'admin@example.com' },
            { username: 'user1', password: '123456', email: 'user1@example.com' }
        ]
    },
    reducers: {
        login: (state, action) => {
            const { username, password } = action.payload;
            const user = state.users.find(u => u.username === username && u.password === password);

            if (user) {
                state.userInfo = { ...user };
                state.isLoggedIn = true;
            } else {
                // 明确设置登录状态为 false
                state.userInfo = null;
                state.isLoggedIn = false;
                throw new Error('Invalid username or password');
            }
        },
        register: (state, action) => {
            const { username, password, email } = action.payload;

            // 检查用户是否已存在
            const existingUser = state.users.find(u => u.username === username);
            if (existingUser) {
                throw new Error('Username already exists');
            }

            // 添加新用户
            state.users.push({ username, password, email });
        },
        logout: (state) => {
            state.userInfo = null;
            state.isLoggedIn = false;
        }
    }
});

export const { login, register, logout } = userSlice.actions;
export default userSlice.reducer;