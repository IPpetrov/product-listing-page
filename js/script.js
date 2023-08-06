fetch('data/items.json')
        .then(res => res.json())
        .then((notSortedData) => {
        
 // Variables           
const dataContainer = document.getElementById("dataContainer");
const categoryFilterButtons = document.querySelectorAll(".category-filter");
const sortByButtons = document.querySelectorAll(".sorting-filter");
const showMoreButton = document.getElementById("show-more-button");
const showingProducts = document.getElementById("showing-products");
const productDescription = document.getElementById("product-description");
const lowestPrice = document.getElementById("lowestPrice");
const highestPrice = document.getElementById("highestPrice");
const filterButton = document.getElementById("filter-button");
const clearFiltersButton = document.getElementById("clear-filters-button");
var currentCategory = "Mug";
data = notSortedData;

// Filters
function applyFilters() {
    data = notSortedData;
    const list = selectedManufacturers();

    // Filter by price only
    if (list == "" && lowestPrice.value != "" && highestPrice.value != "" && parseFloat(lowestPrice.value) <= parseFloat(highestPrice.value)) {
        data = data.filter(item => item.price >= lowestPrice.value && item.price <= highestPrice.value)
    }
    // Filter by manufacturer only
    else if (list != "" && lowestPrice.value == "" && highestPrice.value == "") {
        data = data.filter(item => list.includes(item.manufacturer));
    }
    // Filter by both
    else if (list != "" && lowestPrice.value != "" && highestPrice.value != "" && parseFloat(lowestPrice.value) <= parseFloat(highestPrice.value)) {
        data = data.filter(item => item.price >= lowestPrice.value && item.price <= highestPrice.value);
        data = data.filter(item => list.includes(item.manufacturer));
    }
    categoryFilter(data, currentCategory)
}

// Filter button 
filterButton.addEventListener("click", () => {
    applyFilters();
})

// Clear filters button 
clearFiltersButton.addEventListener("click", () => {
    data = notSortedData;
    categoryFilter(data, currentCategory);
    lowestPrice.value = "";
    highestPrice.value = "";
    showMoreButton.classList.remove("hide");
    let checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    for(var i= 0; i< checkboxes.length; i++) {
        checkboxes[i].checked= false;
    }
})

// Show product description
function showProductDescription(category) {
    if (category == "Mug") {
        productDescription.innerHTML = "<span class='category-name'>" + category + "</span>: A mug is a type of cup typically used for drinking hot drinks, such as coffee, hot chocolate, or tea. Mugs usually have handles and hold a larger amount of fluid than other types of cups.";
    } 
    else if (category == "Shirt") {
        productDescription.innerHTML = "<span class='category-name'>" + category + "</span>: A long- or short-sleeved garment for the upper part of the body, usually lightweight and having a collar and a front opening. an undergarment of cotton, or other material, for the upper part of the body."
    }
    else {
        productDescription.innerHTML = "Currently showing all categories available."
    }
}

// Show more button 
showMoreButton.addEventListener("click", () => {
    var lastCardID = parseInt(dataContainer.lastChild.lastChild.id) + 1;
    showMoreButtonItems(data, currentCategory, lastCardID);
})

// Show more products
function showMoreButtonItems(data, category, lastItem){
    var counter = 0;
    var showLimit = 9
    for (var i = lastItem; i < data.length; i++) {
        if (category == "all" && counter < showLimit ) {
            var div = document.createElement("div");
            div.innerHTML += addCards(data, i);
            dataContainer.appendChild(div);
            counter++;
        }
        else if (data[i].name.includes(category) && counter < showLimit ) {
            var div = document.createElement("div");
            div.innerHTML += addCards(data, i);
            dataContainer.appendChild(div);
            counter++;
        }
        
    }
    showProductCount(category);
    showProductDescription(category);
}

// SortBy buttons
sortByButtons.forEach(button => {
    button.addEventListener("click", () => {
        sortBy(button.value);
        showProductCount(currentCategory);
        lowestPrice.value = ""
        highestPrice.value = ""
    })
});

// SortBy function
function sortBy(method) {
    if (method == "AtoZ") {
        data = notSortedData.sort((a,b) => {
            if (a.name < b.name) {
                return -1;
              }
        });
    }
    else if (method == "ZtoA") {
        data = notSortedData.sort((a,b) => {
            if (a.name > b.name) {
                return -1;
              }
        });
    }
    else if (method == "LowToHigh") {
        data = notSortedData.sort((a,b) => {
            if (a.price < b.price) {
                return -1;
              }
        });
    }
    else if (method == "HighToLow") {
        data = notSortedData.sort((a,b) => {
            if (a.price > b.price) {
                return -1;
              }
        });
    }
    categoryFilter(data, currentCategory);
    showMoreButton.classList.remove("hidden")
}

// Filter by category
function categoryFilter(data, category){
    dataContainer.innerHTML = "";
    var counter = 0;
    var showLimit = 9
    for (var i = 0; i < data.length; i++) {
        if (category == "all" && counter < showLimit ) {
            var div = document.createElement("div");
            div.innerHTML += addCards(data, i);
            dataContainer.appendChild(div);
            counter++;
        }
        else if (data[i].name.includes(category) && counter < showLimit ) {
            var div = document.createElement("div");
            div.innerHTML += addCards(data, i);
            dataContainer.appendChild(div);
            counter++;
        }
    }
    showProductCount(category);
    showProductDescription(category);
    showMoreButton.classList.remove("hidden")
}
categoryFilter(data, "Mug");

// Category buttons
categoryFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentCategory = button.value;
        categoryFilter(data, button.value);
        lowestPrice.value = ""
        highestPrice.value = ""
    })
});

