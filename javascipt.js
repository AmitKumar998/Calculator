const lightGrey="rgb(116, 116, 116)";
const lighterGrey="rgb(169, 169, 169)";
const darkGrey="rgb(62, 62, 62)";
const orange="rgb(241,166,45)";
const darkOrange="rgb(196,135,39)";
const allBoxElements=document.querySelectorAll('.box');
const display=document.getElementById('display');
let currentNumber=true;
let numberValue="0";
let equation=[];        //equation[0]=number,equation[1]=operator,equation[2]=number

allBoxElements.forEach((box)=>{
    box.addEventListener("mousedown",(e)=>{
        if(e.target.className.includes("light-box")){
            toggleColor(e.target,lightGrey,lighterGrey);
        }
        else if(e.target.className.includes("dark-box")){
            toggleColor(e.target,darkGrey,lightGrey);
        }
        else if(e.target.className.includes("orange-box")){
            toggleColor(e.target,orange,darkOrange);
        }
        parseCalculatorInput(e.target.className,e.target.innerText);
    });
});

//toggle color based on mousedown event
function toggleColor(element,originalColor,toggleColor){
    element.style.backgroundColor=toggleColor;
    element.addEventListener("mouseup",(e)=>{
        element.style.backgroundColor=originalColor;
    });
}

function parseCalculatorInput(classList,input){
    if(classList.includes("number")){
        updateNumberDisplay(input,currentNumber);
        processNumber(input);
        currentNumber=true;
    }
    else if(classList.includes("operator")){
        processOperator(input);
        numberValue="";
        currentNumber=false;
    }
    else if(classList.includes("update-value")){
        nonOprOrNumInput(input);
    }
}

function updateNumberDisplay(input,currentNumber){
    if(!currentNumber){
        display.innerText="0";
    }
    if(display.innerText==="0"&&input==='.'){
        display.innerText="0.";
    }
    else if(display.innerText==="0"&&input!=='.'){
        display.innerText=input;
        numberValue+=input;
    }
    else{
        display.innerText+=input;
        numberValue+=input;
    }
    checkDisplayOverFlow();
}

//get float and integer value and update
function processNumber(input){
    input=floatOrInt(input);
    updateNumber(numberValue);
}

//add or update number to equation
function updateNumber(input){
    switch(equation.length){
        case 0:
            equation.push(input);
            break;
        case 1:
            equation[0]=numberValue;
            break;
        case 2:
            equation.push(input);
            break;
        case 3:
            equation[2]=numberValue;
            break;
        default:
            break;
    }
    checkDisplayOverFlow();
}

//shortens the displayed number to prevent overflows
function checkDisplayOverFlow(){
    if(display.innerText.length>=11){
        display.innerText=display.innerText.substring(0,11);
    }
}

//add or replace operator in equation
function processOperator(input){
    switch(equation.length){
        case 0:
            equation[0]=display.innerText;
            equation[1]=input;
            break;
        case 1:
            equation.push(input);
            break;
        case 2:
            equation[1]=input;
            break;
        case 3:
            computeTotal();
            display.innerText=numberValue;
            checkDisplayOverFlow();
            equation[0]=numberValue;
            equation[1]=input;
            equation.length=2;    
            break;
        default:
            break;
    }
}
//compute the total
function computeTotal(){
    switch(equation.length){
        case 0:
        case 1:
        case 2:
            numberValue=equation[0];
            break;
        default:
            numberValue=applyOperator(equation[0],equation[2],equation[1]);
            break;
    }
}
//clear and reset display
function clearDisplay(){
    display.innerText="0";
    numberValue="0";
    equation=[];
}
//apply operator to an equation
function applyOperator(x,y,opr){
    x=floatOrInt(x);
    y=floatOrInt(y);
    if(opr==="÷"&&y===0)return "Undefined";
    switch(opr){
        case "+":
            return x+y;
        case "-":
            return x-y;
        case "x":
            return x*y;
        case "÷":
            return x/y;
        case "%":
            return x%y;
        default:
            return "Invalid";
    }
}
//checks whether input is float
function floatOrInt(input){
    if(Math.floor(input)===Math.ceil(input)){
        return parseInt(input);
    }else{
        return parseFloat(input);
    }
}
//process for non Number or operators input
function nonOprOrNumInput(input){
    switch(input){
        case 'C':
            clearDisplay();
            break;

        case '=':
            computeTotal();
            equation=[];
            display.innerText=numberValue;
            checkDisplayOverFlow();
            break;
        default:   //  +/-
            numberValue=floatOrInt(numberValue)*-1;
            display.innerText=numberValue;
            updateNumber(numberValue);
            break;
    }
}