async function loadComponent(id, file) {
    const res = await fetch(`components/${file}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

window.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar', 'navbar.html');
    // loadComponent('hero', 'hero.html');
    // loadComponent('about', 'about.html');
    // loadComponent('skills', 'skills.html');
    // loadComponent('projects', 'projects.html');
    // loadComponent('experience', 'experience.html');
    // loadComponent('blog', 'blog.html');
    // loadComponent('contact', 'contact.html');
    // loadComponent('footer', 'footer.html');
});
