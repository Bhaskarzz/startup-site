(function () {
  'use strict'

  let currentFilter = 'all'
  let currentSort = 'newest'
  let currentItems = [...galleryData]
  let lightboxOpen = false
  let lightboxIndex = 0
  let touchStartX = 0

  const grid = document.getElementById('galleryGrid')
  const filterBtns = document.querySelectorAll('.gallery-filter')
  const sortSelect = document.getElementById('gallerySort')
  const statsEl = document.getElementById('galleryStats')
  const emptyEl = document.getElementById('galleryEmpty')
  const overlay = document.getElementById('lightbox')
  const lbImg = document.getElementById('lbImage')
  const lbTitle = document.getElementById('lbTitle')
  const lbCategory = document.getElementById('lbCategory')
  const lbYear = document.getElementById('lbYear')
  const lbDesc = document.getElementById('lbDesc')
  const lbCounter = document.getElementById('lbCounter')
  const lbClose = document.getElementById('lbClose')
  const lbPrev = document.getElementById('lbPrev')
  const lbNext = document.getElementById('lbNext')

  function getFiltered () {
    let items = currentFilter === 'all'
      ? [...galleryData]
      : galleryData.filter(i => i.cat === currentFilter)

    items.sort((a, b) => {
      if (currentSort === 'newest') return b.year.localeCompare(a.year) || a.title.localeCompare(b.title)
      if (currentSort === 'oldest') return a.year.localeCompare(b.year) || a.title.localeCompare(b.title)
      return a.title.localeCompare(b.title)
    })

    return items
  }

  function render () {
    currentItems = getFiltered()

    if (currentItems.length === 0) {
      grid.innerHTML = ''
      emptyEl.hidden = false
      statsEl.textContent = '0 photos'
      return
    }

    emptyEl.hidden = true
    statsEl.textContent = `${currentItems.length} photo${currentItems.length > 1 ? 's' : ''}`

    grid.innerHTML = currentItems.map((item, i) => {
      const catName = item.cat.charAt(0).toUpperCase() + item.cat.slice(1)
      const classes = ['gallery-item']
      if (i === 0 && currentItems.length > 5) classes.push('featured')
      else if (i % 5 === 1) classes.push('tall')
      else if (i % 7 === 3) classes.push('wide')

      return `
        <div class="${classes.join(' ')}" data-index="${i}" role="button" tabindex="0" aria-label="View ${item.title}">
          <img class="gallery-item-img" src="${item.img}" alt="${item.title}" loading="lazy">
          <span class="gallery-item-year">${item.year}</span>
          <div class="gallery-item-overlay">
            <span class="gallery-item-title">${item.title}</span>
            <div class="gallery-item-tags">
              <span>${catName}</span>
            </div>
          </div>
        </div>
      `
    }).join('')

    grid.querySelectorAll('.gallery-item').forEach(el => {
      el.addEventListener('click', () => openLightbox(parseInt(el.dataset.index)))
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(parseInt(el.dataset.index)) }
      })
    })
  }

  function openLightbox (index) {
    lightboxIndex = index
    lightboxOpen = true
    updateLightbox()
    overlay.hidden = false
    document.body.style.overflow = 'hidden'
    lbClose.focus()
    document.addEventListener('keydown', onKeydown)
  }

  function closeLightbox () {
    lightboxOpen = false
    overlay.hidden = true
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
  }

  function updateLightbox () {
    const item = currentItems[lightboxIndex]
    if (!item) return
    lbImg.src = item.img
    lbImg.alt = item.title
    lbTitle.textContent = item.title
    lbCategory.textContent = item.cat.charAt(0).toUpperCase() + item.cat.slice(1)
    lbYear.textContent = item.year
    lbDesc.textContent = item.desc
    lbCounter.textContent = `${lightboxIndex + 1} / ${currentItems.length}`
  }

  function prevImage () {
    lightboxIndex = (lightboxIndex - 1 + currentItems.length) % currentItems.length
    updateLightbox()
  }

  function nextImage () {
    lightboxIndex = (lightboxIndex + 1) % currentItems.length
    updateLightbox()
  }

  function onKeydown (e) {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
  }

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox()
  })

  lbClose.addEventListener('click', closeLightbox)
  lbPrev.addEventListener('click', prevImage)
  lbNext.addEventListener('click', nextImage)

  overlay.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX
  }, { passive: true })

  overlay.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage()
    }
  }, { passive: true })

  document.getElementById('clearFilters').addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'))
    document.querySelector('.gallery-filter[data-filter="all"]').classList.add('active')
    currentFilter = 'all'
    render()
  })

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentFilter = btn.dataset.filter
      render()
    })
  })

  sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value
    render()
  })

  render()
})()