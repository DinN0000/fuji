// 파티클 생성
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const colors = ['#ff006e', '#3a86ff', '#06ffa5', '#ffbe0b', '#8338ec'];
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particlesContainer.appendChild(particle);
    }
}

// 플로팅 이모지 위치 설정
function setupFloatingEmojis() {
    const emojis = document.querySelectorAll('.emoji');
    emojis.forEach(emoji => {
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.animationDuration = (Math.random() * 10 + 15) + 's';
    });
}

// Supabase 연결 정보
const SUPABASE_URL = 'https://vsvmlsjmrekdivkuigns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdm1sc2ptcmVrZGl2a3VpZ25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MzA1NzMsImV4cCI6MjA2ODIwNjU3M30.wa7rjlnYfGrmC4nsE_OnpmVYdXaawCUqS6gTktdotE0';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Supabase 기반 방명록 메시지 불러오기
async function loadMessages() {
    const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    if (error) {
        messagesContainer.innerHTML = '<p>메시지를 불러올 수 없습니다.</p>';
        return;
    }
    data.forEach(msg => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <div class="message-main">
                <div class="message-author">${escapeHtml(msg.name)}</div>
                <div class="message-text">${escapeHtml(msg.message)}</div>
            </div>
            <div class="message-meta">
                <div class="message-time">${new Date(msg.created_at).toLocaleString()}</div>
                <button class="delete-btn" onclick="deleteMessage(${msg.id})">삭제</button>
            </div>
        `;
        messagesContainer.appendChild(messageItem);
    });
}

// Supabase 기반 메시지 작성
async function addMessage() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !message) {
        // 글리치 효과로 경고
        nameInput.style.animation = 'shake 0.5s';
        messageInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            nameInput.style.animation = '';
            messageInput.style.animation = '';
        }, 500);
        return;
    }
    // 비밀번호는 4231로 고정
    const password = '4231';
    const { error } = await supabase
        .from('guestbook')
        .insert([{ name, message, password }]);
    if (error) {
        alert('메시지 등록에 실패했습니다.');
        return;
    }
    nameInput.value = '';
    messageInput.value = '';
    // 성공 애니메이션
    nameInput.style.borderColor = '#06ffa5';
    messageInput.style.borderColor = '#06ffa5';
    setTimeout(() => {
        nameInput.style.borderColor = '';
        messageInput.style.borderColor = '';
    }, 1000);
    loadMessages();
}

// Supabase 기반 메시지 삭제
async function deleteMessage(id) {
    const input = prompt('삭제 비밀번호를 입력하세요:');
    if (input !== '4231') {
        alert('비밀번호가 틀렸습니다.');
        return;
    }
    const { error } = await supabase
        .from('guestbook')
        .delete()
        .match({ id, password: '4231' });
    if (error) {
        alert('삭제에 실패했습니다.');
        return;
    }
    loadMessages();
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 흔들기 애니메이션
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);

// 멤버 카드 호버 효과
function setupMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            const colors = ['#ff006e', '#3a86ff', '#06ffa5', '#ffbe0b', '#8338ec'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            card.style.setProperty('--hover-color', randomColor);
        });
    });
}

// 스크롤 이벤트
function setupScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    document.querySelectorAll('.member-card, .message-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}

// 타이핑 효과
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// 사진 클릭 시 영상으로 대체
function setupPhotoVideoSwitch() {
    const photoContainer = document.getElementById('photoContainer');
    photoContainer.addEventListener('click', () => {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        videoContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/ZAJ97kUy_tI?autoplay=1&mute=0&start=30&loop=1&playlist=ZAJ97kUy_tI" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        `;
        const mainPhoto = document.getElementById('mainPhoto');
        const photoOverlay = photoContainer.querySelector('.photo-overlay');
        mainPhoto.style.display = 'none';
        photoOverlay.style.display = 'none';
        photoContainer.appendChild(videoContainer);
        photoContainer.style.cursor = 'default';
        photoContainer.replaceWith(photoContainer.cloneNode(true));
    });
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupFloatingEmojis();
    loadMessages();
    setupMemberCards();
    setupScrollEffects();
    setupPhotoVideoSwitch();
    document.getElementById('guestMessage').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            addMessage();
        }
    });
    // const mainTitle = document.querySelector('.neon-text');
    // if (mainTitle) {
    //     const originalText = mainTitle.textContent;
    //     typeWriter(mainTitle, originalText, 100);
    // }
});

// 동적 배경 효과 (선택적)
function createDynamicBackground() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-2';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    const lines = [];
    const lineCount = 50;
    for (let i = 0; i < lineCount; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            line.x += line.speedX;
            line.y += line.speedY;
            if (line.x < 0 || line.x > canvas.width) line.speedX *= -1;
            if (line.y < 0 || line.y > canvas.height) line.speedY *= -1;
            ctx.lineTo(line.x, line.y);
            ctx.strokeStyle = line.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        requestAnimationFrame(animate);
    }
    animate();
}
// createDynamicBackground();

// 콘솔 이스터에그
console.log('%c🎸 ADDICTED TO THE BEAT 🎸', 'font-size: 30px; color: #ff006e; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c우리랑 놀자! Join the party!', 'font-size: 16px; color: #06ffa5;');
console.log('%c후지락에서 만나요 🍻', 'font-size: 14px; color: #ffbe0b;');
