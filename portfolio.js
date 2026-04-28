const FrontCert = document.querySelector('.frontend-certificate');
const HTMLCert = document.querySelector('.html-certificate');
const CSSCert = document.querySelector('.css-certificate');
const JSCert = document.querySelector('.javascript-certificate');
const GitCert = document.querySelector('.git-certificate');

FrontCert.addEventListener('click', () => {
    window.open('./public/frontend-certificate.jpg');
});

HTMLCert.addEventListener('click', () => {
    window.open('./public/html-cert.jpg');
});

CSSCert.addEventListener('click', () => {
    window.open('./public/css-cert.jpg');
});

JSCert.addEventListener('click', () => {
    window.open('./public/js-cert.jpg');
});

GitCert.addEventListener('click', () => {
    window.open('./public/git-cert.jpg');
});

// Scroll to top button
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});