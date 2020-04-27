class CategoriesList {
    constructor(categories, transactionType) {
        this.list = $('.categories-list')[0];
        this.categories = categories;
        this.transactionType = transactionType;
        this.render();
    }

    render() {
        this.clearList();
        this.categories.filter(category => category.transaction_type_name === this.transactionType)
            .forEach(category => {
                const categoryItem = $(`
                    <button class="category list-group-item list-group-item-action" data-key="${category.id}" onclick="selectCategory(this)">
                        <img src="${category.image_url}" class="category-image" alt="">
                        <span class="category-title">${category.name}</span>
                    </button>
                `);
                $(this.list).append(categoryItem);
            });
    }

    clearList() {
        $(this.list).empty();
    }
}

const standardCategories = [];
const customCategories = [];
const categories = {
    standard: standardCategories,
    custom: customCategories
};
let categoriesList;

async function initCategoriesList() {
    await setStandardCategories();
    await setCustomCategories();
    categoriesList = new CategoriesList(standardCategories, DEFAULT_TRANSACTION_TYPE);
    bindCategoriesListControls();
}


async function bindCategoriesListControls() {
    const categoryTypesSort = $('.category-type-sort button');
    const transactionTypesSort = $('.transaction-type-sort');
    const categoryEditSave = $('.category-edit-controls .save button');
    const categoryEditDelete = $('.category-edit-controls .delete button');
    const categoryEditAddNew = $('.category-edit-controls .add-new button');

    await setTransactionTypesSortItems(transactionTypesSort);

    transactionTypesSort.change(function () {
        const categoryType = $('.category-type-sort .btn-primary').data('action');
        categoriesList = new CategoriesList(categories[categoryType], transactionTypesSort.val());
    });
    categoryTypesSort.click(function () {
        categoryTypesSort.removeClass('btn-primary');
        $(this).addClass('btn-primary');
        categoriesList = new CategoriesList(categories[$(this).data('action')], transactionTypesSort.val());
    });
    categoryEditSave.click(function () {
        saveCategory().then(closeCategoryForm);
    });
    categoryEditDelete.click(function () {
        deleteCategory().then(closeCategoryForm);
    });
    categoryEditAddNew.click(function () {
        $('.categories-list .category').removeClass('active');
        openNewCategoryForm();
    });
}


function selectCategory(event) {
    const categoryItems = $('.categories-list .category');
    categoryItems.removeClass('active');
    $(event).addClass('active');

    openEditCategoryForm(Number($(event).data('key')));
}

function openEditCategoryForm(categoryId) {
    const categoryEditForm = $('.category-edit-form');
    const categoryIdInput = $('.category-edit-form input.category-id');
    const categoryNameInput = $('.category-edit-form .category-name input');
    const categoryTypeInput = $('.category-edit-form .category-type select');
    const categoryImageInput = $('.category-edit-form .category-image input');
    const categoryEditSave = $('.category-edit-controls .save button');
    const categoryEditDelete = $('.category-edit-controls .delete button');

    const selectedCategory = categoriesList.categories.find(category => category.id === categoryId);
    categoryIdInput.val(selectedCategory.id);
    categoryNameInput.val(selectedCategory.name);
    categoryTypeInput.empty();
    categoryTypeInput.append(`<option value="${selectedCategory.transaction_type_name}">${selectedCategory.transaction_type_name}</option>`)
    categoryTypeInput.attr('disabled', true);

    if (!selectedCategory.is_custom) {
        categoryNameInput.attr('disabled', true);
        categoryImageInput.attr('disabled', true);
        categoryEditSave.attr('disabled', true);
        categoryEditDelete.attr('disabled', true);
    } else {
        categoryNameInput.attr('disabled', false);
        categoryImageInput.attr('disabled', false);
        categoryEditSave.attr('disabled', false);
        categoryEditDelete.attr('disabled', false);
    }

    categoryEditForm.fadeIn(200);
}

