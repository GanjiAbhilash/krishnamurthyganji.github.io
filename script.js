// ===== Krishna Murthy Retirement Tribute — Script =====

(function () {
    'use strict';

    // ===== Loader =====
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            initHeroAnimation();
        }, 1000);
    });
    document.body.classList.add('no-scroll');

    // ===== Navigation =====
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect on header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNav();
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav link on scroll
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // ===== Hero Name Animation =====
    function initHeroAnimation() {
        const heroName = document.getElementById('heroName');
        const name = 'Shri Ganji Krishna Murthy';
        heroName.innerHTML = '';

        name.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 0.04}s`;
            heroName.appendChild(span);
        });
    }

    // ===== Hero Particles =====
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particle.style.animationDuration = `${4 + Math.random() * 4}s`;
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // ===== Scroll Reveal Animation =====
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .career-step, .education-card, .family-card, .gallery-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== Counter Animation =====
    const counterElements = document.querySelectorAll('[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
                // Add "+" suffix for stats that should have it
                if (target === 38 || target === 7) {
                    // No suffix needed for these specific numbers
                }
            }
        }

        requestAnimationFrame(update);
    }

    // ===== Lightbox =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Gallery image click (for when real images are added)
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close lightbox on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ===== Smooth Scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== Fetch & Display Wishes from Google Sheets =====
    const SHEET_ID = '1y2sZB8d1MT9tLpdeGU41I-Eg25n_hlCS-1AZAGhLQJw';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    async function loadWishes() {
        const wishesGrid = document.getElementById('wishesGrid');
        const wishesCount = document.getElementById('wishesCount');
        if (!wishesGrid) return;

        try {
            const response = await fetch(SHEET_URL);
            const text = await response.text();
            // Google returns JSONP-like response, extract the JSON
            const json = JSON.parse(text.substring(47, text.length - 2));
            const rows = json.table.rows;

            if (rows.length === 0) {
                wishesGrid.innerHTML = '<div class="wishes-empty"><i class="fas fa-envelope-open"></i><p>Be the first to leave a wish!</p></div>';
                return;
            }

            wishesCount.textContent = rows.length;
            wishesGrid.innerHTML = '';

            // Rows: [Timestamp, Name, Relation, Message, Memory]
            rows.reverse().forEach((row, index) => {
                const name = row.c[1] ? row.c[1].v : 'Anonymous';
                const relation = row.c[2] ? row.c[2].v : '';
                const message = row.c[3] ? row.c[3].v : '';
                const memory = row.c[4] ? row.c[4].v : '';

                if (!message) return;

                const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                const card = document.createElement('div');
                card.className = 'wish-card';
                card.style.animationDelay = `${index * 0.05}s`;

                let html = `<div class="wish-message">${escapeHtml(message)}</div>`;
                if (memory) {
                    html += `<div class="wish-memory"><strong>A memory:</strong> ${escapeHtml(memory)}</div>`;
                }
                html += `<div class="wish-author">
                    <div class="wish-avatar">${escapeHtml(initials)}</div>
                    <div>
                        <div class="wish-name">${escapeHtml(name)}</div>
                        ${relation ? `<div class="wish-relation">${escapeHtml(relation)}</div>` : ''}
                    </div>
                </div>`;

                card.innerHTML = html;
                wishesGrid.appendChild(card);
            });
        } catch (err) {
            wishesGrid.innerHTML = '<div class="wishes-empty">Wishes will appear here once submitted.</div>';
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadWishes();
    // Refresh wishes every 2 minutes
    setInterval(loadWishes, 120000);

    // ======================== AI CHATBOT ========================
    (function initChatbot() {
        const fab = document.getElementById('chatbotFab');
        const panel = document.getElementById('chatbotPanel');
        const closeBtn = document.getElementById('chatbotClose');
        const form = document.getElementById('chatbotForm');
        const input = document.getElementById('chatbotInput');
        const messages = document.getElementById('chatbotMessages');
        if (!fab || !panel) return;

        const API_URL = 'https://portfolio-chatbot.abhilashganji.workers.dev';
        const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';

        const MAX_MSG_LENGTH = 500;
        const MAX_RETRIES = 2;
        const RETRY_DELAY = 3000;
        const RATE_LIMIT_WINDOW = 60000;
        const RATE_LIMIT_MAX = 5;
        const rateLimitLog = [];
        let isProcessing = false;

        const SUGGESTED_QUESTIONS = [
            'What was his role at SCCL?',
            'Tell me about his journey from Adoni',
            'What are his major achievements?',
            'How many years did he serve?',
            'How can I contact him?'
        ];

        let conversationHistory = [];

        function openChat() {
            fab.classList.add('hidden');
            panel.classList.add('open');
        }
        function closeChat() {
            panel.classList.remove('open');
            fab.classList.remove('hidden');
        }

        fab.addEventListener('click', () => {
            openChat();
            input.focus();
        });
        closeBtn.addEventListener('click', closeChat);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('open')) closeChat();
        });

        function renderSuggestions() {
            const wrapper = document.createElement('div');
            wrapper.className = 'chat-suggestions';
            SUGGESTED_QUESTIONS.forEach(q => {
                const btn = document.createElement('button');
                btn.className = 'chat-suggestion-btn';
                btn.textContent = q;
                btn.addEventListener('click', () => {
                    input.value = q;
                    form.dispatchEvent(new Event('submit', { cancelable: true }));
                    wrapper.remove();
                });
                wrapper.appendChild(btn);
            });
            messages.appendChild(wrapper);
            messages.scrollTop = messages.scrollHeight;
        }
        renderSuggestions();

        function appendMessage(text, sender) {
            const div = document.createElement('div');
            div.className = 'chat-msg ' + (sender === 'user' ? 'chat-user' : 'chat-bot');
            div.innerHTML = '<p>' + escapeHtml(text) + '</p>';
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
            return div;
        }

        function escapeHtml(str) {
            const el = document.createElement('span');
            el.textContent = str;
            return el.innerHTML;
        }

        function showTyping() {
            const div = document.createElement('div');
            div.className = 'chat-msg chat-typing';
            div.id = 'chatTyping';
            div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function removeTyping() {
            const el = document.getElementById('chatTyping');
            if (el) el.remove();
        }

        function isRateLimited() {
            const now = Date.now();
            while (rateLimitLog.length > 0 && rateLimitLog[0] < now - RATE_LIMIT_WINDOW) {
                rateLimitLog.shift();
            }
            return rateLimitLog.length >= RATE_LIMIT_MAX;
        }

        async function queryAI(userMessage, retries) {
            if (retries === undefined) retries = 0;
            conversationHistory.push({ role: 'user', content: userMessage });

            // Cap conversation history to last 10 messages
            if (conversationHistory.length > 10) {
                conversationHistory = conversationHistory.slice(-10);
            }

            var apiMessages = [];
            var recent = conversationHistory.slice(-6);
            recent.forEach(function(msg) {
                apiMessages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
            });

            try {
                var controller = new AbortController();
                var timeoutId = setTimeout(function() { controller.abort(); }, 30000);

                var response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: HF_MODEL,
                        messages: apiMessages,
                        max_tokens: 200,
                        temperature: 0.7,
                        top_p: 0.9,
                        site: 'gkm'
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    if (response.status === 503 && retries < MAX_RETRIES) {
                        conversationHistory.pop();
                        await new Promise(function(r) { setTimeout(r, RETRY_DELAY); });
                        return queryAI(userMessage, retries + 1);
                    }
                    if (response.status === 429) {
                        return 'Rate limited. Please wait a moment and try again.';
                    }
                    return 'Sorry, I hit an error. Please try again later.';
                }

                var data = await response.json();
                var reply = '';
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    reply = data.choices[0].message.content.trim();
                }
                if (!reply) reply = 'Sorry, I couldn\'t generate a response. Please try again.';

                conversationHistory.push({ role: 'assistant', content: reply });
                return reply;
            } catch (err) {
                console.error('[Chatbot] error:', err);
                if (err.name === 'AbortError') {
                    return 'Request timed out. Please try again.';
                }
                if (retries < MAX_RETRIES) {
                    conversationHistory.pop();
                    await new Promise(function(r) { setTimeout(r, RETRY_DELAY); });
                    return queryAI(userMessage, retries + 1);
                }
                return 'Connection error. Please check your network and try again.';
            }
        }

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const text = input.value.trim();
            if (!text || isProcessing) return;
            if (text.length > MAX_MSG_LENGTH) {
                appendMessage('Please keep your message under ' + MAX_MSG_LENGTH + ' characters.', 'bot');
                return;
            }
            if (isRateLimited()) {
                appendMessage('You\'re sending messages too quickly. Please wait a moment.', 'bot');
                return;
            }

            rateLimitLog.push(Date.now());
            isProcessing = true;
            input.value = '';
            appendMessage(text, 'user');
            showTyping();

            const reply = await queryAI(text);
            removeTyping();
            appendMessage(reply, 'bot');
            isProcessing = false;
        });
    })();

    // ===== Console Easter Egg =====
    console.log(
        '%c🙏 Shri Ganji Krishna Murthy — A Life of Excellence',
        'color: #c8943e; font-size: 16px; font-weight: bold;'
    );
    console.log(
        '%c37 years of distinguished service at SCCL (1989-2026)',
        'color: #8b9bb4; font-size: 12px;'
    );

})();
