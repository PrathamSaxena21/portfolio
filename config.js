/* Change these lines and every page updates. */
window.SITE = {
  owner: 'Pratham Saxena',
  email: 'saxenapratham21@gmail.com',
  phone: '+91 97603 99177',
  whatsapp: '919760399177'
};
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-owner]').forEach(e => e.textContent = SITE.owner);
  document.querySelectorAll('[data-email]').forEach(e => e.textContent = SITE.email);
  document.querySelectorAll('[data-phone]').forEach(e => e.textContent = SITE.phone);
  document.querySelectorAll('[data-wa]').forEach(e => e.href = 'https://wa.me/' + SITE.whatsapp);
  document.querySelectorAll('[data-mailto]').forEach(e => e.href = 'mailto:' + SITE.email);
});
