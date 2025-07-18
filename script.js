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

// 방명록 기능
function addMessage() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const messagesContainer = document.getElementById('messages');
    
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
    
    // 메시지 생성
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    
    const now = new Date();
    const timeString = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    
    messageItem.innerHTML = `
        <div class="message-author">${escapeHtml(name)}</div>
        <div class="message-text">${escapeHtml(message)}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    // 메시지 추가 (최신이 위로)
    messagesContainer.insertBefore(messageItem, messagesContainer.firstChild);
    
    // 로컬 스토리지에 저장
    saveMessage({name, message, time: timeString});
    
    // 입력 필드 초기화
    nameInput.value = '';
    messageInput.value = '';
    
    // 성공 애니메이션
    nameInput.style.borderColor = '#06ffa5';
    messageInput.style.borderColor = '#06ffa5';
    setTimeout(() => {
        nameInput.style.borderColor = '';
        messageInput.style.borderColor = '';
    }, 1000);
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 메시지 저장
function saveMessage(message) {
    let messages = JSON.parse(localStorage.getItem('fujirockMessages') || '[]');
    messages.unshift(message);
    // 최대 50개 메시지만 저장
    if (messages.length > 50) {
        messages = messages.slice(0, 50);
    }
    localStorage.setItem('fujirockMessages', JSON.stringify(messages));
}

// 메시지 로드
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('fujirockMessages') || '[]');
    const messagesContainer = document.getElementById('messages');
    
    messages.forEach(msg => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <div class="message-author">${escapeHtml(msg.name)}</div>
            <div class="message-text">${escapeHtml(msg.message)}</div>
            <div class="message-time">${msg.time}</div>
        `;
        messagesContainer.appendChild(messageItem);
    });
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
            // 랜덤 네온 색상 적용
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
    
    // 관찰할 요소들
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
        // 영상 iframe 생성
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        videoContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/ZAJ97kUy_tI?autoplay=1&mute=1&start=30&loop=1&playlist=ZAJ97kUy_tI" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        `;
        
        // 기존 컨텐츠 숨기기
        const mainPhoto = document.getElementById('mainPhoto');
        const photoOverlay = photoContainer.querySelector('.photo-overlay');
        mainPhoto.style.display = 'none';
        photoOverlay.style.display = 'none';
        
        // 영상 추가
        photoContainer.appendChild(videoContainer);
        
        // 클릭 이벤트 제거 (중복 방지)
        photoContainer.style.cursor = 'default';
        photoContainer.replaceWith(photoContainer.cloneNode(true));
    });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupFloatingEmojis();
    loadMessages();
    setupMemberCards();
    setupScrollEffects();
    setupPhotoVideoSwitch();
    
    // 엔터키로 메시지 전송
    document.getElementById('guestMessage').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            addMessage();
        }
    });
    
    // 메인 타이틀 타이핑 효과 (선택적)
    // const mainTitle = document.querySelector('.neon-text');
    // if (mainTitle) {
    //     const originalText = mainTitle.textContent;
    //     typeWriter(mainTitle, originalText, 100);
    // }
});

// 동적 배경 효과
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

// 동적 배경 활성화 (성능 고려하여 선택적으로 사용)
// createDynamicBackground();

// 콘솔 이스터에그
console.log('%c🎸 ADDICTED TO THE BEAT 🎸', 'font-size: 30px; color: #ff006e; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c우리랑 놀자! Join the party!', 'font-size: 16px; color: #06ffa5;');
console.log('%c후지락에서 만나요 🍻', 'font-size: 14px; color: #ffbe0b;');

// Supabase 연동 정보 추가
const SUPABASE_URL = 'https://vsvmlsjmrekdivkuigns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdm1sc2ptcmVrZGl2a3VpZ25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MzA1NzMsImV4cCI6MjA2ODIwNjU3M30.wa7rjlnYfGrmC4nsE_OnpmVYdXaawCUqS6gTktdotE0';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 방명록 작성 함수
async function addGuestbookEntry(name, message) {
  const { data, error } = await supabase
    .from('guestbook')
    .insert([{ name, message }]);
  if (error) {
    alert('오류: ' + error.message);
  } else {
    alert('방명록이 등록되었습니다!');
    fetchAndRenderGuestbook();
  }
}

// 방명록 불러오기 함수
async function fetchGuestbookEntries() {
  const { data, error } = await supabase
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    alert('오류: ' + error.message);
    return [];
  }
  return data;
}

// 방명록 목록 렌더링 함수
async function fetchAndRenderGuestbook() {
  const entries = await fetchGuestbookEntries();
  const list = document.getElementById('guestbook-list');
  list.innerHTML = '';
  entries.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'guestbook-entry';
    item.innerHTML = `<b>${entry.name}</b>: ${entry.message} <span style='color:#888;font-size:0.8em;'>(${new Date(entry.created_at).toLocaleString()})</span>`;
    list.appendChild(item);
  });
}

// 폼 이벤트 연결
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('guestbook-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.elements['name'].value.trim();
    const message = form.elements['message'].value.trim();
    if (!name || !message) {
      alert('이름과 메시지를 모두 입력해 주세요.');
      return;
    }
    await addGuestbookEntry(name, message);
    form.reset();
  });
  fetchAndRenderGuestbook();
});
