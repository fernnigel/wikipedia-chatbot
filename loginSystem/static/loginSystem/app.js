const btn = document.querySelector(".talk");
const content = document.querySelector(".content");
const btnReset = document.querySelector(".reset");
const btnStop = document.querySelector(".stop");

const greetings = ["I am doing great"];

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

const speech = new SpeechSynthesisUtterance();

function getLocalStream() {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      window.localStream = stream; // A
      //window.localAudio.srcObject = stream; // B
      //window.localAudio.autoplay = true; // C
    })
    .catch((err) => {
      console.log("u got an error:" + err);
    });
}

window.onload = () => {
  getLocalStream();
};

btnReset.addEventListener("click", () => {
  location.reload();
});

btnStop.addEventListener("click", () => {
  speechSynthesis.resume();
  speechSynthesis.cancel();
});

btn.addEventListener("click", () => {
  recognition.start();
});

recognition.onstart = function () {
  btn.style.background = "#c2e9fb";
};

recognition.onresult = function (event) {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;

  var userP = document.createElement("p");

  var userChat = document.createElement("div");

  userChat.classList.add("userChat");
  content.appendChild(userChat);
  userChat.appendChild(userP);

  userP.innerHTML += transcript;

  readOutLoud(transcript);

  btn.style.background = "#a1c4fd";
};

recognition.onspeechend = function () {
  recognition.stop();
};

recognition.onerror = function (event) {
  console.log("Error occurred in recognition: " + event.error);
};

function readOutLoud(message) {
  var botP = document.createElement("p");
  var botChat = document.createElement("div");
  botChat.classList.add("botChat");

  content.appendChild(botChat);

  speech.text = "Couldn't catch that";
  botP.innerHTML = speech.text;

  if (message.includes("how are you")) {
    speech.text = greetings[0];
    botP.innerHTML = speech.text;
  } else if (
    message.includes("what are you") ||
    message.includes("what can you do") ||
    message.includes("introduce") ||
    message.includes("tell me about you") ||
    message.includes("who are you")
  ) {
    speech.text = "I am a chat bot that can search information from wikipedia";
    botP.innerHTML = speech.text;
  } 
  else if(message.includes("what is the time")){
    var d = new Date();
    speech.text = d.toLocaleTimeString();
    botP.innerHTML = speech.text;
  }
  
  else if (message.includes("hello")) {
    speech.text = "Hi, nice to meet you";
    botP.innerHTML = speech.text;
  } else if (message.includes("search for")) {
    var textMsg = message.split(" ");
    textMsg.splice(0, 2);
    speech.text = "Fetching";

    if (textMsg.length == 1) {
      searched.apply(null, textMsg);
      botP.innerHTML = speech.text;
    } else if (textMsg.length == 2) {
      searched2.apply(null, textMsg);
      botP.innerHTML = speech.text;
    }
  } else if (message.includes("who is")) {
    var textMsg = message.split(" ");
    textMsg.splice(0, 2);
    speech.text = "Fetching";
    searched2.apply(null, textMsg);
    botP.innerHTML = speech.text;
  }

  botChat.appendChild(botP);
  window.speechSynthesis.speak(speech);
}

function searched(c) {
  getdata = async () => {
    var title = c;
    const url =
      "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&exsentences=2&exlimit=1&titles=" +
      title +
      "&explaintext=1&formatversion=2&format=json";
    let data = await fetch(url);
    let finaldata = await data.json();

    var extract = finaldata.query.pages[0].extract;
    extract = extract.replace(/(?:\r\n|\r|\n)/g, " ");
    speech.text = extract;
    /*console.log(speech.text);*/

    var botP = document.createElement("p");
    var botChat = document.createElement("div");

    botChat.classList.add("botChat");
    content.appendChild(botChat);
    botChat.appendChild(botP);
    botP.innerHTML = extract;
  };
  getdata();
  window.speechSynthesis.speak(speech);
}

function searched2(c, d) {
  getdata = async () => {
    var title = c + "_" + d;
    const url =
      "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&exsentences=2&exlimit=1&titles=" +
      title +
      "&explaintext=1&formatversion=2&format=json";
    let data = await fetch(url);
    let finaldata = await data.json();

    var extract = finaldata.query.pages[0].extract;
    extract = extract.replace(/(?:\r\n|\r|\n)/g, " ");
    speech.text = extract;
    /*console.log(speech.text);*/

    var botP = document.createElement("p");
    var botChat = document.createElement("div");

    botChat.classList.add("botChat");
    content.appendChild(botChat);
    botChat.appendChild(botP);
    botP.innerHTML = extract;
  };
  getdata();
  window.speechSynthesis.speak(speech);
}

function resumeInfinity() {
  speechSynthesis.pause();
  window.speechSynthesis.resume();
  timeoutResumeInfinity = setTimeout(resumeInfinity, 1000);
}

speech.onstart = function (event) {
  resumeInfinity();
};

speech.onend = function (event) {
  clearTimeout(timeoutResumeInfinity);
};
