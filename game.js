const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, color: 'blue' };
let targets = [];
const targetCount = 4;
const targetRadius = 15;
let gameRunning = false;
let permissionGranted = false;
let orientationHandler;

// 初始化目标位置
function generateTargets() {
    targets = [];
    for (let i = 0; i < targetCount; i++) {
        targets.push({
            x: Math.random() * (canvas.width - 2 * targetRadius) + targetRadius,
            y: Math.random() * (canvas.height - 2 * targetRadius) + targetRadius,
            radius: targetRadius,
            color: 'red',
        });
    }
}

// 绘制小球和目标
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制小球
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // 绘制目标
    targets.forEach(target => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.fill();
        ctx.closePath();
    });

    // 显示分数
    document.getElementById('scoreDisplay').innerText = 'Score: ' + score;
}

// 检查碰撞
function checkCollision() {
    targets = targets.filter(target => {
        const dist = Math.hypot(ball.x - target.x, ball.y - target.y);
        if (dist < ball.radius + target.radius) {
            score++;
            return false;  // 碰撞后目标消失
        }
        return true;
    });

    // 如果目标全部消失，重新生成目标
    if (targets.length === 0) {
        generateTargets();
    }
}

// 处理设备方向
function handleOrientation(event) {
    if (!gameRunning) return;

    const tiltX = event.beta;  // 前后倾斜
    const tiltY = event.gamma; // 左右倾斜

    // 根据倾斜度移动小球
    ball.x += tiltY / 5;
    ball.y += tiltX / 5;

    // 限制小球在画布内移动
    if (ball.x < ball.radius) ball.x = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
    if (ball.y < ball.radius) ball.y = ball.radius;
    if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;

    // 绘制游戏
    draw();
    checkCollision();
}

// 请求设备方向权限
async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ 设备
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission();
            if (permissionState === 'granted') {
                permissionGranted = true;
                alert('Permission granted');
                document.getElementById('startButton').disabled = false;
            } else {
                alert('Permission was denied');
            }
        } catch (error) {
            alert(error);
        }
    } else if ('DeviceOrientationEvent' in window) {
        // 非 iOS 13+ 设备
        window.addEventListener('deviceorientation', handleOrientation);
        permissionGranted = true;
        document.getElementById('startButton').disabled = false;
    } else {
        // 不支持设备方向事件
        alert('Device orientation not supported on this device');
    }
}

// 开始游戏
function startGame() {
    if (!permissionGranted) {
        alert('Please request permission first.');
        return;
    }

    gameRunning = true;
    score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    generateTargets();
    draw();

    if (!orientationHandler) {
        orientationHandler = handleOrientation;
        window.addEventListener('deviceorientation', orientationHandler);
    }

    document.getElementById('stopButton').disabled = false;
    document.getElementById('startButton').disabled = true;
}

// 停止游戏
function stopGame() {
    gameRunning = false;
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
}

// 绑定按钮点击事件
document.addEventListener('DOMContentLoaded', () => {
    const requestPermissionButton = document.getElementById('permissionButton');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    requestPermissionButton.addEventListener('click', requestDeviceOrientation);
    startButton.addEventListener('click', startGame);
    stopButton.addEventListener('click', stopGame);
});

// 初始化画布
generateTargets();
draw();
