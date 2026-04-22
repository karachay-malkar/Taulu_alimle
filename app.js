const data = window.SITE_DATA;
const app = document.getElementById('app');
const mainNav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  const anchor = event.target.closest('[data-route]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (href?.startsWith('#')) {
    event.preventDefault();
    location.hash = href;
  }
  if (mainNav.classList.contains('open')) {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);

function getRoute() {
  const hash = location.hash.replace('#', '') || 'home';
  const [route, id] = hash.split('/');
  return { route, id };
}
function setActiveNav(route) {
  document.querySelectorAll('[data-route]').forEach((link) => {
    link.classList.toggle('active', link.dataset.route === route);
  });
}
function getAllPeople() { return [...data.doctors, ...data.candidates]; }
function getPersonFullName(person) { return [person.lastName, person.firstName, person.middleName].filter(Boolean).join(' '); }
function getPersonShort(person) { return `${person.lastName} ${person.firstName?.[0] || ''}.${person.middleName?.[0] || ''}.`; }
function getPersonFiles(personId) { return data.files.filter((item) => item.personId === personId); }
function backLink(label, target = 'home') { return `<div class="container section-shell"><button class="btn btn-outline" onclick="location.hash='#${target}'">← ${label}</button>`; }
function renderRoute() {
  const { route, id } = getRoute();
  setActiveNav(route);
  switch (route) {
    case 'home': renderHome(); break;
    case 'about': renderAbout(); break;
    case 'doctors': renderPeopleSection('doctors'); break;
    case 'candidates': renderPeopleSection('candidates'); break;
    case 'person': renderPerson(id); break;
    case 'news': renderNewsLike('news'); break;
    case 'events': renderNewsLike('events'); break;
    case 'library': renderLibrary(); break;
    case 'contacts': renderContacts(); break;
    case 'register': renderRegistration(); break;
    default: renderHome();
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function renderHome() {
  const totalPeople = data.doctors.length + data.candidates.length;
  app.innerHTML = `<section class="hero"><div class="container hero-grid"><div class="glass-card"><div class="badge-row"><span class="badge">Научный каталог</span><span class="badge">Библиотека PDF</span><span class="badge">Модерация заявок</span></div><h1 class="hero-title">Единый сайт проекта «Таулу Алимле»</h1><p class="hero-text">Главная страница объединяет каталог докторов и кандидатов наук, новости, мероприятия, библиотеку публикаций и регистрацию участников.</p><div class="hero-actions"><a class="btn btn-primary" href="#doctors" data-route="doctors">Открыть каталог</a><a class="btn btn-secondary" href="#register" data-route="register">Подать заявку</a></div></div><div class="stat-grid"><article class="stat-card"><div class="stat-label">Карточек людей</div><div class="stat-value">${totalPeople}</div></article><article class="stat-card"><div class="stat-label">Доктора наук</div><div class="stat-value">${data.doctors.length}</div></article><article class="stat-card"><div class="stat-label">Кандидаты наук</div><div class="stat-value">${data.candidates.length}</div></article><article class="stat-card"><div class="stat-label">Файлы в библиотеке</div><div class="stat-value">${data.files.length}</div></article></div></div></section>`;
}
function renderAbout(){ app.innerHTML = `${backLink('На главную')}<div class="panel"><div class="panel-header"><div><h1 class="panel-title">${data.about.title}</h1><p class="panel-subtitle">${data.about.text}</p></div></div></div></div>`; }
function renderPeopleSection(type) {
  const collection = data[type];
  const title = type === 'doctors' ? 'Доктора наук' : 'Кандидаты наук';
  app.innerHTML = `${backLink('На главную')}<div class="panel"><div class="panel-header"><div><h1 class="panel-title">${title}</h1></div></div><div class="filter-row"><input id="searchPeople" class="search" placeholder="Поиск по ФИО" /><select id="branchFilter" class="field"><option value="">Все отрасли науки</option>${data.scienceBranches.map((branch) => `<option value="${branch}">${branch}</option>`).join('')}</select><select id="letterFilter" class="field"><option value="">Весь алфавит</option>${[...new Set(collection.map((person) => person.lastName[0].toUpperCase()))].sort().map((letter) => `<option value="${letter}">${letter}</option>`).join('')}</select></div><div id="peopleResult" class="grid-3"></div></div></div>`;
  const searchInput = document.getElementById('searchPeople');
  const branchFilter = document.getElementById('branchFilter');
  const letterFilter = document.getElementById('letterFilter');
  const result = document.getElementById('peopleResult');
  const update = () => {
    const query = searchInput.value.trim().toLowerCase();
    const branch = branchFilter.value;
    const letter = letterFilter.value;
    const filtered = collection.filter((person) => {
      const name = getPersonFullName(person).toLowerCase();
      return (!query || name.includes(query)) && (!branch || person.branch === branch) && (!letter || person.lastName[0].toUpperCase() === letter);
    });
    result.innerHTML = filtered.length ? filtered.map(renderPersonCard).join('') : `<div class="empty-state">Ничего не найдено по выбранным фильтрам.</div>`;
  };
  [searchInput, branchFilter, letterFilter].forEach((el) => el.addEventListener('input', update));
  update();
}
function renderPersonCard(person) {
  return `<article class="person-card"><div class="person-top"><div class="person-avatar">${person.photoInitials}</div><div><div class="person-name">${getPersonFullName(person)}</div><div class="person-role">${person.degree}</div></div></div><div class="badge-row"><span class="badge">${person.branch}</span><span class="badge">${person.ethnicGroup || ''}</span></div><div class="person-meta">${person.work || person.notes || 'Карточка сформирована из реестра кандидатов наук.'}</div><div class="person-actions"><a class="btn btn-primary" href="#person/${person.id}" data-route="person">Открыть анкету</a></div></article>`;
}
function infoItem(label, value) { if(!value) return ''; return `<div class="info-item"><div class="info-label">${label}</div><div class="info-value">${value}</div></div>`; }
function renderPerson(id) {
  const person = getAllPeople().find((item) => item.id === id);
  if (!person) { app.innerHTML = `${backLink('Назад', 'home')}<div class="panel"><div class="empty-state">Карточка человека не найдена.</div></div></div>`; return; }
  const files = getPersonFiles(person.id);
  app.innerHTML = `${backLink('К списку', data.doctors.some((item) => item.id === id) ? 'doctors' : 'candidates')}<div class="panel"><div class="panel-header"><div><h1 class="panel-title">${getPersonFullName(person)}${person.maidenName ? ` (${person.maidenName})` : ''}</h1></div></div><div class="detail-layout"><article class="detail-card"><div class="detail-avatar">${person.photoInitials}</div><div class="badge-row" style="margin-top:16px;"><span class="badge">${person.degree}</span><span class="badge">${person.branch}</span></div></article><article class="detail-card"><div class="info-list">${infoItem('Дата / место рождения', person.birth)}${infoItem('Образование', person.education)}${infoItem('Послевузовское образование', person.postgraduate)}${infoItem('Учёная степень и звание', person.titleInfo)}${infoItem('Тема диссертации', person.thesis)}${infoItem('Место работы', person.work)}${infoItem('Примечания', person.notes)}${infoItem('Источник списка', person.sourceListDate)}${person.publications?.length ? infoItem('Основные научные публикации', `<ul class="list-clean">${person.publications.map((item) => `<li>${item}</li>`).join('')}</ul>`) : ''}</div></article></div><div class="panel" style="margin-top:22px; padding:22px;"><div class="panel-header"><div><h2 class="panel-title">Публикации автора</h2></div></div><div class="grid-3">${files.length ? files.map(renderFileCard).join('') : '<div class="empty-state">Файлы пока не добавлены.</div>'}</div></div></div></div>`;
}
function renderNewsLike(type){ const items=data[type]; const title=type==='news'?'Новости':'Мероприятия'; app.innerHTML=`${backLink('На главную')}<div class="panel"><div class="panel-header"><div><h1 class="panel-title">${title}</h1></div></div><div class="grid-3">${items.map((item)=>`<article class="news-card"><div class="news-image">${type==='news'?'NEWS':'EVENT'}</div><h3 class="card-title">${item.title}</h3><div class="card-meta">${item.date}</div><p class="card-text">${item.text}</p></article>`).join('')}</div></div></div>`; }
function renderLibrary(){ app.innerHTML=`${backLink('На главную')}<div class="panel"><div class="panel-header"><div><h1 class="panel-title">Библиотека</h1></div></div><div id="libraryResult" class="grid-3">${data.files.map(renderFileCard).join('')}</div></div></div>`; }
function renderFileCard(file){ const person=getAllPeople().find((item)=>item.id===file.personId); return `<article class="file-card"><span class="file-pill">${file.type}</span><h3 class="file-title">${file.title}</h3><div class="file-meta">Автор: ${person ? getPersonShort(person) : '—'}</div><div class="file-meta">Отрасль науки: ${file.branch}</div><div class="file-meta">Год публикации: ${file.year}</div><div class="card-actions"><a class="btn btn-outline" href="${file.url}" download>Скачать PDF</a>${person ? `<a class="btn btn-primary" href="#person/${person.id}" data-route="person">Страница автора</a>` : ''}</div></article>`; }
function renderContacts(){ app.innerHTML=`${backLink('На главную')}<div class="panel"><div class="panel-header"><div><h1 class="panel-title">Контакты</h1></div></div><div class="contact-grid"><article class="contact-card"><div class="info-label">Телефон</div><div class="info-value">${data.contacts.phone}</div></article><article class="contact-card"><div class="info-label">Email</div><div class="info-value">${data.contacts.email}</div></article><article class="contact-card"><div class="info-label">Адрес</div><div class="info-value">${data.contacts.address}</div></article></div></div></div>`;}
function renderRegistration(){ app.innerHTML=`${backLink('На главную')}<div class="panel"><div class="panel-header"><div><h1 class="panel-title">Регистрация</h1></div></div><div class="detail-card">Форма регистрации сохранена как в текущей версии сайта.</div></div></div>`; }
