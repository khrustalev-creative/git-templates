// ==================================================================================================================================================================================
// УДАЛЕНИЕ КЛАССА EDIT ДЛЯ ВСЕХ ЭЛЕМЕНТОВ
// Добавляется в настрйоки сайта в head

// Найти все элементы с классом edit
// const elements = document.querySelectorAll(".edit")
// // Удалить класс у каждого элемента
// elements.forEach((element) => {
//   element.classList.remove("edit")
// })

// document.addEventListener("DOMContentLoaded", () => {
// Повторно найти все элементы с классом editable после загрузки контента
const elementsAfterLoad = document.querySelectorAll(".editable")
// Удалить класс у каждого элемента
elementsAfterLoad.forEach((element) => {
  element.classList.remove("editable")
})
// })

// ==================================================================================================================================================================================
// УДАЛЕНИЕ КОПИРАЙТА ТАПТОП

// document.addEventListener("DOMContentLoaded", () => {
const copyright = document.getElementsByClassName("tt_copyright")[0]
if (copyright) {
  copyright.remove()
}
// })

// ==================================================================================================================================================================================
// УДАЛЕНИЕ КОПИРАЙТА EMBED-CODE

// document.addEventListener("DOMContentLoaded", () => {
const settings = document.getElementsByClassName("settings")[0]
if (settings) {
  settings.style.display = "none"
}
// })

// ==================================================================================================================================================================================
// АКТИВНЫЙ ПУНКТ МЕНЮ

// document.addEventListener("DOMContentLoaded", function () {
// Функция для добавления активного класса
function setActiveMenuItem() {
  // Получаем текущий путь страницы (без домена и параметров)
  const currentPath = window.location.pathname

  // Находим все элементы навигации с атрибутом 'nav'
  const navElements = document.querySelectorAll("[nav]")

  // Проходим по каждому элементу навигации
  navElements.forEach((nav) => {
    // Находим все ссылки внутри элемента навигации
    const links = nav.querySelectorAll("a")

    // Проходим по всем ссылкам
    links.forEach((link) => {
      // Получаем href ссылки
      const linkHref = link.getAttribute("href")

      // Проверяем, что href не пустой и не null
      if (!linkHref) return

      // Преобразуем относительный URL в абсолютный путь
      const linkUrl = new URL(linkHref, window.location.origin)
      const linkPath = linkUrl.pathname

      // Удаляем trailing slash для корректного сравнения
      const normalizedCurrentPath = currentPath.replace(/\/$/, "")
      const normalizedLinkPath = linkPath.replace(/\/$/, "")

      // Проверяем точное совпадение путей
      if (normalizedCurrentPath === normalizedLinkPath) {
        // Получаем текущие классы ссылки
        const currentClasses = link.className.split(" ")

        // Проходим по всем классам ссылки
        currentClasses.forEach((className) => {
          if (className && className.trim() !== "") {
            // Добавляем модификатор --active
            link.classList.add(`${className.trim()}--active`)
          }
        })

        // Также добавляем общий активный класс
        link.classList.add("active")
      }
    })
  })
}

// Вызываем функцию при загрузке страницы
setActiveMenuItem()
// })

// ==================================================================================================================================================================================
// УДАЛЕНИЕ СКРЫТЫХ ЭЛЕМЕНТОВ

