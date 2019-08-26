//Budget controller


var budgetController =(function(a){
 var Expense =  function(id,description,value){
     this.id = id;
     this.description =  description;
     this.value = value;
 }
 var Income =  function(id,description,value){
     this.id = id;
     this.description =  description;
     this.value = value;
 }
 //var allExpenses = []; it is better to put everything in a single data struture
 //var allIncome = [];
 var data = {
     allItems:{
         exp:[],
         inc:[]
     },
     totals:{
         exp:0,
         inc:0
     },
     budget:0,
     perOfInc:-1 //  percentage of income that we spent
 }
return {
    addItem : function(type,des,val){
        var newItem, ID;
        //[1,2,3,4,5] next id = 6
        //[1,2,5,8] next id= 9
        // id = id of last element +1
     //create new id
     if(data.allItems[type].length > 0)
     {
        ID = data.allItems[type][data.allItems[type].length - 1].id +1;
     }
     else{
         ID = 0;
     }
    //create new item based on exp or inc  

        if (type ==="exp"){
            newItem = new Expense(ID,des,val);
            data.totals.exp +=  val;

        }
        else if(type ==="inc"){
            newItem = new Income(ID,des,val);
            data.totals.inc += val;
        } 
    //Pushing it into data structure    
                    data.allItems[type].push(newItem);
    //Return the new element
            return newItem
         },
         testing: function(){
             console.log(data);
         },
         calculateBudget:function(){
             var total;
             total = data.totals.inc - data.totals.exp;
             data.budget= total;
             if(data.totals.inc > data.totals.exp){
             data.perOfInc = Math.round(data.totals.exp/data.totals.inc*100);
             }
             else{
                 data.perOfInc = -1;
                }
            },
         getBudget:function(){
             return{
                 budget:data.budget,
                 income:data.totals.inc,
                 expense:data.totals.exp,
                 percentage:data.perOfInc
             }

         }
} 
})();

//UI controller


var uiController = (function(){
   var DOMstrings = {
       inputType : ".add__type",
       inputDescription : ".add__description",
       inputValue : ".add__value",
       inputButton : ".add__btn",
       incomeContainer:".income__list",
       expensesContainer:".expenses__list",
       budgetValue:".budget__value",
       incomeValue:".budget__income--value",
       expenseValue:".budget__expenses--value",
       expensePercentage:".budget__expenses--percentage"
   };
    return {
        getInput:function(){
            return{
                 type : document.querySelector(DOMstrings.inputType).value,
                 description : document.querySelector(DOMstrings.inputDescription).value,
                 value : parseFloat(document.querySelector(DOMstrings.inputValue).value )     }
    },
       getDOMstrings:function(){
           return DOMstrings;
    },
       addListItem:function(obj,type){
        var html, newHtml,element;
        //create html string with placeholder
        if(type==="inc"){
            element = DOMstrings.incomeContainer;
        html ='  <div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        else if (type==="exp"){
            element = DOMstrings.expensesContainer;
            html= '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%perc%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        //Replace the placeholder with actual data
        newHtml = html.replace("%id%",obj.id);
        newHtml = newHtml.replace("%description%",obj.description);
        newHtml = newHtml.replace("%value%",obj.value);
        //Insert HTML into the dom
        document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
        },
    clearFields:function(){
        console.log("clearing fields");
        var fields,fieldsArr;
        fields = document.querySelectorAll(DOMstrings.inputDescription +", "+ DOMstrings.inputValue);
        fieldsArr = Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current,index,array){
            current.value = "";
            });
        fieldsArr[0].focus();
    },
    displayBudget:function(obj){
        document.querySelector(DOMstrings.budgetValue).textContent= obj.budget;
        document.querySelector(DOMstrings.incomeValue).textContent= obj.income;
        document.querySelector(DOMstrings.expenseValue).textContent= obj.expense;
    if(obj.percentage > 0){
        document.querySelector(DOMstrings.expensePercentage).textContent= obj.percentage+"%";
    }
    else{
        document.querySelector(DOMstrings.expensePercentage).textContent= "---" 
    }
    }
};
})();


//App controller


var controller = (function(budgetCtrl,UICtrl){
    var setUpEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener("click",ctrlAddItem);
        document.addEventListener("keypress",function(event){
        if(event.keyCode==13){
            ctrlAddItem(); 
        }
    });
}   
function updateBudget(){
    var budget,inc,exp,perc;
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    budget = budgetCtrl.getBudget();
    // 3. Display the budget on UI
    UICtrl.displayBudget(budget);
}
function ctrlAddItem(){
    var input , newItem;
 
    // 1.Get the field input data
     input = UICtrl.getInput();
     if(input.description!="" && !isNaN(input.value) && input.value>0){
    // 2.Transfer that data to the budget controller
    newItem = budgetCtrl.addItem(input.type,input.description,input.value);
    // 3.Update UI with new item added
     UICtrl.addListItem(newItem,input.type);
    //4.Clear input fields
    UICtrl.clearFields();
    // 5.Calculate and update the budget
    updateBudget();   
     }
}
return{
    init:function(){
    setUpEventListeners() ;
    UICtrl.displayBudget({
        budget:0,
        income:0,
        expense:0,
        percentage:-1
    }
);
    console.log("applcation has started"); 
}
}
})(budgetController,uiController);
controller.init();