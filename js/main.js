const CITIES = [
  {
    id: 'moscow',
    name: 'Москва',
    img: 'img/moscow.jpg',
    desc: 'Столица волонтёрских инициатив. Много центров помощи и программ сопровождения.',
    news: [
      'Московский марафон добра — 500 участников',
      'Открыты новые точки помощи у метро',
      'Обучение волонтеров сопровождению маломобильных граждан'
    ]
  },
  {
    id: 'spb',
    name: 'Санкт-Петербург',
    img: 'img/spb.jpg',
    desc: 'Город культуры с сильной сетью инклюзивных мероприятий.',
    news: [
      'Фестиваль инклюзивного искусства "Вместе"',
      'Волонтеры помогли оборудовать 12 пандусов',
      'Штаб сопровождения по зрению расширен'
    ]
  },
  {
    id: 'kazan',
    name: 'Казань',
    img: 'img/kazan.jpg',
    desc: 'Региональная поддержка и программы обучения волонтёров.',
    news: [
      'Открыты курсы первой помощи для волонтёров',
      'Запущена программа "Сопровождение 24/7"',
      'Детская инклюзивная студия получила грант'
    ]
  },
  {
    id: 'novosib',
    name: 'Новосибирск',
    img: 'img/novosibirsk.jpg',
    desc: 'Локальные проекты сопровождения и адаптивный спорт.',
    news: [
      'Соревнования по адаптивному спорту собрали 300 участников',
      'Открытие нового волонтёрского центра',
      'Программа сопровождения пожилых граждан'
    ]
  }
];

const EVENTS = [
  { id:1, title:'Онлайн мастер-класс: рисование', city:'moscow', date:'2025-11-05', access:'Онлайн, субтитры', signed:24, people:['Иван','Мария','Сергей'] },
  { id:2, title:'Прогулка в парке с сопровождением', city:'spb', date:'2025-11-12', access:'Пандус, волонтеры', signed:18, people:['Ольга','Павел'] },
  { id:3, title:'IT-курсы для всех', city:'kazan', date:'2025-12-02', access:'Онлайн/Оффлайн', signed:40, people:['Наталья','Игорь','Анна'] },
  { id:4, title:'Адаптивный спорт — тренировка', city:'novosib', date:'2025-11-25', access:'Пандус, тренеры', signed:12, people:['Дмитрий','Ксения'] }
];

const GROUPS = [
  { id:1, name:'Клуб книгочеев', city:'moscow', members:124, tags:['книги','онлайн'] },
  { id:2, name:'Адаптивный спорт', city:'novosib', members:89, tags:['спорт','офлайн'] },
  { id:3, name:'IT & кодинг для всех', city:'kazan', members:201, tags:['it','обучение'] }
];

function el(q){return document.querySelector(q)}
function els(q){return Array.from(document.querySelectorAll(q))}

function openModal(title, img, desc, items){
  const modal = el('#modal'); if(!modal) return
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false')
  el('#modal-title').textContent = title
  if(el('#modal-img')) el('#modal-img').src = img
  el('#modal-desc') && (el('#modal-desc').textContent = desc || '')
  const list = el('#modal-news'); if(list){ list.innerHTML = ''; items && items.forEach(it=>{ const li=document.createElement('li'); li.textContent=it; list.appendChild(li) }) }
}
function closeModal(){ const modal = el('#modal'); if(!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true') }

document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'close-modal') closeModal();
  if(e.target && e.target.classList.contains('modal')) closeModal();
})

