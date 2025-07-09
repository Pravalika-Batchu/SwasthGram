document.addEventListener('DOMContentLoaded', () => {
    const authPage = document.querySelector('.auth-page');
    if (!authPage) return;

    const bubbles = authPage.querySelectorAll('.bubble');
    if (!bubbles.length) return;

    const mouse = { x: 0, y: 0 };

    authPage.addEventListener('mousemove', (e) => {
        const rect = authPage.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        bubbles.forEach((bubble) => {
            const bubbleRect = bubble.getBoundingClientRect();
            const dx = mouse.x - (bubbleRect.left - rect.left + bubbleRect.width / 2);
            const dy = mouse.y - (bubbleRect.top - rect.top + bubbleRect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                const offsetX = Math.cos(angle) * 8;
                const offsetY = Math.sin(angle) * 8;
                bubble.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            } else {
                bubble.style.transform = 'translate(0, 0)';
            }
        });
    });

    authPage.addEventListener('mouseleave', () => {
        bubbles.forEach((bubble) => {
            bubble.style.transform = 'translate(0, 0)';
        });
    });
});