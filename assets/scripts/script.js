const products = [
  { img: '1', name: 'vine', cost: 20 },
  { img: '2', name: 'milk', cost: 15 },
  { img: '3', name: 'honey', cost: 38 },
  { img: '4', name: 'cheese', cost: 17 },
  { img: '5', name: 'meat', cost: 34 },
  { img: '6', name: 'chiken', cost: 23 },
  { img: '7', name: 'chips', cost: 14 },
  { img: '8', name: 'pineapple', cost: 19 },
  { img: '9', name: 'banana', cost: 25 },
  { img: '10', name: 'apple', cost: 4 },
  { img: '11', name: 'green', cost: 8 },
];

const shelf = document.querySelector('.shelf');
const cart = document.querySelector('.cart');
const cartProducts = document.querySelector('.cart__products');

let currentDraggedElement = null;
const maxCartItems = 3;

const renderProductsOnShelf = () => {
  let productsList = '';

  products.forEach((product, index) => {
    productsList += `
      <img
        class="shelf__position shelf__position--${index + 1}"
        data-index="${index}"
        draggable="true"
        src="./assets/images/products/${product.img}.svg"
        alt="${product.name}"
      >
    `;
  });

  shelf.innerHTML += productsList;

  const rendered = document.querySelectorAll('.shelf__position');

  // Плавное появление элементов с задержкой
  rendered.forEach((product, index) => {
    setTimeout(() => {
      product.classList.add('visible');
    }, index * 300); // Задержка в 0.3 секунды для каждого элемента
  });

  // Добавляем обработчики для мыши
  for (let product of rendered) {
    product.addEventListener('dragstart', (e) => {
      currentDraggedElement = e.target;
    });

    // Обработчики для сенсорных экранов
    product.addEventListener('touchstart', (e) => {
      currentDraggedElement = e.target;
      e.target.style.position = 'absolute'; // Делаем элемент перемещаемым
    });

    product.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      currentDraggedElement.style.left = `${touch.clientX - 50}px`;
      currentDraggedElement.style.top = `${touch.clientY - 50}px`;
    });

    product.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const dropZone = cart.getBoundingClientRect();

      // Проверяем, находится ли товар над корзиной
      if (
        touch.clientX > dropZone.left &&
        touch.clientX < dropZone.right &&
        touch.clientY > dropZone.top &&
        touch.clientY < dropZone.bottom
      ) {
        handleDropOnCart(currentDraggedElement);
      }

      // Сбрасываем стиль элемента
      currentDraggedElement.style.position = '';
      currentDraggedElement.style.left = '';
      currentDraggedElement.style.top = '';

      currentDraggedElement = null;
    });
  }
};

cart.addEventListener('dragover', (e) => {
  e.preventDefault();
});

cart.addEventListener('drop', (e) => {
  e.preventDefault();
  if (currentDraggedElement) {
    handleDropOnCart(currentDraggedElement);
  }
});

const handleDropOnCart = (draggedElement) => {
  const currentCartItems = cartProducts.querySelectorAll('.cart__item').length;
  if (currentCartItems >= maxCartItems) {
    alert('Корзина заполнена. Максимум 3 товара.');
    return;
  }

  const attr = +draggedElement.getAttribute('data-index');

  // Плавное скрытие элемента на полке
  draggedElement.classList.add('hidden');

  setTimeout(() => {
    // Проверяем, существует ли элемент перед удалением
    if (draggedElement && draggedElement.parentNode) {
      draggedElement.remove(); // Удаляем элемент с полки после исчезновения
    }

    // Создаём новый элемент для корзины
    const cartItem = document.createElement('div');
    cartItem.className = 'cart__item';
    cartItem.innerHTML = `
      <img
        src="./assets/images/products/${products[attr].img}.svg"
        alt="${products[attr].name}"
      >
    `;
    cartProducts.appendChild(cartItem);

    // Плавное появление элемента в корзине
    setTimeout(() => {
      cartItem.classList.add('visible');
    }, 10);
  }, 300); // Задержка на 0.3 секунды для завершения анимации исчезновения
};

renderProductsOnShelf();