document.addEventListener('DOMContentLoaded', ()=>{
  if(el('#cities')){
    const container = el('#cities')
    CITIES.forEach(c=>{
      const d = document.createElement('div'); d.className='card'
      d.innerHTML = `<img src="${c.img}" alt="${c.name}" /><h3>${c.name}</h3><p class="small">${c.desc}</p><div style="margin-top:8px;display:flex;gap:8px"><button class="btn" data-city="${c.id}">Подробнее</button><a class="tag" href="events.html?city=${c.id}">Смотреть события</a></div>`
      container.appendChild(d)
    })
    container.addEventListener('click', (ev)=>{
      const btn = ev.target.closest('button[data-city]'); if(!btn) return
      const city = CITIES.find(c=>c.id===btn.dataset.city)
      openModal(city.name, city.img, city.desc, city.news)
    })
    el('#city-search').addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase()
      els('#cities .card').forEach(card=>{
        const txt = card.textContent.toLowerCase()
        card.style.display = txt.includes(q) ? '' : 'none'
      })
    })
    el('#clear-search').addEventListener('click', ()=>{ el('#city-search').value=''; el('#city-search').dispatchEvent(new Event('input')) })
  }

  if(el('#events')){
    const sel = el('#filter-city')
    CITIES.forEach(c=>{ const o=document.createElement('option'); o.value=c.id; o.textContent=c.name; sel.appendChild(o) })
    const container = el('#events')
    function renderEvents(filter){
      container.innerHTML=''; let list = EVENTS.slice()
      if(filter && filter.city) list = list.filter(it=>it.city===filter.city)
      list.forEach(ev=>{
        const city = CITIES.find(c=>c.id===ev.city)
        const d=document.createElement('div'); d.className='card'
        d.innerHTML = `<h3>${ev.title}</h3><p class="small">${city.name} · ${ev.date} · ${ev.access}</p><div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center"><div class="badge">${ev.signed} записано</div><div><button class="btn" data-ev="${ev.id}">Подробнее</button></div></div>`
        container.appendChild(d)
      })
    }
    renderEvents()
    el('#event-search').addEventListener('input',(e)=>{
      const q=e.target.value.trim().toLowerCase()
      const filtered = EVENTS.filter(ev=> (ev.title+''+ev.date).toLowerCase().includes(q) || (CITIES.find(c=>c.id===ev.city).name.toLowerCase().includes(q)) )
      container.innerHTML=''; filtered.forEach(ev=>{
        const city = CITIES.find(c=>c.id===ev.city)
        const d=document.createElement('div'); d.className='card'
        d.innerHTML = `<h3>${ev.title}</h3><p class="small">${city.name} · ${ev.date} · ${ev.access}</p><div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center"><div class="badge">${ev.signed} записано</div><div><button class="btn" data-ev="${ev.id}">Подробнее</button></div></div>`
        container.appendChild(d)
      })
    })
    sel.addEventListener('change', ()=>{ renderEvents({city: sel.value}) })
    container.addEventListener('click',(ev)=>{
      const b = ev.target.closest('button[data-ev]'); if(!b) return
      const evObj = EVENTS.find(x=>x.id==b.dataset.ev)
      const city = CITIES.find(c=>c.id===evObj.city)
      openModal(evObj.title, city.img, `${city.name} · ${evObj.date} · ${evObj.access}`, evObj.people)
    })
  }

  if(el('#groups')){
    const sel = el('#group-city')
    CITIES.forEach(c=>{ const o=document.createElement('option'); o.value=c.id; o.textContent=c.name; sel.appendChild(o) })
    const container = el('#groups')
    function renderGroups(filter){
      container.innerHTML=''
      let list = GROUPS.slice()
      if(filter && filter.city) list = list.filter(g=>g.city===filter.city)
      list.forEach(g=>{
        const city = CITIES.find(c=>c.id===g.city)
        const d=document.createElement('div'); d.className='card'
        d.innerHTML = `<h3>${g.name}</h3><p class="small">${city.name} · Участников: ${g.members}</p><div style="margin-top:8px"><span class="tag">${g.tags.join('</span> <span class="tag">')}</span></div>`
        container.appendChild(d)
      })
    }
    renderGroups()
    el('#group-search').addEventListener('input',(e)=>{
      const q=e.target.value.trim().toLowerCase()
      const filtered = GROUPS.filter(g=> (g.name+g.tags.join(' ')).toLowerCase().includes(q) )
      container.innerHTML=''; filtered.forEach(g=>{
        const city = CITIES.find(c=>c.id===g.city)
        const d=document.createElement('div'); d.className='card'
        d.innerHTML = `<h3>${g.name}</h3><p class="small">${city.name} · Участников: ${g.members}</p><div style="margin-top:8px"><span class="tag">${g.tags.join('</span> <span class="tag">')}</span></div>`
        container.appendChild(d)
      })
    })
    sel.addEventListener('change', ()=>{ renderGroups({city: sel.value}) })
    el('#request-form').addEventListener('submit',(e)=>{
      e.preventDefault()
      const name = el('#req-name').value.trim(); const city = el('#req-city').value.trim(); const dt = el('#req-date').value.trim(); const note=el('#req-note').value.trim()
      if(!name||!city||!dt){ el('#req-result').innerHTML = '<div class="small" style="color:#b91c1c">Заполните все обязательные поля</div>'; return }
      el('#req-result').innerHTML = '<div class="small" style="color:green">Запрос отправлен локальным волонтёрам — ожидайте подтверждения</div>'
      el('#request-form').reset()
    })
    el('#req-clear').addEventListener('click', ()=> el('#request-form').reset())
  }
})
