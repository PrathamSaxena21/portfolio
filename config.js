/* Change these two lines and every page updates. */
window.SITE = {
  owner: 'Your Name',
  email: 'you@example.com'
};
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-owner]').forEach(e => e.textContent = SITE.owner);
  document.querySelectorAll('[data-email]').forEach(e => e.textContent = SITE.email);
});
