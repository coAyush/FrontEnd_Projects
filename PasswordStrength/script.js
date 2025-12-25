let txt=document.querySelector("#text");
let msg=document.querySelector("#msg");
txt.addEventListener("input",()=>{
   let l=txt.value.length;
   if(l>0){
    msg.style.display="inline-block";
   }else{
    msg.style.display="none";
   }

   if(l>0 && l<=4){
    msg.innerHTML="Password is weak"
    msg.style.color="red";
    txt.style.borderColor="red";
   }else if(l>4 && l<=8){
    msg.innerHTML="Password is medium"
    msg.style.color="yellow";
    txt.style.borderColor="yellow";
   }
   else{
    msg.innerHTML="Password is strong"
    msg.style.color="green";
    txt.style.borderColor="green";
   }
})

let show=document.querySelector("#eye");
show.addEventListener("click",()=>{
   if(txt.type === "password") {
      txt.type = "text";
      show.style.backgroundImage = "url('view.png')";
   } else {
      txt.type = "password";
      show.style.backgroundImage = "url('close-eye.png')";
   }
})