let availableTime = localStorage.getItem('availableTime') ? parseInt(localStorage.getItem('availableTime')) : 1800; // 기본값: 1800분 (30시간)
let startDate = localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')) : new Date(); // 시작 날짜를 로드하거나 현재 날짜로 초기화
let stopwatchInterval;
let isRunning = false; // 스톱워치 상태를 저장
let elapsedTime = 0; // 경과된 시간

// 30일 경과 여부를 확인하고 리셋하는 함수
function checkAndResetAvailableTime() {
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 경과 일수 계산

    if (diffDays >= 30) {
        // 30일이 경과하면 가용 시간 리셋
        availableTime = 1800;
        startDate = new Date(); // 시작 날짜를 현재로 업데이트
        saveAvailableTime();
        saveStartDate();
    }
}

function updateAvailableTimeDisplay() {
    document.getElementById('available-time-display').textContent = availableTime;
}

function saveAvailableTime() {
    localStorage.setItem('availableTime', availableTime);
}

function saveStartDate() {
    localStorage.setItem('startDate', startDate.toISOString());
}

function toggleStopwatch() {
    const button = document.getElementById('start-stop-btn');
    const setTimeInput = document.getElementById('set-time').value;
    const setTime = parseInt(setTimeInput); // 트라이얼 시간 (분 단위)

    if (!isRunning) {
        // 스톱워치 시작
        if (availableTime <= 0) {
            alert("이번 달 게임 시간 다 썼어요! 다음 달에 다시 만나요!");
            return;
        }

        isRunning = true;
        elapsedTime = 0;
        button.textContent = "Stop";
        document.getElementById('set-time').disabled = true;
        
        stopwatchInterval = setInterval(() => {
            elapsedTime++;
            updateTimeDisplay(setTime * 60 - elapsedTime); // 초 단위로 변환

            if (elapsedTime >= setTime * 60) { // 트라이얼 시간 경과
                stopStopwatch(setTime); // 트라이얼 시간이 모두 경과되면 스톱워치 중지
            }
        }, 1000);
    } else {
        // 스톱워치 중지
        stopStopwatch(Math.floor(elapsedTime / 60)); // 경과된 시간만큼 차감 (분 단위, 소수점 이하 버림)
    }
}

function stopStopwatch(timeToDeduct) {
    clearInterval(stopwatchInterval);
    playEndSound();
    availableTime -= timeToDeduct;
    if (availableTime < 0) availableTime = 0;

    saveAvailableTime();
    updateAvailableTimeDisplay();

    document.getElementById('set-time').disabled = false;
    document.getElementById('start-stop-btn').textContent = "Start";
    isRunning = false;
}

function updateTimeDisplay(remainingTime) {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById('time-display').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:00`;
}

function playEndSound() {
    const endSound = document.getElementById('end-sound');
    endSound.play();
}

// 페이지가 로드될 때 30일 경과 여부를 체크하고 남은 시간을 표시
checkAndResetAvailableTime();
updateAvailableTimeDisplay();