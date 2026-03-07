const textLines = [
    "Gửi cậu...",
    "Chúc cậu một ngày Quốc tế Phụ nữ thật vui vẻ nhé!",
    "Luôn xinh đẹp, hạnh phúc và cười thật nhiều, Picturesque!!"
];

let currentLine = 0;
let currentChar = 0;
const typingSpeed = 50; 

function typeWriter() {
    if (currentLine < textLines.length) {
        let elementId = "line" + (currentLine + 1);
        let targetElement = document.getElementById(elementId);
        targetElement.classList.add("typing-cursor");
        const chars = [...textLines[currentLine]];

        if (currentChar < chars.length) {
            targetElement.innerHTML += chars[currentChar];
            currentChar++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            targetElement.classList.remove("typing-cursor");
            currentLine++;
            currentChar = 0;
            setTimeout(typeWriter, 400); 
        }
    } else {
        setTimeout(function() {
            document.getElementById('greeting-text-container').style.display = 'none';
            let khabyGift = document.getElementById('khaby-gift-container');
            khabyGift.classList.remove('hidden');
            khabyGift.classList.add('pop-in');
        }, 1500); 
    }
}

function openEnvelope() {
    document.getElementById('step1-envelope').style.display = 'none';
    let letter = document.getElementById('step2-letter');
    letter.classList.remove('hidden');
    letter.classList.add('fade-in');

    createFallingPetals();
    setTimeout(typeWriter, 500); 
}

function openGift() {
    document.getElementById('step2-letter').style.display = 'none';
    let surprise = document.getElementById('step3-surprise');
    surprise.classList.remove('hidden');
    surprise.classList.add('pop-in');

    setTimeout(function() {
        let punchline = document.getElementById('final-punchline');
        punchline.classList.remove('hidden');
        
        let btn = document.getElementById('thank-btn');
        let dislikeBtn = document.getElementById('dislike-btn');
        
        btn.classList.remove('hidden');
        dislikeBtn.classList.remove('hidden');

        setTimeout(function() {
            punchline.classList.add('show');
            btn.classList.add('show');
            dislikeBtn.classList.add('show');
        }, 50); 
        
    }, 2500); 
}

function createFallingPetals() {
    setInterval(() => {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.innerText = Math.random() > 0.5 ? '🌸' : '💖'; 
        petal.style.left = Math.random() * 100 + 'vw';
        const fallDuration = Math.random() * 3 + 4; 
        petal.style.animationDuration = fallDuration + 's';
        document.body.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, fallDuration * 1000);
    }, 300); 
}

function sayThanks() {
    let btn = document.getElementById('thank-btn');
    btn.innerText = "Cảm ơn vì đã ko ấn nút chê , làm tốt lắm! =))";
    btn.style.backgroundColor = "#4CAF50"; 
    
    // Ẩn nút Chê đi khi đã bấm Cảm ơn
    document.getElementById('dislike-btn').style.display = 'none';

    for (let i = 0; i < 30; i++) {
        createExplosionHeart();
    }
}

function createExplosionHeart() {
    const heart = document.createElement('div');
    heart.classList.add('explode-heart');
    heart.innerText = '😶‍🌫️😶‍🌫️';
    
    heart.style.left = '50vw';
    heart.style.top = '50vh';

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 300 + 100; 
    const tx = Math.cos(angle) * distance + 'px';
    const ty = Math.sin(angle) * distance + 'px';
    
    heart.style.setProperty('--tx', tx);
    heart.style.setProperty('--ty', ty);
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// --- LOGIC NÚT CHÊ CHẠY TRỐN KHI BỊ CLICK ---
const dislikeBtn = document.getElementById('dislike-btn');
if (dislikeBtn) {
    dislikeBtn.addEventListener('click', function() {
        // THÊM DÒNG NÀY: Nhấc nút Chê ra khỏi tấm thiệp, gắn thẳng vào màn hình ngoài cùng
        document.body.appendChild(dislikeBtn);
        
        const maxX = window.innerWidth - dislikeBtn.offsetWidth - 20;
        const maxY = window.innerHeight - dislikeBtn.offsetHeight - 20;

        const randomX = Math.max(10, Math.floor(Math.random() * maxX));
        const randomY = Math.max(10, Math.floor(Math.random() * maxY));

        dislikeBtn.style.position = 'fixed';
        dislikeBtn.style.left = randomX + 'px';
        dislikeBtn.style.top = randomY + 'px';
        dislikeBtn.style.zIndex = '9999';
        
        // Cà khịa khi click hụt
        dislikeBtn.innerText = "Muốn chê thì bắt lấy đi này =)))))"; 
    });
}
