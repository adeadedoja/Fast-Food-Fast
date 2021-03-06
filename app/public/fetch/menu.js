const myToken = localStorage.getItem('user_token');

const foodItems = [];
let cartCount = 0;
const cartCountDiv = document.getElementById('cart-count');
if (cartCountDiv === null) { } else {
  document.getElementById('cart-count').innerHTML = cartCount;
}
const btnAddFood = document.getElementById('btn-add-food');
const btnUpdateFood = document.getElementById('btn-edit-food');

//  Function to load the category list to the add new menu item page
const loadCategories = () => {
  const addFooddiv = document.getElementById('add-food-div');
  const editMenuDiv = document.getElementById('edit-food-div');
  fetch('https://fast-foodfastapp.herokuapp.com/api/v1/category', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .then((data) => {
      const { categories } = data;
      let output = '<option>...Select...</option>';
      categories.forEach((category) => {
        output += `
        <option value="${category.category_id}">${category.category_name}</option>
        `;
      });
      if (addFooddiv === null) {
      } else {
        document.getElementById('category-list').innerHTML = output;
      }
      if (editMenuDiv === null) { } else {
        document.getElementById('category-list').innerHTML = output;
      }
    });
};

//  Function to retrieve menu items for guests
const getMenu = () => {
  const menuDiv = document.getElementById('menu-output');
  fetch('https://fast-foodfastapp.herokuapp.com/api/v1/menu', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .then((data) => {
      const { menu } = data;
      let output = '';
      menu.forEach((food) => {
        output += `
          <div class="item">
            <div class="item-container">
              <div class="img-container">
                <img class="img-fluid" src="${food.image}" />
              </div>
              <div class="item-details">
                <h3>${food.food_name}</h3>
                <p>Price: <span class="price-figure">&#8358;${food.price}</span></p>
                <p>Description: ${food.description}</p>
                <p>Category: ${food.category_name}</p>
              </div>
              <button class="blue-bg-colour white-text">
                <a href="login.html" class="white-text" data-id="${food.food_id}">Add to cart</a>
              </button>
            </div>
          </div>
        `;
      });
      if (menuDiv === null) {
      } else {
        document.getElementById('menu-output').innerHTML = output;
      }
    });
};

//  Function to get the latest menu items on the homepage
const getLatestmenu = () => {
  const latestMenudiv = document.getElementById('latest-output');
  fetch('https://fast-foodfastapp.herokuapp.com/api/v1/menu', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .then((data) => {
      const { menu } = data;
      let output = '';
      menu.slice(-4).forEach((food) => {
        output += `
          <div class="item">
            <div class="item-container">
              <div class="img-container">
                <img class="img-fluid" src="${food.image}" />
              </div>
              <div class="item-details">
                <h3>${food.food_name}</h3>
                <p>Price: <span class="price-figure">&#8358;${food.price}</span></p>
                <p>Description: ${food.description}</p>
                <p>Category: ${food.category_name}</p>
              </div>
              <button class="blue-bg-colour white-text">
                <a href="login.html" class="white-text" data-id="${food.food_id}">Add to cart</a>
              </button>
            </div>
          </div>
        `;
      });
      if (latestMenudiv === null) {
      } else {
        document.getElementById('latest-output').innerHTML = output;
      }
    });
};

//  function to add new food objects to cart
const addTocart = (newFood) => {
  const result = foodItems.find(food => food.food_id === newFood.food_id);
  if (result) {
    window.alert('You have added this item already');
  } else {
    foodItems.push(newFood);
    cartCount = foodItems.length;
    document.getElementById('cart-count').innerHTML = cartCount;
    const foodItemsstring = JSON.stringify(foodItems);
    localStorage.setItem('food_items', foodItemsstring);
    if (cartCount < 1) {
      document.getElementById('cart-text').innerHTML = 'Your cart is empty';
    } else {
      document.getElementById('cart-text').innerHTML = `Your cart contains ${cartCount} items`;
    }
  }
};

//  function to retrieve menu items for logged in users
const getUsermenu = () => {
  const userMenudiv = document.getElementById('user-output');
  fetch('https://fast-foodfastapp.herokuapp.com/api/v1/menu', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .then((data) => {
      const { menu } = data;
      let output = '';
      menu.forEach((food) => {
        output += `
          <div class="item">
            <div class="item-container">
              <div class="img-container">
                <img class="img-fluid" src="${food.image}" />
              </div>
              <div class="item-details">
                <h3>${food.food_name}</h3>
                <p>Price: <span class="price-figure">&#8358;${food.price}</span></p>
                <p>Description: ${food.description}</p>
                <p>Category: ${food.category_name}</p>
              </div>
              <button class="blue-bg-colour white-text">
                <a class="btn-add-cart" class="white-text" data-id="${food.food_id}" data-name="${food.food_name}" data-price="${food.price}" data-image="${food.image}">Add to cart</a>
              </button>
            </div>
          </div>
        `;
      });
      if (userMenudiv === null) {
      } else {
        document.getElementById('user-output').innerHTML = output;
        const flexDiv = document.getElementById('user-output');

        flexDiv.addEventListener('click', (event) => {
          if (event.target && event.target.matches('a.btn-add-cart')) {
            const btnAddtoCart = event.target;
            const foodId = btnAddtoCart.getAttribute('data-id');
            const foodName = btnAddtoCart.getAttribute('data-name');
            const foodPrice = btnAddtoCart.getAttribute('data-price');
            const foodImage = btnAddtoCart.getAttribute('data-image');
            const foodQuantity = '1';
            const newFood = {
              food_id: foodId,
              food_name: foodName,
              food_price: foodPrice,
              quantity: foodQuantity,
              food_image: foodImage,
            };
            addTocart(newFood);
          }
        });
      }
    });
};

//  function to delete a selected menu item from the menu list
const deleteMenuItem = (foodId) => {
  fetch(`https://fast-foodfastapp.herokuapp.com/api/v1/menu/${foodId}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'x-access-token': myToken,
    },
  }).then(response => response.json())
    .then(() => {
      window.location.href = '/admin/delete-food-successful.html';
    })
    .catch((error) => {
      console.log(error);
    });
};

//  Function to retrieve menu items on admin frontend
const getAdminmenu = () => {
  const adminMenudiv = document.getElementById('admin-output');
  fetch('https://fast-foodfastapp.herokuapp.com/api/v1/menu', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .then((data) => {
      const { menu } = data;
      let adminOutput = '';
      menu.forEach((food) => {
        adminOutput += `
          <div class="item">
            <div class="item-container">
              <div class="img-container">
                <img class="img-fluid" src="${food.image}" alt="pastery" />
              </div>
              <div class="item-details">
                <h5>ID: ${food.food_id}</h5>
                <h3>${food.food_name}</h3>
                <p>Price: <span class="price-figure">&#8358;${food.price}</span></p>
                <p>Description: ${food.description}</p>
                <p>Category: ${food.category_name}</p>
              </div>
              <button class="green-bg">
                <a href="edit-food-items.html?food_id=${food.food_id}" data-id="${food.food_id} class="white-text">Edit</a>
              </button>
              <button class="red-bg-colour">
                <a href="" class="white-text delete-item" data-id="${food.food_id}">Delete</a>
              </button>
            </div>
          </div>
        `;
      });
      if (adminMenudiv === null) {
      } else {
        document.getElementById('admin-output').innerHTML = adminOutput;
      }
      adminMenudiv.addEventListener('click', (event) => {
        if (event.target && event.target.matches('a.delete-item')) {
          const btnDeleteItem = event.target;
          const foodId = btnDeleteItem.getAttribute('data-id');
          console.log(foodId);
          const acceptConfirm = window.confirm('Do you really want to delete this menu item?');
          if (acceptConfirm === true) {
            console.log('does it get here?');
            deleteMenuItem(foodId);
          }
        }
      });
    });
};

//  Function to add a new menu item
const addMenu = () => {
  const name = document.getElementById('food-name').value;
  const foodPrice = document.getElementById('food-price').value;
  const foodImage = document.getElementById('food-image').value;
  const category = document.getElementById('category-list').value;
  const foodDescription = document.getElementById('food-description').value;
  fetch('https://fast-foodfastapp.herokuapp.com/api/v1/menu', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-type': 'application/json',
      'x-access-token': myToken,
    },
    body: JSON.stringify({
      foodName: name,
      categoryId: category,
      price: foodPrice,
      description: foodDescription,
      image: foodImage,
    }),
  })
    .then(response => response.json())
    .then(() => {
      window.location.href = '/admin/add-food-successful.html';
    })
    .catch((error) => {
      console.log(error);
    });
};

if (btnAddFood === null) { } else {
  btnAddFood.addEventListener('click', (event) => {
    event.preventDefault();
    addMenu();
  });
}

//  Function to load the details of the selected menu item on the edit page
const loadMenuDetails = () => {
  const editMenuDiv = document.getElementById('edit-food-div');
  const urlString = window.location.href;
  const url = new URL(urlString);
  const foodId = url.searchParams.get('food_id');
  if (foodId === null) {
  } else {
    fetch(`https://fast-foodfastapp.herokuapp.com/api/v1/menu/${foodId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': myToken,
      },
    }).then(response => response.json())
      .then((data) => {
        const { menuItem } = data;
        if (editMenuDiv === null) { } else {
          document.getElementById('item-no').innerHTML = `${menuItem.food_id}`;
          document.getElementById('category-list').value = `${menuItem.category_name}`;
          document.getElementById('food-name').value = `${menuItem.food_name}`;
          document.getElementById('food-price').value = `${menuItem.price}`;
          document.getElementById('food-image').value = `${menuItem.image}`;
          document.getElementById('food-description').value = `${menuItem.description}`;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const updateMenuItem = () => {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const foodId = url.searchParams.get('food_id');
  const category = document.getElementById('category-list').value;
  const name = document.getElementById('food-name').value;
  const foodPrice = document.getElementById('food-price').value;
  const foodImage = document.getElementById('food-image').value;
  const foodDescription = document.getElementById('food-description').value;
  fetch(`https://fast-foodfastapp.herokuapp.com/api/v1/menu/${foodId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'x-access-token': myToken,
    },
    body: JSON.stringify({
      foodName: name,
      categoryId: category,
      price: foodPrice,
      description: foodDescription,
      image: foodImage,
    }),
  }).then(response => response.json())
    .then(() => {
      window.location.href = '/admin/edit-food-successful.html';
    })
    .catch((error) => {
      console.log(error);
    });
};

if (btnUpdateFood === null) { } else {
  btnUpdateFood.addEventListener('click', (event) => {
    event.preventDefault();
    updateMenuItem();
  });
}

window.addEventListener('load', () => {
  const userType = localStorage.getItem('user_type');
  if (userType === 'Admin') {
    getAdminmenu();
    loadMenuDetails();
  }
  getMenu();
  getUsermenu();
  getLatestmenu();
  loadCategories();
});