// Удаление элементов с классами отображения в зависимости от текущей точки останова (браузерной ширины).
if (!window.ResponsiveDisplayManager) {
  window.ResponsiveDisplayManager = class ResponsiveDisplayManager {
    constructor() {
      this.displayClasses = ["show-laptop", "show-tablet", "show-mobile", "show-laptop-tablet", "show-laptop-mobile", "show-tablet-mobile"]
      this.currentBreakpoint = this.getCurrentBreakpoint()
      this.hiddenElements = new Map()

      if (this.hasDisplayElements()) {
        this.processElements()
        this.setupResizeHandler()
      }
    }

    // Получение брейкпоинтов из CSS переменных
    getBreakpointsFromCSS() {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)

      // Получаем значения из CSS или используем fallback значения
      const breakpoints = {
        mobile: parseInt(computedStyle.getPropertyValue("--breakpoint-mobile").trim()) || 479,
        tablet: parseInt(computedStyle.getPropertyValue("--breakpoint-tablet").trim()) || 991,
        laptop: parseInt(computedStyle.getPropertyValue("--breakpoint-laptop").trim()) || 992,
        desktop: parseInt(computedStyle.getPropertyValue("--breakpoint-desktop").trim()) || 1200,
      }

      console.log("Брейкпоинты из CSS:", breakpoints)
      return breakpoints
    }

    getCurrentBreakpoint() {
      const width = window.innerWidth
      const breakpoints = this.getBreakpointsFromCSS()

      // Определяем брейкпоинт на основе CSS переменных
      if (width <= breakpoints.mobile) return "mobile"
      if (width <= breakpoints.tablet) return "tablet"
      if (width >= breakpoints.laptop) return "laptop"

      // Fallback для промежуточных состояний
      return "tablet"
    }

    // Автоматическое определение видимых классов на основе брейкпоинтов
    getVisibleClasses() {
      const bp = this.currentBreakpoint
      const breakpoints = this.getBreakpointsFromCSS()
      const visibleClasses = []

      // Добавляем базовые классы
      visibleClasses.push(`show-${bp}`)

      // Добавляем комбинированные классы
      if (bp === "mobile") {
        visibleClasses.push("show-laptop-mobile", "show-tablet-mobile")
      } else if (bp === "tablet") {
        visibleClasses.push("show-laptop-tablet", "show-tablet-mobile")
      } else if (bp === "laptop") {
        visibleClasses.push("show-laptop-tablet", "show-laptop-mobile")
      }

      // Автоматически добавляем классы для более широких экранов
      const width = window.innerWidth
      if (width >= breakpoints.desktop) {
        visibleClasses.push("show-desktop")
      }

      return visibleClasses
    }

    hasDisplayElements() {
      const selector = this.displayClasses.map((c) => `.${c}`).join(", ")
      return document.querySelectorAll(selector).length > 0 || this.hiddenElements.size > 0
    }

    hideElement(element) {
      const id = `hidden-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const placeholder = document.createComment(`hidden-element:${id}`)

      this.hiddenElements.set(id, {
        element: element,
        placeholder: placeholder,
        parent: element.parentNode,
      })

      element.parentNode.replaceChild(placeholder, element)
      return id
    }

    restoreAllElements() {
      if (this.hiddenElements.size === 0) return

      const elementsToRestore = new Map(this.hiddenElements)
      elementsToRestore.forEach((info, id) => {
        if (info.placeholder?.parentNode) {
          info.placeholder.parentNode.replaceChild(info.element, info.placeholder)
          this.hiddenElements.delete(id)
        }
      })
    }

    getAllDisplayElements() {
      const elements = []

      // Автоматически ищем все элементы с классами, начинающимися на "show-"
      const allShowElements = document.querySelectorAll('[class*="show-"]')
      allShowElements.forEach((el) => {
        const hasDisplayClass = Array.from(el.classList).some((cls) => cls.startsWith("show-") && !cls.includes("show-desktop"))
        if (hasDisplayClass) elements.push(el)
      })

      // Добавляем скрытые элементы
      this.hiddenElements.forEach((info) => elements.push(info.element))

      return elements
    }

    processElements() {
      const visibleClasses = this.getVisibleClasses()

      this.restoreAllElements()
      const allElements = this.getAllDisplayElements()
      if (allElements.length === 0) return

      allElements.forEach((el) => {
        const elementClasses = Array.from(el.classList)
        const hasVisibleClass = elementClasses.some((cls) => visibleClasses.includes(cls))
        const isInDOM = el.parentNode !== null

        if (!hasVisibleClass && isInDOM) {
          this.hideElement(el)
        }
      })

      // Обработка show-desktop на основе CSS переменных
      const breakpoints = this.getBreakpointsFromCSS()
      if (window.innerWidth < breakpoints.desktop) {
        document.querySelectorAll(".show-desktop").forEach((el) => {
          if (el.parentNode) this.hideElement(el)
        })
      }
    }

    setupResizeHandler() {
      let resizeTimer
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          const newBreakpoint = this.getCurrentBreakpoint()
          if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint
            this.processElements()
          }
        }, 100)
      })
    }
  }
}

// Автоматическая инициализация
const initResponsiveManager = () => {
  // Проверяем наличие элементов с классами "show-"
  if (document.querySelectorAll('[class*="show-"]').length > 0) {
    new window.ResponsiveDisplayManager()
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initResponsiveManager)
} else {
  setTimeout(initResponsiveManager, 100)
}

// СМЕНА ТЕМЫ
// ==================================================================================================================================================================================

const toggleSwitch = document.querySelector(".toggle-button")
const page = document.querySelector("html")
const THEME_KEY = "theme"
const ALT_THEME_ATTR = "alt-theme"

// Загружаем сохраненную тему
const savedTheme = localStorage.getItem(THEME_KEY)
if (savedTheme === ALT_THEME_ATTR) {
  page.setAttribute(ALT_THEME_ATTR, "")
  if (toggleSwitch) toggleSwitch.checked = true
}

function switchTheme(e) {
  if (e.target.checked) {
    page.setAttribute(ALT_THEME_ATTR, "")
    localStorage.setItem(THEME_KEY, ALT_THEME_ATTR)
  } else {
    page.removeAttribute(ALT_THEME_ATTR)
    localStorage.removeItem(THEME_KEY) // или localStorage.setItem(THEME_KEY, '')
  }
}

if (toggleSwitch) {
  toggleSwitch.addEventListener("change", switchTheme, false)
}
// ==================================================================================================================================================================================
// ПЕРЕНОС ПРЕДЛОГОВ
function fixPrepositions(text) {
  const prepositions = ["не", "и", "в", "на", "с", "к", "у", "за", "под", "над", "о", "об", "от", "до", "из", "без", "для"]
  let result = text
  prepositions.forEach((prep) => {
    const regex = new RegExp(`(\\s)(${prep})\\s`, "gi")
    result = result.replace(regex, `$1$2&nbsp;`)
  })
  return result
}
document.querySelectorAll(".text-block-wrap-div").forEach((element) => {
  element.innerHTML = fixPrepositions(element.innerHTML)
})

// ==================================================================================================================================================================================
// RICH-TEXT

function addRichTextClasses() {
  const classMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    blockquote: "blockquote",
    p: "paragraph",
    ul: "paragraph",
    ol: "paragraph",
    a: "lnk",
  }

  document.querySelectorAll(".rich-text").forEach((richText) => {
    Object.entries(classMap).forEach(([tag, className]) => {
      richText.querySelectorAll(tag).forEach((el) => {
        el.classList.add(className)
      })
    })
  })
}

document.addEventListener("DOMContentLoaded", addRichTextClasses)

// ==================================================================================================================================================================================
// АКТИВНЫЙ ЭЛЕМЕНТ НАВИГАЦИИ СООТВЕТСТВУЕТ H1

document.addEventListener("DOMContentLoaded", function () {
  console.log("=== Начало скрипта сравнения текстов ===")

  // Получаем текст из h1 элемента
  const h1Element = document.querySelector("h1")

  if (!h1Element) {
    console.error("❌ Элемент h1 не найден на странице")
    return
  }

  console.log("✅ Найден элемент h1:", h1Element)
  console.log("📋 HTML h1 элемента:", h1Element.outerHTML)

  const h1Text = h1Element.textContent.trim()
  console.log("📝 Текст h1 (очищенный):", `"${h1Text}"`)
  console.log("---")

  // Находим все элементы с классом styleguide__nav-link
  const navLinks = document.querySelectorAll(".styleguide__nav-link")

  console.log(`🔍 Найдено элементов с классом styleguide__nav-link: ${navLinks.length}`)

  if (navLinks.length === 0) {
    console.warn("⚠️ Элементы с классом styleguide__nav-link не найдены")
    return
  }

  // Проходим по каждому элементу
  navLinks.forEach((link, index) => {
    console.log(`\n=== Обработка элемента ${index + 1}/${navLinks.length} ===`)
    console.log("🔗 Элемент link:", link)
    console.log("📋 HTML link элемента:", link.outerHTML)

    // Проваливаемся на самый вложенный элемент
    const deepestElement = link.querySelector("*:last-child") || link

    console.log("📊 Тип deepestElement:", deepestElement.nodeName)
    console.log("🎯 Самый вложенный элемент:", deepestElement)

    if (deepestElement !== link) {
      console.log("📋 HTML самого вложенного элемента:", deepestElement.outerHTML)
    }

    const linkText = deepestElement.textContent.trim()
    console.log("📝 Текст link (очищенный):", `"${linkText}"`)

    console.log("🔄 Сравнение текстов:")
    console.log(`  h1 текст: "${h1Text}"`)
    console.log(`  link текст: "${linkText}"`)
    console.log(`  Совпадают? ${linkText === h1Text ? "✅ ДА" : "❌ НЕТ"}`)

    // Сравниваем тексты
    if (linkText === h1Text) {
      console.log("🎯 Тексты совпадают! Добавляем класс...")

      // Добавляем активный класс
      link.classList.add("styleguide__nav-link--active")

      console.log("✅ Класс styleguide__nav-link--active добавлен")
      console.log("📊 Текущие классы элемента:", link.className)
    } else {
      console.log("⏭️ Тексты не совпадают, пропускаем элемент")
    }

    // Проверяем, был ли добавлен класс (для отладки)
    if (link.classList.contains("styleguide__nav-link--active")) {
      console.log("✔️ Элемент сейчас активен")
    }
  })

  // Финальная статистика
  console.log("\n=== Финальная статистика ===")
  const activeLinks = document.querySelectorAll(".styleguide__nav-link--active")
  console.log(`📊 Всего активных элементов: ${activeLinks.length}`)

  if (activeLinks.length > 0) {
    console.log("📋 Активные элементы:")
    activeLinks.forEach((link, index) => {
      console.log(`  ${index + 1}. ${link.textContent.trim()}`)
    })
  }

  console.log("✅ Скрипт завершен")
  console.log("===========================\n")
})

// Дополнительная функция для ручного тестирования
window.debugStyleGuideLinks = function () {
  console.log("\n=== Ручная отладка ===")
  const h1 = document.querySelector("h1")
  const links = document.querySelectorAll(".styleguide__nav-link")

  console.log("H1 текст:", h1 ? `"${h1.textContent.trim()}"` : "не найден")
  console.log("Найдено ссылок:", links.length)

  links.forEach((link, i) => {
    const text = link.textContent.trim()
    console.log(`Ссылка ${i}: "${text}"`)
  })
}
