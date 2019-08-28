//Budget controller
var budgetController = (function(a) {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.CalculatePerc = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    //var allExpenses = []; it is better to put everything in a single data struture
    //var allIncome = [];
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        perOfInc: -1 //  percentage of income that we spent
    }
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            //[1,2,3,4,5] next id = 6
            //[1,2,5,8] next id= 9
            // id = id of last element +1
            //create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on exp or inc  

            if (type === "exp") {
                newItem = new Expense(ID, des, val);

            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }
            //Pushing it into data structure    
            data.allItems[type].push(newItem);
            //Return the new element
            return newItem
        },
        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;

            });
            index = ids.indexOf(id);
            console.log(index);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        testing: function() {
            console.log(data);
        },
        calculateBudget: function() {
            //Calculate total income and expenses
            calculateTotal("inc");
            calculateTotal("exp");
            //calculate the budget :income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate percentage of income that we spent
            if (data.totals.inc > data.totals.exp) {
                data.perOfInc = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.perOfInc = -1;
            }
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.CalculatePerc(data.totals.inc);
            });

        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            })
            return allPerc;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                income: data.totals.inc,
                expense: data.totals.exp,
                percentage: data.perOfInc
            }

        }
    }
})();

//UI controller


var uiController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetValue: ".budget__value",
        incomeValue: ".budget__income--value",
        expenseValue: ".budget__expenses--value",
        expensePercentage: ".budget__expenses--percentage",
        container: ".container",
        expensePercLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };
    var formatNumber = function(num, type) {
        var numSplit, int, dec, sign;
        /* let num = 2563.883
         we want + 2,563.88*/
        num = Math.abs(num);
        console.log(num);
        num = num.toFixed(2);
        console.log(num);
        numSplit = num.split(".");
        console.log(numSplit);
        int = numSplit[0];
        dec = numSplit[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }
        if (type === "inc") {
            sign = "+";
        } else {
            sign = "-";
        }

        return (sign + " " + int + "." + dec); // how the sign is showing????

    };
      var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        getDOMstrings: function() {
            return DOMstrings;
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create html string with placeholder
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html = '  <div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">%perc%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace the placeholder with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
            //Insert HTML into the dom
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },
        deleteListItem: function(selectorID) {
            var element;
            element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        clearFields: function() {
            console.log("clearing fields");
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: function(obj) {
            var type;
            if (obj.budget >= 0) {
                type = "inc";
            } else {
                type = "exp";
            }
            document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeValue).textContent = formatNumber(obj.income, "inc");
            document.querySelector(DOMstrings.expenseValue).textContent = formatNumber(obj.expense, "exp");
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.expensePercentage).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.expensePercentage).textContent = "---"
            }
        },
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);
          
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "---";
                }
            });
        },
        displayDate: function() {
            var now, month, months, year;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;
        },
        changedType:function(){
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputType+","
            +DOMstrings.inputDescription+","
            +DOMstrings.inputValue);
            nodeListForEach(fields,function(cur){
             cur.classList.toggle("red-focus");
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle("red");
        }
    };
})();


//App controller


var controller = (function(budgetCtrl, UICtrl) {
    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function(event) {
            if (event.keyCode == 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener("change",UICtrl.changedType);
    }

    function updateBudget() {
        var budget, inc, exp, perc;
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        budget = budgetCtrl.getBudget();
        // 3. Display the budget on UI
        UICtrl.displayBudget(budget);
    }
    var updatePercentage = function() {
        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();
        // 2. read the percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // 3. Update UI with the new percantages
        UICtrl.displayPercentages(percentages);
    }
    var ctrlAddItem = function() {
        var input, newItem;

        // 1.Get the field input data
        input = UICtrl.getInput();
        if (input.description != "" && !isNaN(input.value) && input.value > 0) {
            // 2.Transfer that data to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3.Update UI with new item added
            UICtrl.addListItem(newItem, input.type);
            //4.Clear input fields
            UICtrl.clearFields();
            // 5.Calculate and update the budget
            updateBudget();
            // 6.Calculate and update the percentages
            updatePercentage();
        }
    };
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. delete the item from the datastructure

            type = type.slice(0, 3);
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();
            // 4.Calculate and update the percentages
            updatePercentage();
        }
    };

    return {
        init: function() {
            UICtrl.displayDate();
            setUpEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                income: 0,
                expense: 0,
                percentage: -1
            });
            console.log("applcation has started");
        }
    }
})(budgetController, uiController);
controller.init();