function openNewCategoryForm() {
    const categoryIdInput = $('.category-edit-form input.category-id');
    const categoryNameInput = $('.category-edit-form .category-name input');
    const categoryTypeInput = $('.category-edit-form .category-type select');
    const categoryImageInput = $('.category-edit-form .category-image input');
    const categoryEditSave = $('.category-edit-controls .save button');
    const categoryEditDelete = $('.category-edit-controls .delete button');

    categoryIdInput.val('');
    categoryNameInput.val('');
    categoryImageInput.val('');
    categoryTypeInput.empty();
    categoryTypeInput.attr('disabled', false);
    setTransactionTypesSortItems(categoryTypeInput);

    categoryNameInput.attr('disabled', false);
    categoryImageInput.attr('disabled', false);
    categoryEditSave.attr('disabled', false);
    categoryEditDelete.attr('disabled', true);
}

function closeCategoryForm() {
    const categoryEditForm = $('.category-edit-form');
    const categoryIdInput = $('.category-edit-form input.category-id');
    const categoryNameInput = $('.category-edit-form .category-name input');
    const categoryTypeInput = $('.category-edit-form .category-type select');
    const categoryImageInput = $('.category-edit-form .category-image input');

    categoryIdInput.val('');
    categoryNameInput.val('');
    categoryImageInput.val('');
    categoryTypeInput.empty();

    categoryEditForm.fadeOut(200);
}

function saveCategory() {
    const categoryId = Number($('.category-edit-form .category-id').val());
    const categoryName = $('.category-edit-form .category-name input').val();
    const categoryType = $('.category-edit-form .category-type select').val();
    const categoryImageUrl = $('.category-edit-form .category-image input').val();

    // TODO: make a request to get a complete image url for a category for a specific user
    let categoryPromise;
    if (categoryId) {
        // TODO: put image url for update
        categoryPromise = graphql(
            'updateCustomCategory',
            `mutation{updateCustomCategory(id: ${categoryId}, category: {name: "${categoryName}"}){id, name, transaction_type_name, is_custom, image_url}}`
        );
    } else {
        categoryPromise = graphql(
            'createCustomCategory',
            `mutation{createCustomCategory(category:{name: "${categoryName}", transaction_type_name: "${categoryType}", image_url: "${categoryImageUrl}"}){id, name, transaction_type_name, is_custom, image_url}}`
        );
    }
    categoryPromise.then(newCategory => {
        let alreadyExisting = customCategories.find(category => category.id === newCategory.id);
        if (alreadyExisting) {
            customCategories[customCategories.findIndex(category => category.id === newCategory.id)] = newCategory;
        } else {
            customCategories.push(newCategory);
        }
        $('.transaction-type-sort').val(newCategory.transaction_type_name);
        categoriesList = new CategoriesList(customCategories, newCategory.transaction_type_name);
        openEditCategoryForm(newCategory.id);
        $(`.categories-list .category[data-key="${newCategory.id}"]`).addClass('active');
    })
}

function deleteCategory() {
    const categoryId = Number($('.category-edit-form .category-id').val());
    if (categoryId) {
        return graphql(
            'deleteCustomCategory',
            `mutation{deleteCustomCategory(id: ${categoryId}){id, transaction_type_name}}`
        ).then(deletedCategory => {
            customCategories.splice(
                customCategories.findIndex(category => category.id === deletedCategory.id),
                1
            );
            categoriesList = new CategoriesList(customCategories, deletedCategory.transaction_type_name);
        });
    }
}


async function setStandardCategories() {
    if (!standardCategories || standardCategories.length === 0) {
        standardCategories.push(...await graphql(
            'getStandardCategories',
            'query{getStandardCategories{id, name, transaction_type_name, is_custom, image_url}}'
        ));
    }
}

async function setCustomCategories() {
    if (!customCategories || customCategories.length === 0) {
        customCategories.push(...await graphql(
            'getCustomCategories',
            'query{getCustomCategories{id, name, transaction_type_name, is_custom, image_url}}'
        ));
    }
}

async function setTransactionTypesSortItems(field) {
    return graphql(
        'getTransactionTypes',
        'query{getTransactionTypes{type_name, image_url}}'
    ).then(transactionTypes => {
        transactionTypes.forEach(type => {
            field.append($(`<option value="${type.type_name}">${type.type_name}</option>`));
        });
    });
}
