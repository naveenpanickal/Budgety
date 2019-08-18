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
            data.totals.exp +=  Number(val);

        }
        else if(type ==="inc"){
            newItem = new Income(ID,des,val);
            data.totals.inc += Number(val);

        } 
    //Pushing it into data structure    
                    data.allItems[type].push(newItem);
    //Return the new element
            return newItem
         },
         testing: function(){
             console.log(data);
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
function ctrlAddItem(){
    var input , newItem;
 
    // 1.Get the field input data
     input = UICtrl.getInput();
    // 2.Transfer that data to the budget controller
    newItem = budgetCtrl.addItem(input.type,input.description,input.value);
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