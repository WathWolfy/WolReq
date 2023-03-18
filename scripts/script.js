document.addEventListener("DOMContentLoaded", () => {
  const mediaQuery = window.matchMedia("(max-width: 1100px)"),
    links = document.querySelector(".links"),
    tryButton = document.querySelector("header .container .try-button"),
    menuIcon = document.querySelector(".menu-icon"),
    icon = document.querySelector("header .container .icon"),
    menu = document.querySelector(".menu"),
    openedMenuIcon = document.querySelector(".menu-icon-opened"),
    openedMenu = document.querySelector(".opened-menu"),
    toggleCategories = document.querySelectorAll(".toggle-categories div"),
    stats = document.querySelector(".stats"),
    arrowDown = document.querySelector(".arrow-down"),
    smoothScrollToForm = document.getElementById("form-req"),
    pages = document.querySelectorAll(".page-number"),
    prevPage = document.querySelector(".prev-page"),
    nextPage = document.querySelector(".next-page"),
    toggleForms = document.querySelectorAll(".toggle-forms div"),
    chooseForms = document.querySelectorAll(".start-form"),
    registerType = document.querySelector(".register-types"),
    organisationRegistrationInputs = document.querySelectorAll('[data-registration-type="organisation"]'),
    formSubtitle = document.querySelector('.form-subtitle.register');

  let numberStat = document.querySelectorAll(".number-stat");


  if (arrowDown !== null) {
    arrowDown.addEventListener("click", function () {
      smoothScrollToForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }


  function handleTabletChange(e) {
    const hiddenClass = "hidden";
    const showClass = "show";
    const matches = e.matches;

    links.classList.toggle(hiddenClass, matches);
    tryButton.classList.toggle(hiddenClass, matches);
    menuIcon.classList.toggle(hiddenClass, !matches);
    icon.style.marginLeft = matches ? "30px" : "0";
    menu.style.margin = matches ? "20px 30px 0 0" : "20px 0 0 0";
    openedMenuIcon.classList.add(hiddenClass);
    openedMenu.classList.remove(showClass);
  }

  mediaQuery.addListener(handleTabletChange);
  handleTabletChange(mediaQuery);


  function openMenu(menuButton) {
    menuButton.addEventListener("click", function () {
      menuIcon.classList.toggle("hidden");
      openedMenuIcon.classList.toggle("hidden");
      openedMenu.classList.toggle("show");
    });
  }

  openMenu(menuIcon);
  openMenu(openedMenuIcon);


  function changeFunction(elements, selector) {
    elements.forEach((element) => {
      element.addEventListener("click", function () {
        document.querySelector("." + selector).classList.remove(selector);
        element.classList.add(selector);
      });
    });
  }

  changeFunction(toggleCategories, "selected-category");
  changeFunction(pages, "selected-page");


  function animateValue(numberOfStat, start, end, duration) {
    let range = end - start;
    let minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    let startTime = performance.now();
    let endTime = startTime + duration;
    let lastFrame = startTime;

    function run(timestamp) {
      if (timestamp < endTime) {
        let elapsed = timestamp - startTime;
        let remaining = Math.max((endTime - timestamp) / duration, 0);
        let value = Math.round(end - remaining * range);
        numberOfStat.innerHTML = value + "+";
        requestAnimationFrame(run);
      } else {
        numberOfStat.innerHTML = end + "+";
      }
    }

    requestAnimationFrame(run);
  }

  const maxValues = [105000, 425500, 1560000];
  let incrementUpdate = 1200;

  if (stats !== null) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          numberStat.forEach((stat, index) => {
            if (stat.getAttribute("data-animated") !== "true") {
              animateValue(
                stat,
                Number(stat.innerHTML),
                maxValues[index],
                incrementUpdate
              );
              stat.setAttribute("data-animated", "true");
            }
          });
          observer.disconnect();
        }
      });
    });
    observer.observe(stats);
  }


  function getToPage(selector, pages, direction) {
    selector.addEventListener("click", function () {
      const selectedPage = document.querySelector(".selected-page");
      let indexOfSelectedPage = Array.from(pages).indexOf(selectedPage);

      indexOfSelectedPage =
        direction === "next"
          ? indexOfSelectedPage + 1 >= pages.length
            ? pages.length - 1
            : indexOfSelectedPage + 1
          : indexOfSelectedPage - 1 < 0
            ? 0
            : indexOfSelectedPage - 1;

      selectedPage.classList.remove("selected-page");
      pages[indexOfSelectedPage].classList.add("selected-page");
    });
  }

  if (pages !== null && prevPage !== null && nextPage !== null) {
    getToPage(prevPage, pages, "prev");
    getToPage(nextPage, pages, "next");
  }


  function showForm(forms, selectedForms) {
    selectedForms.forEach((form) => {
      form.addEventListener("click", function () {
        switch (form.textContent) {
          case "Регистрация":
            forms.forEach((clickedForm, index) => {
              index === 0 ? clickedForm.classList.remove('hidden') : clickedForm.classList.add('hidden');
            });
            break;
          default:
            forms.forEach((clickedForm, index) => {
              index === 0 ? clickedForm.classList.add('hidden') : clickedForm.classList.remove('hidden');
            });
        }
        document.querySelector(".selected-form").classList.remove("selected-form");
        form.classList.add("selected-form");
      });
    });
  };

  showForm(chooseForms, toggleForms);


  function changeRegisterType(types) {
    types.addEventListener('change', function () {
      if (types.value == "organisation") {
        organisationRegistrationInputs.forEach(input => {
          input.classList.toggle('hidden', false);
          formSubtitle.innerHTML = 'Впервые на нашем сайте? Создайте аккаунт и получите <span>бесплатный</span> доступ ко всем возможностям на <span>7 дней.</span>';
        });
      }
      else {
        organisationRegistrationInputs.forEach(input => {
          input.classList.toggle('hidden', true);
          formSubtitle.innerHTML = 'Являетесь работником организации, использующую данную систему? Тогда вам <span>к нам!</span>';
        });
      }
    });
  };

  changeRegisterType(registerType);
});
