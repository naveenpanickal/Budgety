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
     }
 }
return {
    addItem : function(type,description,value){
        var newItem, ID;
        ID = 0;

        if (type ==="exp"){
            newItem = new Expense(ID,des,val);
        }
        else if(type ==="inc"){
            newItem = new Income(ID,des.,val);
            data.allItems.inc.push(newItem);
        }
                    data.allItems.type.push(newItem);

        id++;
    }
} 



})();

//UI controller


var uiController = (function(){
   var DOMstrings = {
       inputType : ".add__type",
       inputDescrption : ".add__description",
       inputValue : ".add__value",
       inputButton : ".add__btn"
   };
    
    return {
        getInput:function(){
            return{
                 type : document.querySelector(DOMstrings.inputType).value,
                 description : document.querySelector(DOMstrings.inputDescrption).value,
                 value : document.querySelector(DOMstrings.inputValue).value      }
    },
       getDOMstrings:function(){
           return DOMstrings;
       }
};

})();


//App controller
var controller = (function(budg,ui){
var setUpEventListeners = function(){
     var DOM = ui.getDOMstrings();

    document.querySelector(DOM.inputButton).addEventListener("click",ctrlAddItem);

    document.addEventListener("keypress",function(event){
        if(event.keyCode==13){
            ctrlAddItem(); 
        }
    
    });

 }   
function ctrlAddItem(){
 
    // 1.Get the field input data
    var input = ui.getInput();
    // 2.Transfer that data to the budget controller
    // 3.Update UI with new item added
    // 4.Calculate the budget
    // 5.Display the total in UI

}
return{
    init:function(){setUpEventListeners() ;
    console.log("applcation has started"); 
}
}
})(budgetController,uiController);
controller.init();