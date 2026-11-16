"use strict";

// Selector Variables
const addedExpense = document.querySelector("#create-expense");
const editExpense = document.querySelector("#edit-expense");
const expenseType = document.querySelector("#type-of-expense");
const listedExpense = document.querySelector("#listed-expense");
const expenseView = document.querySelector("#expense-view");
const expenseCost = document.querySelector("#cost-of-expense");
const expenseData = document.querySelector("#expense-data");
const expenseTotal = document.querySelector("#expense-total");
const collapseExpense = document.querySelector("#collapseExample");

// Local Storage
let expenseList = JSON.parse(localStorage.getItem("expenses")) || [];
let totalCost = 0;
let deleteButtonClicked = false;

// function to add a new expense calling createExpense
addedExpense.addEventListener("submit", (e) => {
  e.preventDefault();

  const expense = {
    name: listedExpense.value,
    amount: Number(expenseCost.value),
    type: expenseType.value,
    date: "expenseDate",
  };
  expenseList.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenseList));
  createExpense(expense);
  loadData(totalCost);
});

// Loads the total amount of expenses
const loadData = function (total) {
  expenseTotal.textContent = total;
};

// Event listener on the parant element listening for clicks on the Edit of Delete buttons
expenseView.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-button")) {
    editButton(e);
  } else if (e.target.classList.contains("delete-button")) {
    deleteButton(e);
  }
});

// Called when edit button is clicked. Creates a form to edit the data
const editButton = function (e) {
  const currentExpense = e.target.closest("div");

  const index = Number(currentExpense.id);
  const expense = expenseList[index];

  const html = `
  <div class="edit-panel container" id="collapseExample2">
      <form action="" id="edit-expense-button">
        <div class="input-group input-group-lg input-field mx-auto m-3">
          <span class="input-group-text">Expense</span>
          <input type="text" id="listed-expense-edit" class="form-control" required>

        </div>
        <div class="input-group input-group-lg input-field mx-auto m-3">
          <span class="input-group-text">Amount </span>
          <input id="cost-of-expense-edit" type="number" min="0.01" step="0.01" class="form-control" required>
        </div>
        <div class="form-field input-field mx-auto m-3">
          <select name="" id="type-of-expense-edit" class="form-control" required>
            <option value="" class="type-menu">-- Choose Type of Expense --</option>
            <option value="Housing" class="type-menu">Housing</option>
            <option value="Bills" class="type-menu">Bills</option>
            <option value="Car & Transport" class="type-menu">Car & Transport</option>
            <option value="Food & Groceries" class="type-menu">Food & Groceries</option>
            <option value="Eating Out" class="type-menu">Eating Out</option>
            <option value="Shopping" class="type-menu">Shopping</option>
            <option value="Entertainment" class="type-menu">Entertainment</option>
            <option value="Subscriptions" class="type-menu">Subscriptions</option>
            <option value="Health & Fitness" class="type-menu">Health & Fitness</option>
            <option value="Holidays & Travel" class="type-menu">Holidays & Travel</option>
            <option value="Other" class="type-menu">Other</option>
          </select>
        </div>
        <div class="container">
          <button type="submit" class="theme-primary btn-solid btn-styled rounded-pill add-expense-btn mx-auto m-3">Edit Expense</button>
        </div>
      </form>
    </div>`;
  const existingForm = currentExpense.querySelector(".edit-panel");

  if (existingForm) {
    existingForm.remove();
    return;
  }

  currentExpense.insertAdjacentHTML("beforeend", html);

  currentExpense
    .querySelector("#edit-expense-button")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const name = currentExpense.querySelector("#listed-expense-edit").value;
      const type = currentExpense.querySelector("#type-of-expense-edit").value;
      const cost = Number(
        currentExpense.querySelector("#cost-of-expense-edit").value,
      );

      expense.name = name;
      expense.type = type;
      expense.amount = cost;
      localStorage.setItem("expenses", JSON.stringify(expenseList));
      totalCost =
        totalCost - currentExpense.querySelector(".cost").textContent + cost;
      loadData(totalCost);

      currentExpense.querySelector(".name").textContent = name;
      currentExpense.querySelector(".type").textContent = type;
      currentExpense.querySelector(".cost").textContent = cost;

      currentExpense.querySelector(".edit-panel").remove();
    });
};

