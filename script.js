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

  // Добавляем обработчик `dragstart` для каждого продукта
  for (let product of rendered) {
    product.addEventListener('dragstart', (e) => {
      currentDraggedElement = e.target;
    });
  }
};

cart.addEventListener('dragover', (e) => {
  e.preventDefault();
});

cart.addEventListener('drop', (e) => {
  e.preventDefault();

  if (currentDraggedElement) {
    const currentCartItems = cartProducts.querySelectorAll('.cart__item').length;
    if (currentCartItems >= maxCartItems) {
      alert('Корзина заполнена. Максимум 3 товара.');
      currentDraggedElement = null;
      return;
    }

    // Получаем индекс перетаскиваемого элемента
    const attr = +currentDraggedElement.getAttribute('data-index');

    // Плавное исчезновение элемента с полки
    currentDraggedElement.classList.add('hidden');

    setTimeout(() => {
      // Проверяем, существует ли элемент перед удалением
      if (currentDraggedElement && currentDraggedElement.parentNode) {
        currentDraggedElement.remove(); // Удаляем элемент с полки после исчезновения
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

      // Сбрасываем текущий перетаскиваемый элемент
      currentDraggedElement = null;
    }, 300); // Задержка на 0.3 секунды для завершения анимации исчезновения
  }
});

renderProductsOnShelf();
