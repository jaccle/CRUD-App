document.addEventListener("DOMContentLoaded", function () {

   var form = document.querySelector("form");

   form.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("something");
      addItem();
      check();

   });

   var completed = document.getElementsByTagName("li");

   function check() {
      for (var i = 0; i < completed.length; i++) {
         completed[i].addEventListener("click", clicky);
      }

   }

   function clicky() {
      if (this.classList == "completed") {
         this.classList.remove("completed");
      } else {
         this.classList.add("completed");
      }
   }



   function addItem() {
      var newLi = document.createElement("li");
      var entered = document.querySelector("input");
      newLi.innerText = entered.value;
      document.querySelector("ul").appendChild(newLi);
      entered.value="";
   }

});