// called when delete button is clicked
const deleteButton = function (e) {
  if (!deleteButtonClicked) {
    const expenseDiv = e.target.closest("div");
    const confirmationDiv = document.createElement("div");
    const deleteAlert = document.createElement("span");
    const deleteYes = document.createElement("button");
    const deleteNo = document.createElement("button");
    expenseDiv.append(confirmationDiv);

    confirmationDiv.classList.add("d-grid", "col-8", "mx-auto");
    deleteAlert.classList.add("text-center");
    deleteYes.classList.add("theme-inverse", "btn-solid", "btn-styled", "m-3");
    deleteNo.classList.add("theme-inverse", "btn-solid", "btn-styled", "m-3");

    const expenseName = expenseDiv.querySelector(".name").textContent;

    deleteAlert.textContent = `Are you sure you want to delete ${expenseName}?`;
    deleteYes.textContent = "Yes";
    deleteNo.textContent = "No";
    confirmationDiv.append(deleteAlert);
    confirmationDiv.append(deleteYes);
    confirmationDiv.append(deleteNo);

    deleteButtonClicked = true;

    deleteYes.addEventListener("click", () => {
      const removedCost = Number(expenseDiv.querySelector(".cost").textContent);
      totalCost -= removedCost;
      loadData(totalCost);
      expenseDiv.remove();
      const index = Number(expenseDiv.id);
      expenseList.splice(index, 1);
      localStorage.setItem("expenses", JSON.stringify(expenseList));

      expenseView.querySelectorAll(".new-expense").forEach((element) => {
        if (Number(element.id) > index) {
          element.id = String(Number(element.id) - 1);
        }
      });
      deleteButtonClicked = false;
    });
    deleteNo.addEventListener("click", () => {
      deleteAlert.remove();
      deleteYes.remove();
      deleteNo.remove();
      confirmationDiv.remove();
      deleteButtonClicked = false;
    });
  }
};

// main function called when an expense is added and creates the element
const createExpense = function (expense) {
  const newExpense = document.createElement("div");
  newExpense.classList.add("new-expense");
  newExpense.classList.add("row", "align-items-center");
  newExpense.id = `${expenseList.indexOf(expense)}`;
  console.log(newExpense.id);

  const expenseName = document.createElement("span");
  const expenseType = document.createElement("span");
  const expenseCost = document.createElement("span");
  const expenseDate = document.createElement("span");
  const expenseEdit = document.createElement("button");
  const expenseDelete = document.createElement("button");

  expenseName.classList.add("name", "col", "text-center");
  expenseType.classList.add("type", "col", "text-center");
  expenseCost.classList.add("cost", "col-1", "text-center");
  expenseEdit.classList.add(
    "btn-solid",
    "theme-secondary",
    "btn-sm",
    "btn-styled",
    "edit-button",
    "col-1",
    "m-5",
  );
  expenseDelete.classList.add(
    "btn-solid",
    "theme-danger",
    "btn-sm",
    "btn-styled",
    "delete-button",
    "col-1",
    "m-5",
  );

  expenseName.textContent = expense.name;
  expenseType.textContent = expense.type;
  expenseCost.textContent = expense.amount;
  expenseEdit.textContent = "✏️";
  expenseDelete.textContent = "🗑️";
  newExpense.append(expenseName);
  newExpense.append(expenseType);
  newExpense.append(expenseCost);
  newExpense.append(expenseEdit);
  newExpense.append(expenseDelete);

  expenseView.prepend(newExpense);
  totalCost += Number(expense.amount);
  loadData(totalCost);
};

// loops over the storage data to load the expenses on refresh
const loadExpenses = function () {
  expenseList.forEach((expense) => {
    createExpense(expense);
  });
};

// Calls the loadExpenses function so it shows the list of expenses on refresh
loadExpenses();
