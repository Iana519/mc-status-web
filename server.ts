import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import * as util from 'minecraft-server-util';
import * as path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 환경변수에서 IP와 포트를 가져옵니다.
const SERVER_IP = process.env.SERVER_IP;
const JAVA_PORT = parseInt(process.env.SERVER_PORT || '25565', 10);
const BEDROCK_PORT = 19132; // 베드락 기본 포트

app.use(express.static(path.join(__dirname, 'public')));

// 상태 확인 API 엔드포인트
app.get('/api/status', async (req: Request, res: Response) => {
    if (!SERVER_IP) {
        return res.json({ online: false, error: "서버 IP가 설정되지 않았습니다." });
    }

    let isOnline = false;
    let playersOnline = 0;
    let maxPlayers = 0;
    let playerList: any[] = [];

    // 1. 자바 에디션 노크
    try {
        const javaResult = await util.status(SERVER_IP, JAVA_PORT);
        isOnline = true;
        playersOnline = javaResult.players.online;
        maxPlayers = javaResult.players.max;
        playerList = javaResult.players.sample || [];
    } catch (javaError) {
        // 2. 응답 없으면 베드락 에디션 노크
        try {
            const bedrockResult = await util.statusBedrock(SERVER_IP, BEDROCK_PORT);
            isOnline = true;
            playersOnline = Number(bedrockResult.players.online);
            maxPlayers = Number(bedrockResult.players.max);
            playerList = []; 
        } catch (bedrockError) {
            isOnline = false;
        }
    }

    res.json({ 
        online: isOnline, 
        players: playersOnline,
        maxPlayers: maxPlayers,
        playerList: playerList
    });
});

// 메인 페이지 라우트
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`웹 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});