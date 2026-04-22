
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
  if (anchor) {
    const href = anchor.getAttribute('href');
    if (href?.startsWith('#')) {
      event.preventDefault();
      location.hash = href;
    }
  }
  if (event.target.classList.contains('modal-overlay')) {
    event.target.classList.remove('open');
    document.body.style.overflow = '';
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

function sectionHeader(tag, title, desc='') {
  return `<div class="section-header"><div><div class="section-tag">${tag}</div><h2 class="section-title">${title}</h2></div>${desc ? `<p class="section-desc">${desc}</p>` : ''}</div>`;
}
function backLink(label, target='home') {
  return `<div class="container" style="padding-top:40px;"><a class="btn-outline" href="#${target}" data-route="${target}">${label}</a></div>`;
}

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
  app.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <div class="hero-eyebrow">Карачаево-Балкарские учёные</div>
        <h1 class="hero-title">ТАУЛУ<strong>АЛИМЛЕ</strong></h1>
        <p class="hero-subtitle">Энциклопедия выдающихся учёных горского народа. Сохраняем научное наследие, объединяем знания.</p>
        <div class="hero-actions">
          <a href="#doctors" data-route="doctors" class="btn-primary">Доктора наук</a>
          <a href="#about" data-route="about" class="btn-outline">О проекте</a>
        </div>
      </div>
      <div class="hero-scroll"><span>Листать</span><div class="scroll-line"></div></div>
    </section>

    <div class="stats-bar">
      <div class="stat"><div class="stat-number">${totalPeople}</div><div class="stat-label">Страниц учёных</div></div>
      <div class="stat"><div class="stat-number">${data.scienceBranches.length}</div><div class="stat-label">Отраслей науки</div></div>
      <div class="stat"><div class="stat-number">2</div><div class="stat-label">Категории степеней</div></div>
      <div class="stat"><div class="stat-number">${data.files.length}</div><div class="stat-label">Публикаций</div></div>
    </div>

    <section class="container" id="about-section">
      ${sectionHeader('О проекте', 'Горные <em>учёные</em><br>на все времена', 'Проект создан для сохранения и популяризации научного наследия карачаево-балкарского народа.')}
      <div class="about-grid">
        <div class="about-text">
          <p><strong>«ТАУЛУ АЛИМЛЕ»</strong> — это проект-энциклопедия, объединяющий информацию о докторах и кандидатах наук.</p>
          <p>${data.about?.text || ''}</p>
          <p>На страницах сайта можно найти биографические данные, научные труды, публикации и диссертации каждого учёного.</p>
          <a href="#doctors" data-route="doctors" class="btn-outline" style="display:inline-block; margin-top:8px;">Перейти к учёным</a>
        </div>
        <div class="about-card">
          <div class="about-card-quote">«Наука — это <span>высота</span>, которую покоряют терпением и трудом»</div>
          <div class="about-card-attr">— Девиз проекта</div>
        </div>
      </div>
    </section>

    <section class="container">
      ${sectionHeader('Раздел', 'Доктора <em>наук</em>', 'Полный список докторов наук с возможностью фильтрации по алфавиту и отрасли науки.')}
      <div class="scientists-grid">${data.doctors.slice(0, 6).map(renderPersonCard).join('')}</div>
    </section>

    <section class="container" style="padding-top:0;">
      ${sectionHeader('Раздел', 'Кандидаты <em>наук</em>', 'Кандидаты наук с фильтрацией по алфавиту и отрасли науки.')}
      <div class="scientists-grid">${data.candidates.slice(0, 6).map(renderPersonCard).join('')}</div>
    </section>
  `;
}

function renderAbout() {
  app.innerHTML = `
    ${backLink('← На главную')}
    <section class="container">
      ${sectionHeader('О проекте', 'О проекте <em>«Таулу Алимле»</em>', 'Раздел «О проекте» содержит текстовое описание проекта.')}
      <div class="about-grid">
        <div class="about-text">
          <p>${data.about?.text || ''}</p>
          ${(data.about?.goals || []).map(goal => `<p>• ${goal}</p>`).join('')}
        </div>
        <div class="about-card">
          <div class="about-card-quote">«Сохраняем научное наследие, объединяем <span>знания</span>»</div>
          <div class="about-card-attr">Архитектура проекта</div>
        </div>
      </div>
    </section>
  `;
}

function renderPeopleSection(type) {
  const collection = data[type];
  const title = type === 'doctors' ? 'Доктора <em>наук</em>' : 'Кандидаты <em>наук</em>';
  const subtitle = type === 'doctors'
    ? 'Полный список докторов наук с возможностью фильтрации по алфавиту и отрасли науки.'
    : 'Кандидаты наук с фильтрацией по алфавиту и отрасли науки.';
  app.innerHTML = `
    ${backLink('← На главную')}
    <section class="container">
      ${sectionHeader('Раздел', title, subtitle)}
      <div class="filter-row">
        <input id="searchPeople" class="search" placeholder="Поиск по ФИО" />
        <select id="branchFilter" class="field">
          <option value="">Все отрасли науки</option>
          ${data.scienceBranches.map((branch) => `<option value="${branch}">${branch}</option>`).join('')}
        </select>
        <select id="letterFilter" class="field">
          <option value="">Весь алфавит</option>
          ${[...new Set(collection.map((person) => person.lastName[0].toUpperCase()))].sort().map((letter) => `<option value="${letter}">${letter}</option>`).join('')}
        </select>
      </div>
      <div id="peopleResult" class="scientists-grid"></div>
    </section>
  `;
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
  const pubs = getPersonFiles(person.id).length || (person.publications?.length || 0);
  return `
    <article class="person-card">
      <div class="person-top">
        <div class="person-avatar">${person.photoInitials || 'ТА'}</div>
        <div>
          <div class="person-name">${getPersonFullName(person)}</div>
          <div class="person-role">${person.degree}</div>
        </div>
      </div>
      <div class="badge-row">
        <span class="badge">${person.branch}</span>
        ${person.ethnicGroup ? `<span class="badge">${person.ethnicGroup}</span>` : ''}
      </div>
      <div class="person-meta">${person.work || person.notes || 'Карточка сформирована из реестра проекта.'}</div>
      <div class="person-actions">
        <a class="btn-outline" href="#person/${person.id}" data-route="person">Открыть анкету</a>
        <span class="badge">Публикаций: ${pubs}</span>
      </div>
    </article>
  `;
}

function infoItem(label, value) {
  if (!value || value === '<ul class="list-clean"></ul>') return '';
  return `<div class="info-item"><div class="info-label">${label}</div><div class="info-value">${value}</div></div>`;
}

function renderPerson(id) {
  const person = getAllPeople().find((item) => item.id === id);
  if (!person) {
    app.innerHTML = `${backLink('← Назад', 'home')}<section class="container"><div class="empty-state">Карточка человека не найдена.</div></section>`;
    return;
  }
  const files = getPersonFiles(person.id);
  app.innerHTML = `
    ${backLink('← К списку', data.doctors.some((item) => item.id === id) ? 'doctors' : 'candidates')}
    <section class="container">
      ${sectionHeader('Профиль учёного', `${getPersonFullName(person)}${person.maidenName ? ` <em>(${person.maidenName})</em>` : ''}`, person.degree)}
      <div class="detail-layout">
        <article class="detail-card">
          <div class="detail-avatar">${person.photoInitials || 'ТА'}</div>
          <div class="badge-row" style="padding:16px 0 0;">
            <span class="badge">${person.degree}</span>
            <span class="badge">${person.branch}</span>
          </div>
        </article>
        <article class="detail-card">
          <div class="info-list">
            ${infoItem('Дата / место рождения', person.birth)}
            ${infoItem('Образование', person.education)}
            ${infoItem('Послевузовское образование', person.postgraduate)}
            ${infoItem('Учёная степень и звание', person.titleInfo)}
            ${infoItem('Тема диссертации', person.thesis)}
            ${infoItem('Место работы', person.work)}
            ${infoItem('Примечания', person.notes)}
            ${infoItem('Источник списка', person.sourceListDate)}
            ${person.publications?.length ? infoItem('Основные научные публикации', `<ul class="list-clean">${person.publications.map((item) => `<li>${item}</li>`).join('')}</ul>`) : ''}
          </div>
        </article>
      </div>
      <section style="padding:40px 0 0;">
        ${sectionHeader('Архив', 'Научные <em>публикации</em>', 'Материалы, связанные с карточкой автора.')}
        <div>${files.length ? files.map(renderFileCard).join('') : `<div class="empty-state">Файлы пока не добавлены.</div>`}</div>
      </section>
    </section>
  `;
}

function renderNewsLike(type) {
  const items = data[type];
  const title = type === 'news' ? 'Новости <em>& события</em>' : 'Мероприятия <em>проекта</em>';
  const desc = type === 'news' ? 'Актуальные события научного сообщества карачаево-балкарского народа.' : 'Встречи, семинары, конференции и анонсы проекта.';
  app.innerHTML = `
    ${backLink('← На главную')}
    <section class="container">
      ${sectionHeader('Лента', title, desc)}
      <div class="scientists-grid">
        ${items.map((item, idx) => `
          <article class="news-card">
            <div class="news-image">${type === 'news' ? '📚' : '🎓'}</div>
            <div class="news-body">
              <div class="news-date">${item.date}</div>
              <h3 class="news-title">${item.title}</h3>
              <p class="card-text">${item.text}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderLibrary() {
  app.innerHTML = `
    ${backLink('← На главную')}
    <section class="container">
      ${sectionHeader('Архив', 'Научная <em>библиотека</em>', 'Публикации учёных, доступные для свободного скачивания.')}
      <div class="filter-row">
        <input id="librarySearch" class="search" placeholder="Фамилия автора" />
        <select id="libraryBranch" class="field">
          <option value="">Все отрасли науки</option>
          ${data.scienceBranches.map((branch) => `<option value="${branch}">${branch}</option>`).join('')}
        </select>
        <select id="libraryYear" class="field">
          <option value="">Все годы</option>
          ${[...new Set(data.files.map((item) => item.year))].sort((a, b) => b - a).map((year) => `<option value="${year}">${year}</option>`).join('')}
        </select>
      </div>
      <div id="libraryResult"></div>
    </section>
  `;
  const search = document.getElementById('librarySearch');
  const branch = document.getElementById('libraryBranch');
  const year = document.getElementById('libraryYear');
  const result = document.getElementById('libraryResult');

  const update = () => {
    const q = search.value.trim().toLowerCase();
    const b = branch.value;
    const y = year.value;
    const filtered = data.files.filter((file) => {
      const person = getAllPeople().find((item) => item.id === file.personId);
      return (!q || person?.lastName.toLowerCase().includes(q)) && (!b || file.branch === b) && (!y || String(file.year) === y);
    });
    result.innerHTML = filtered.length ? filtered.map(renderFileCard).join('') : `<div class="empty-state">По выбранным фильтрам файлов не найдено.</div>`;
  };
  [search, branch, year].forEach((el) => el.addEventListener('input', update));
  update();
}

function renderFileCard(file) {
  const person = getAllPeople().find((item) => item.id === file.personId);
  return `
    <article class="file-card">
      <div>
        <h3 class="file-title">${file.title}</h3>
        <div class="file-meta"><span style="color:var(--gold); margin-right:12px;">${file.branch}</span> ${person ? getPersonShort(person) : '—'}</div>
      </div>
      <div class="file-meta">${file.year}</div>
      <div class="card-actions">
        <a class="btn-outline" href="${file.url}" download>↓ PDF</a>
        ${person ? `<a class="btn-outline" href="#person/${person.id}" data-route="person">Автор</a>` : ''}
      </div>
    </article>
  `;
}

function renderContacts() {
  app.innerHTML = `
    ${backLink('← На главную')}
    <section class="container">
      ${sectionHeader('Связь', '<em>Контакты</em>', '')}
      <div class="contact-grid">
        <div>
          <div class="contact-item"><div class="contact-icon">📞</div><div><div class="contact-label">Телефон</div><div class="contact-value">${data.contacts.phone}</div></div></div>
          <div class="contact-item"><div class="contact-icon">✉️</div><div><div class="contact-label">Email</div><div class="contact-value">${data.contacts.email}</div></div></div>
          <div class="contact-item"><div class="contact-icon">📍</div><div><div class="contact-label">Адрес</div><div class="contact-value">${data.contacts.address}</div></div></div>
        </div>
        <div class="about-card">
          <div class="about-card-quote" style="font-size:20px;">Хотите добавить учёного в базу или сообщить об ошибке?</div>
          <p style="font-size:13px; color:var(--text-muted); margin:16px 0 24px; line-height:1.8;">Напишите нам или воспользуйтесь формой регистрации — каждая заявка проходит модерацию администратора.</p>
          <a href="#register" data-route="register" class="btn-primary">Подать заявку на регистрацию</a>
        </div>
      </div>
    </section>
  `;
}

function renderRegistration() {
  app.innerHTML = `
    ${backLink('← На главную')}
    <section class="container">
      ${sectionHeader('Регистрация', 'Подать <em>заявку</em>', 'После заполнения анкеты ваша заявка будет отправлена на ручную модерацию.')}
      <article class="detail-card" style="max-width:760px;">
        <form id="registrationForm">
          <div class="form-grid">
            <div><label class="contact-label">Фамилия *</label><input class="field" name="lastName" required></div>
            <div><label class="contact-label">Имя *</label><input class="field" name="firstName" required></div>
            <div><label class="contact-label">Отчество</label><input class="field" name="middleName"></div>
            <div><label class="contact-label">Доктор / кандидат *</label><select class="field" name="rank" required><option value="">— выберите —</option><option>Доктор наук</option><option>Кандидат наук</option></select></div>
            <div><label class="contact-label">Каких наук *</label><input class="field" name="science" required></div>
            <div><label class="contact-label">Email *</label><input class="field" name="email" type="email" required></div>
          </div>
          <div class="form-note" style="margin:24px 0;"><strong>ℹ️ Модерация:</strong> Подтверждение регистрации осуществляется после ручной проверки администратором сайта. Телефон и email не отображаются в публичном профиле.</div>
          <div class="checkbox-row">
            <input id="consent" type="checkbox" required />
            <label for="consent">Даю согласие на обработку и хранение персональных данных.</label>
          </div>
          <div class="form-actions"><button class="btn-primary" type="submit">Отправить заявку →</button></div>
        </form>
      </article>
    </section>
  `;
  document.getElementById('registrationForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formWrap = event.target.closest('.detail-card');
    formWrap.innerHTML = `
      <div style="text-align:center; padding: 40px 0;">
        <div style="font-size:56px; margin-bottom:20px;">✅</div>
        <div class="modal-tag" style="display:block; text-align:center;">Успешно</div>
        <h2 class="modal-title" style="text-align:center; margin-bottom:12px;">Заявка отправлена</h2>
        <p class="modal-subtitle" style="text-align:center; max-width:360px; margin:0 auto 32px;">Ваша заявка принята. Администратор проверит данные и свяжется с вами для подтверждения регистрации.</p>
        <a class="btn-outline" href="#home" data-route="home">На главную</a>
      </div>`;
  });
}
