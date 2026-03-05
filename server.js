const express = require('express');
const util = require('minecraft-server-util');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 친구분의 마인크래프트 서버 주소와 포트를 입력하세요.
const SERVER_IP = '서버주소'; // 예: mc.example.com
const SERVER_PORT = 25565; // 마크 기본 포트는 보통 25565 입니다.
// ==========================================

// public 폴더 안의 파일들을 웹에 띄울 수 있도록 설정
app.use(express.static(path.join(__dirname, 'public')));

// 웹 브라우저가 서버 상태를 물어볼 때 대답해주는 API
app.get('/api/status', async (req, res) => {
    try {
        const result = await util.status(SERVER_IP, SERVER_PORT);
        res.json({ 
            online: true, 
            players: result.players.online,
            maxPlayers: result.players.max
        });
    } catch (error) {
        // 에러가 나면 서버가 닫혀있다고 판단합니다.
        res.json({ online: false });
    }
});

// 사용자가 웹사이트에 접속하면 index.html 파일을 보여줌
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 웹 서버 실행
app.listen(PORT, () => {
    console.log(`웹 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);

});