// Show all unique manufacturers
function appendManufacturers(data) {
    var manList = document.getElementById("manList");
    for (let i = 0; i < uniqueManufacturers(data).length; i++) {
        var li = document.createElement("li");
        li.innerHTML = '<input type="checkbox" class="manufacturer" value="' + uniqueManufacturers(data)[i] + '">' + uniqueManufacturers(data)[i];
        manList.appendChild(li);
    }
}
appendManufacturers(data);

// Get unique manufacturers 
function uniqueManufacturers(data) {
    const unique = (value, index, self) => {
        return self.indexOf(value) === index
      }
    manufacturers = []
    for (let i = 0; i < data.length; i++) {
        manufacturers.push(data[i].manufacturer)
    }
    return manufacturers.filter(unique);
}

function selectedManufacturers() {
    let arr = [];
    let checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
   checkboxes.forEach((item)=>{
      arr.push(item.value)
   }) 
   console.log(arr);
   return arr;
   }

// Show number of all products of the chosen category
function showProductCount(category) {
    var count = 0
    if (category == "all") {
        for (let i = 0; i < data.length; i++) {
            count++ ;
        }
        updateShowCount(count);
    }
    else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].name.includes(category)) {
                count++ ;
            }
        }
        updateShowCount(count);
    }
    return count;
}

// Update product count
function updateShowCount(count) {
    if (count > dataContainer.children.length) {
        showMoreButton.classList.remove("hide")
    }
    if (currentCategory == "Mug" || currentCategory == "Shirt") {
        showingProducts.innerHTML = "Showing all " + dataContainer.children.length + " " + currentCategory.toLowerCase() + "s out of " + count;

    }
    else {
        showingProducts.innerHTML = "Showing all " + dataContainer.children.length + " products out of " + count;

    }
    if (count == dataContainer.children.length || count == 0) {
        showMoreButton.classList.add("hide")
    }
}

// Create cards
function addCards(data, i) {
    const card =  
    '<div class="card" id="'+i+'" style="width: 18rem;">'+
    '<img src="../img/image_placeholder.jpg" class="card-img-top" alt="...">'+
    '<div class="card-body" id="card">'+
        '<h5 class="card-title">' + data[i].name + '</h5>'+
        '<p class="card-description">' + data[i].description.slice(0,25) + '</p>'+
        '<h6 class="card-price">' + data[i].price + ' $</h6>'+
        '<div class="mb-2"><span class="fa fa-star checked"></span>'+
        '<span class="fa fa-star checked"></span>'+
        '<span class="fa fa-star checked"></span>'+
        '<span class="fa fa-star"></span>'+
        '<span class="fa fa-star"></span></div>'+
        '<btn href="#" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addedToCart">Add to cart</btn>'+
    '</div>'+
    '</div>';
    return card
}


// End fetch
    }).catch(err => console.error(err));