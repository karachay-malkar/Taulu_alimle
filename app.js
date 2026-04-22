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
  const route = anchor.getAttribute('data-route');
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

function renderRoute() {
  const { route, id } = getRoute();
  setActiveNav(route);

  switch (route) {
    case 'home':
      renderHome();
      break;
    case 'about':
      renderAbout();
      break;
    case 'doctors':
      renderPeopleSection('doctors');
      break;
    case 'candidates':
      renderPeopleSection('candidates');
      break;
    case 'person':
      renderPerson(id);
      break;
    case 'news':
      renderNewsLike('news');
      break;
    case 'events':
      renderNewsLike('events');
      break;
    case 'library':
      renderLibrary();
      break;
    case 'contacts':
      renderContacts();
      break;
    case 'register':
      renderRegistration();
      break;
    default:
      renderHome();
      break;
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function setActiveNav(route) {
  document.querySelectorAll('[data-route]').forEach((link) => {
    link.classList.toggle('active', link.dataset.route === route);
  });
}

function getAllPeople() {
  return [...data.doctors, ...data.candidates];
}

function getPersonFullName(person) {
  return [person.lastName, person.firstName, person.middleName].filter(Boolean).join(' ');
}

function getPersonShort(person) {
  return `${person.lastName} ${person.firstName?.[0] || ''}.${person.middleName?.[0] || ''}.`;
}

function getPersonFiles(personId) {
  return data.files.filter((item) => item.personId === personId);
}

function backLink(label, target = 'home') {
  return `<div class="container section-shell"><button class="btn btn-outline" onclick="location.hash='#${target}'">← ${label}</button>`;
}

function renderHome() {
  const totalPeople = data.doctors.length + data.candidates.length;
  app.innerHTML = `
    <section class="hero">
      <div class="container hero-grid">
        <div class="glass-card">
          <div class="badge-row">
            <span class="badge">Научный каталог</span>
            <span class="badge">Библиотека PDF</span>
            <span class="badge">Модерация заявок</span>
          </div>
          <h1 class="hero-title">Единый сайт проекта «Таулу Алимле»</h1>
          <p class="hero-text">Главная страница объединяет каталог докторов и кандидатов наук, новости, мероприятия, библиотеку публикаций и регистрацию участников. Архитектура построена с расчётом на масштабируемый каталог людей и материалов.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#doctors" data-route="doctors">Открыть каталог</a>
            <a class="btn btn-secondary" href="#register" data-route="register">Подать заявку</a>
          </div>
          <div class="section-anchors">
            <a class="anchor-card" href="#about" data-route="about"><strong>О проекте</strong><span>Описание проекта и логики сайта.</span></a>
            <a class="anchor-card" href="#library" data-route="library"><strong>Библиотека</strong><span>Файлы авторов с фильтрацией.</span></a>
            <a class="anchor-card" href="#news" data-route="news"><strong>Новости</strong><span>Лента новостей проекта.</span></a>
            <a class="anchor-card" href="#events" data-route="events"><strong>Мероприятия</strong><span>Анонсы событий и встреч.</span></a>
          </div>
        </div>
        <div class="stat-grid">
          <article class="stat-card">
            <div class="stat-label">Карточек людей</div>
            <div class="stat-value">${totalPeople}</div>
            <div class="stat-note">Структура подготовлена под масштабирование до большого каталога персональных страниц.</div>
          </article>
          <article class="stat-card">
            <div class="stat-label">Доктора наук</div>
            <div class="stat-value">${data.doctors.length}</div>
            <div class="stat-note">Список людей с фильтрами по алфавиту и отрасли науки.</div>
          </article>
          <article class="stat-card">
            <div class="stat-label">Кандидаты наук</div>
            <div class="stat-value">${data.candidates.length}</div>
            <div class="stat-note">Отдельный раздел с идентичной логикой каталога.</div>
          </article>
          <article class="stat-card">
            <div class="stat-label">Файлы в библиотеке</div>
            <div class="stat-value">${data.files.length}</div>
            <div class="stat-note">Книги и статьи автора связаны с библиотекой и доступны для скачивания.</div>
          </article>
        </div>
      </div>
    </section>

    <section class="section-shell">
      <div class="container panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Разделы сайта</h2>
            <p class="panel-subtitle">Структура создана на основе технического задания: главная страница, каталог ученых, новости, мероприятия, библиотека, контакты и регистрация. fileciteturn0file0L1-L23</p>
          </div>
        </div>
        <div class="grid-4">
          ${summaryCard('О проекте', 'Текстовое описание проекта и его задач.')}
          ${summaryCard('Доктора наук', 'Список людей, фильтры и детальные страницы с публикациями.')}
          ${summaryCard('Кандидаты наук', 'Аналогичная архитектура каталога для второй группы ученых.')}
          ${summaryCard('Новости', 'Лента карточек с изображением, датой и текстом.')}
          ${summaryCard('Мероприятия', 'Блок анонсов, построенный по той же модели, что и новости.')}
          ${summaryCard('Библиотека', 'Публикации, связанные с карточками авторов, с фильтрами.')}
          ${summaryCard('Контакты', 'Отдельная страница с контактной информацией проекта.')}
          ${summaryCard('Регистрация', 'Форма подачи заявки с согласием на обработку данных и ручной модерацией.')}
        </div>
      </div>
    </section>
  `;
}

function summaryCard(title, text) {
  return `
    <article class="news-card">
      <div class="news-image">ТА</div>
      <h3 class="card-title">${title}</h3>
      <div class="card-text">${text}</div>
    </article>
  `;
}

function renderAbout() {
  app.innerHTML = `
    ${backLink('На главную')}
      <div class="panel">
        <div class="panel-header">
          <div>
            <h1 class="panel-title">${data.about.title}</h1>
            <p class="panel-subtitle">Раздел «О проекте» содержит текстовое описание проекта. fileciteturn0file0L11-L13</p>
          </div>
        </div>
        <div class="grid-2">
          <article class="detail-card">
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">Описание</div>
                <div class="info-value">${data.about.text}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Архитектурная логика</div>
                <div class="info-value">Сайт сделан как одностраничное приложение с динамической маршрутизацией по хэшу. Это позволяет хранить каталог людей и материалов в данных и масштабировать количество страниц без ручной сборки сотен отдельных HTML-файлов.</div>
              </div>
            </div>
          </article>
          <article class="detail-card">
            <div class="info-label">Задачи проекта</div>
            <ul class="list-clean">
              ${data.about.goals.map((goal) => `<li>${goal}</li>`).join('')}
            </ul>
          </article>
        </div>
      </div>
    </div>
  `;
}

function renderPeopleSection(type) {
  const collection = data[type];
  const title = type === 'doctors' ? 'Доктора наук' : 'Кандидаты наук';
  const subtitle = type === 'doctors'
    ? 'Раздел строится из списка людей, содержит фильтры по алфавиту и по отрасли науки, а также ссылки на детальные страницы. fileciteturn0file0L14-L29'
    : 'Функционал раздела полностью повторяет раздел докторов наук: список, фильтры, страница человека и публикации. fileciteturn0file0L30-L32';

  app.innerHTML = `
    ${backLink('На главную')}
      <div class="panel">
        <div class="panel-header">
          <div>
            <h1 class="panel-title">${title}</h1>
            <p class="panel-subtitle">${subtitle}</p>
          </div>
        </div>
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
        <div id="peopleResult" class="grid-3"></div>
      </div>
    </div>
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
      return (!query || name.includes(query))
        && (!branch || person.branch === branch)
        && (!letter || person.lastName[0].toUpperCase() === letter);
    });
    result.innerHTML = filtered.length ? filtered.map(renderPersonCard).join('') : `<div class="empty-state">Ничего не найдено по выбранным фильтрам.</div>`;
  };

  [searchInput, branchFilter, letterFilter].forEach((el) => el.addEventListener('input', update));
  update();
}

function renderPersonCard(person) {
  return `
    <article class="person-card">
      <div class="person-top">
        <div class="person-avatar">${person.photoInitials}</div>
        <div>
          <div class="person-name">${getPersonFullName(person)}</div>
          <div class="person-role">${person.degree}</div>
        </div>
      </div>
      <div class="badge-row">
        <span class="badge">${person.branch}</span>
        <span class="badge">${getPersonFiles(person.id).length} публикац.</span>
      </div>
      <div class="person-meta">${person.work}</div>
      <div class="person-actions">
        <a class="btn btn-primary" href="#person/${person.id}" data-route="person">Открыть анкету</a>
      </div>
    </article>
  `;
}

function renderPerson(id) {
  const person = getAllPeople().find((item) => item.id === id);
  if (!person) {
    app.innerHTML = `${backLink('Назад', 'home')}<div class="panel"><div class="empty-state">Карточка человека не найдена.</div></div></div>`;
    return;
  }
  const files = getPersonFiles(person.id);
  app.innerHTML = `
    ${backLink('К списку', data.doctors.some((item) => item.id === id) ? 'doctors' : 'candidates')}
      <div class="panel">
        <div class="panel-header">
          <div>
            <h1 class="panel-title">${getPersonFullName(person)}${person.maidenName ? ` (${person.maidenName})` : ''}</h1>
            <p class="panel-subtitle">На странице отображается информация по анкете, при этом телефон и email не выводятся, а публикации доступны для скачивания. fileciteturn0file0L17-L29</p>
          </div>
        </div>
        <div class="detail-layout">
          <article class="detail-card">
            <div class="detail-avatar">${person.photoInitials}</div>
            <div class="badge-row" style="margin-top:16px;">
              <span class="badge">${person.degree}</span>
              <span class="badge">${person.branch}</span>
            </div>
            <div class="notice" style="margin-top:16px;">Телефон и email сохранены в анкете как данные регистрации, но на публичной странице не отображаются.</div>
          </article>
          <article class="detail-card">
            <div class="info-list">
              ${infoItem('Дата / место рождения', person.birth)}
              ${infoItem('Образование', person.education)}
              ${infoItem('Послевузовское образование', person.postgraduate)}
              ${infoItem('Учёная степень и звание', person.titleInfo)}
              ${infoItem('Тема диссертации', person.thesis)}
              ${infoItem('Место работы', person.work)}
              ${infoItem('Основные научные публикации', `<ul class="list-clean">${person.publications.map((item) => `<li>${item}</li>`).join('')}</ul>`)}
            </div>
          </article>
        </div>
        <div class="panel" style="margin-top:22px; padding:22px;">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Публикации автора</h2>
              <p class="panel-subtitle">Каждый файл содержит название, отрасль науки и год публикации, как указано в ТЗ. fileciteturn0file0L21-L29</p>
            </div>
          </div>
          <div class="grid-3">
            ${files.map(renderFileCard).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function infoItem(label, value) {
  return `
    <div class="info-item">
      <div class="info-label">${label}</div>
      <div class="info-value">${value}</div>
    </div>
  `;
}

function renderNewsLike(type) {
  const items = data[type];
  const title = type === 'news' ? 'Новости' : 'Мероприятия';
  const subtitle = type === 'news'
    ? 'Раздел выполнен в формате ленты карточек: изображение и текстовое описание новости. fileciteturn0file0L33-L35'
    : 'Функционал раздела мероприятий построен аналогично новостям. fileciteturn0file0L36-L38';

  app.innerHTML = `
    ${backLink('На главную')}
      <div class="panel">
        <div class="panel-header">
          <div>
            <h1 class="panel-title">${title}</h1>
            <p class="panel-subtitle">${subtitle}</p>
          </div>
        </div>
        <div class="grid-3">
          ${items.map((item) => `
            <article class="news-card">
              <div class="news-image">${type === 'news' ? 'NEWS' : 'EVENT'}</div>
              <h3 class="card-title">${item.title}</h3>
              <div class="card-meta">${item.date}</div>
              <p class="card-text">${item.text}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderLibrary() {
  app.innerHTML = `
    ${backLink('На главную')}
      <div class="panel">
        <div class="panel-header">
          <div>
            <h1 class="panel-title">Библиотека</h1>
            <p class="panel-subtitle">В библиотеке отображаются файлы, загруженные авторами на свои страницы. Доступны фильтры по фамилии автора и отрасли науки. fileciteturn0file0L39-L47</p>
          </div>
        </div>
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
        <div id="libraryResult" class="grid-3"></div>
      </div>
    </div>
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
      return (!q || person?.lastName.toLowerCase().includes(q))
        && (!b || file.branch === b)
        && (!y || String(file.year) === y);
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
      <span class="file-pill">${file.type}</span>
      <h3 class="file-title">${file.title}</h3>
      <div class="file-meta">Автор: ${person ? getPersonShort(person) : '—'}</div>
      <div class="file-meta">Отрасль науки: ${file.branch}</div>
      <div class="file-meta">Год публикации: ${file.year}</div>
      <div class="card-actions">
        <a class="btn btn-outline" href="${file.url}" download>Скачать PDF</a>
        ${person ? `<a class="btn btn-primary" href="#person/${person.id}" data-route="person">Страница автора</a>` : ''}
      </div>
    </article>
  `;
}

function renderContacts() {
  app.innerHTML = `
    ${backLink('На главную')}
      <div class="panel">
        <div class="panel-header">
          <div>
            <h1 class="panel-title">Контакты</h1>
            <p class="panel-subtitle">Раздел предназначен для вывода текстовой контактной информации. fileciteturn0file0L48-L51</p>
          </div>
        </div>
        <div class="contact-grid">
          <article class="contact-card">
            <div class="info-label">Телефон</div>
            <div class="info-value">${data.contacts.phone}</div>
          </article>
          <article class="contact-card">
            <div class="info-label">Email</div>
            <div class="info-value">${data.contacts.email}</div>
          </article>
          <article class="contact-card">
            <div class="info-label">Адрес</div>
            <div class="info-value">${data.contacts.address}</div>
          </article>
        </div>
      </div>
    </div>
  `;
}

function renderRegistration() {
  app.innerHTML = `
    ${backLink('На главную')}
      <div class="panel">
        <div class="panel-header">
          <div>
            <h1 class="panel-title">Регистрация</h1>
            <p class="panel-subtitle">Форма собирает ФИО, степень, направление наук и согласие на обработку данных. Подтверждение регистрации выполняется после ручной модерации администратором. fileciteturn0file0L52-L64</p>
          </div>
        </div>
        <div class="grid-2">
          <article class="form-card">
            <form id="registrationForm">
              <div class="form-grid">
                <input class="field" name="lastName" placeholder="Фамилия" required />
                <input class="field" name="firstName" placeholder="Имя" required />
                <input class="field" name="middleName" placeholder="Отчество" />
                <select class="field" name="rank" required>
                  <option value="">Доктор / кандидат</option>
                  <option>Доктор наук</option>
                  <option>Кандидат наук</option>
                </select>
                <input class="field" name="science" placeholder="Каких наук" required />
                <input class="field" name="email" placeholder="Email" type="email" required />
              </div>
              <div class="checkbox-row" style="margin-top:14px;">
                <input id="consent" type="checkbox" required />
                <label for="consent">Согласие на обработку и хранение персональных данных.</label>
              </div>
              <div class="form-actions" style="margin-top:16px;">
                <button class="btn btn-primary" type="submit">Отправить заявку</button>
              </div>
            </form>
          </article>
          <article class="detail-card">
            <div class="info-list">
              ${infoItem('Логика обработки', 'После отправки форма показывает статус принятия заявки. В реальной продакшн-версии данные должны уходить в серверную часть или админ-панель на ручную модерацию.')}
              ${infoItem('Безопасность', 'Публичный фронтенд не должен самостоятельно подтверждать регистрацию. Решение о допуске пользователя принимает администратор сайта.')}
              ${infoItem('Дальнейшее развитие', 'Следующий этап — подключение БД, панели администратора, хранения PDF-файлов и реальной авторизации.')}
            </div>
          </article>
        </div>
      </div>
    </div>
  `;

  document.getElementById('registrationForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Заявка отправлена. Статус: ожидает ручной модерации администратора.');
    event.target.reset();
  });
}
