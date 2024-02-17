const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
mistakeTag = document.querySelector(".mistake span"),
timeTag = document.querySelector(".time span b"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span "),
tryAgainBtn=document.querySelector("button");


let timer,
    maxTime = 30,
    timeLeft = maxTime;
let charIndex = mistakes = isTyping = errors= 0;
let accuracy=0;

function randomParagraph() {
    //fetch random paragraphs by generating a random number
    let randInt = Math.floor(Math.random() * paragraphs.length)
    typingText.innerHTML=""
    //split each character of the paragraph and adding each of them inside a span
    paragraphs[randInt].split("").forEach(span => {
        let spanTag = `<span>${span}</span>`
        typingText.innerHTML += spanTag
    })
    typingText.querySelectorAll("span")[0].classList.add("active")
    //focusing input field on keydown or click event
    document.addEventListener("keydown", () => inpField.focus())
    typingText.addEventListener("click", () => inpField.focus())
}
function initTyping() {
    const characters = typingText.querySelectorAll("span")
    let typedChar = inpField.value.split("")[charIndex];
    if(charIndex<characters.length-1 &&  timeLeft>0){
        if (!isTyping) {
            timer = setInterval(initTime, 1000);
            isTyping = true;
        }
    
        //if user hasnt entered a character or is pressing backspace
        if (typedChar == null) {
            charIndex--;
            //on pressing backspace we should be able to reduce the number of mistakes 
            //only is class contains "incorrect"
            if (characters[charIndex].classList.contains("incorrect")) {
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect")
        }
        else {
            if (characters[charIndex].innerText === typedChar) {
                //if the typed character and shown character are same then add character to correct class
                characters[charIndex].classList.add("correct")
            }
            else {
                mistakes++;
                errors++;
                characters[charIndex].classList.add("incorrect")
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"))
        characters[charIndex].classList.add("active")
    
        mistakeTag.innerText = mistakes
        cpmTag.innerText=charIndex-mistakes//Dont calculate mistakes inside cpm
        let wpm=Math.round((((charIndex-mistakes)/5)/(maxTime-timeLeft))*60)
        wpm=wpm<0||!wpm||wpm===Infinity?0:wpm;
        wpmTag.innerText=wpm
        accuracy=Math.round(cpm/(cpm+errors)*100)

    }
    else {
        inpField.value = "";

        // Calculate accuracy
        let accuracy = ((cpmTag.innerText) / (cpmTag.innerText + mistakeTag.innerText)) * 100;
        accuracy = isNaN(accuracy) ? 0 : Math.round(accuracy);

        // Display the WPM, mistakes, and accuracy inside the typing text class
        typingText.innerHTML = `<span class="wpm-display">WPM: ${wpmTag.innerText}</span>`;
       
       
        clearInterval(timer);
    }
}
function initTime() {
    //if time left is > 0 then decrement time
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    }
    else {
        clearInterval(timer)
    }
}
function resetGame(){
    randomParagraph()
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    timeTag.innerText = maxTime;
    mistakeTag.innerText=mistakes;
    cpmTag.innerText=0
    wpmTag.innerText=0
    inpField.value=""
    clearInterval(timer)
    
}

randomParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click",resetGame)