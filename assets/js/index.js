function viewVision(){
    document.getElementById("mission").style.display = 'none'
    document.getElementById("vision").style.display = 'block'
    document.getElementById("mission-text").classList.remove('vision-mission-tab-selected')
    document.getElementById("mission-text").classList.add('vision-mission-tab')
    document.getElementById("vision-text").classList.add('vision-mission-tab-selected')

}

function viewMission(){
    document.getElementById("mission").style.display = 'block'
    document.getElementById("vision").style.display = 'none'
    document.getElementById("vision-text").classList.remove('vision-mission-tab-selected')
    document.getElementById("vision-text").classList.add('vision-mission-tab')
    document.getElementById("mission-text").classList.add('vision-mission-tab-selected')

}


testimonials = [
        {"comment":"It has been a great year working with team Epoch Zero. Team Epoch Zero has been very supportive and flexible in meeting our demands.",
            "author":"Shabas Ahammed", "about":"Co-Founder, Estudo, Calicut, Kerala"},
        {"comment":"I am really impressed by the quality of services I received from Epoq Zero. You were right on schedule, charged reasonable prices, were professional and courteous in dealings, and delivered items well before time. I have got an efficient e-commerce platform for my services. My revenue has increased and I will definitely use your services again.",
            "author":"Arun M", "about":"Founder, The Traveller, UK"},
        {"comment":"I wanted to take a moment to thank you for the services your team has provided. Your team has been a pleasure to work with, professional and timely. The only delay in work that we have experienced has been due to our own lack of organization managing our projects, not yours. Job well done and I hope we can continue to grow together.",
            "author":"Yoosof V", "about":"Director, Traverse 360 Consultation"},
        {"comment":"A robust congratulations to the team at Epoq Zero for a job well done. We've been trying to put together a functional website since we began our practice in April of 2018. I am happy to say we finally hired the e0 team and they've worked closely with us throughout the process, staying on task, on target, and on budget. I also appreciate their quick and courteous responses. I highly recommend their service!",
            "author":"Evelyn Faye", "about":"Strategic Director, Ixora Club, Jeddah, KSA"},
        {"comment":"The workshop of cross-platform app development conducted by Mr. Aswin PG and Mr. Rajath KS was extremely edifying. It has given a multi-dimensional perspective into the world of development. We were also highly appreciative of the fact that young talents are nurtured here by internships and vigorous trainings. Looking forward to more sessions on different aspects of development.",
            "author":"Aysha CM", "about":"GEC Palakkad, Kerala"},
        {"comment":"Great value proposition at affordable cost. Flawless execution of ideas into real-time solutions. What impressed me the most was their honest communication about what was practically possible. They give you a detailed work breakdown structure with a reliable quote and timeline so we  know what to expect and when a milestone is reached. It has been an absolute pleasure working with the highly efficient  team at Epoch Zero.",
            "author":"Jansher Von", "about":"Marketing Manager, Adriatic Solutions, Bahrain"},
        {"comment":"After evaluating a few outsourcers, we decided to work with Epoq Zero because of their professional approach and ability to make changes to what we wanted. In the beginning, we had to make adjustments to the task every week.  We are very satisfied with our engagement with Mr. Haris and Team and would consider working together on future projects too. We appreciate their promptness, quality of work, IT expertise and would recommend their services.",
            "author":"PaperCrane Solutions", "about":"Thrissur, Kerala"}
    
    ]



    

    function myFunction() {
        setInterval(() => {
            counter=(counter+1)%7
            document.getElementById("comment").textContent=testimonials[counter].comment
            document.getElementById("author").textContent=testimonials[counter].author
            document.getElementById("about").textContent=testimonials[counter].about
            document.getElementById("counter").textContent=counter+1 + ' / 7'
        }, 10000);
      }

    //   myFunction()



   

var counter = 0
document.getElementById("comment").textContent=testimonials[counter].comment
document.getElementById("author").textContent=testimonials[counter].author
document.getElementById("about").textContent=testimonials[counter].about
document.getElementById("counter").textContent=counter+1 + ' / 7'

function nextComment(){
    counter = (counter+1)%7
    console.log(counter)
    document.getElementById("comment").textContent=testimonials[counter].comment
    document.getElementById("author").textContent=testimonials[counter].author
    document.getElementById("about").textContent=testimonials[counter].about
    document.getElementById("counter").textContent=counter+1 + ' / 7'

}

function backComment(){
    counter = (7+(counter-1))%7
    console.log(counter)
    document.getElementById("comment").textContent=testimonials[counter].comment
    document.getElementById("author").textContent=testimonials[counter].author
    document.getElementById("about").textContent=testimonials[counter].about
    document.getElementById("counter").textContent=counter+1 + ' / 7'

}

function openNav() {
    document.getElementById("mySidepanel").style.width = "300px";
  }
  
  function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
  }

  var flagUi = false
  var flagFire = false
  var flagXam = false
  var flagMar = false
  var flagPsy = false
  var flagDja = false

  function readMoreUiFunction() {
      flagUi=!flagUi
    var contentText = document.getElementById("contentUi");
    var btnText = document.getElementById("buttonReadMoreUi");
  
    if (!flagUi) {
      btnText.innerHTML = "Read More";
      contentText.style.display = "none";
    } else {
      btnText.innerHTML = "Show Less";
      contentText.style.display = "inline";
    }
  }

  
  function readMoreXamFunction() {
    flagXam=!flagXam
  var contentText = document.getElementById("contentXam");
  var btnText = document.getElementById("buttonReadMoreXam");

  if (!flagXam) {
    btnText.innerHTML = "Read More";
    contentText.style.display = "none";
  } else {
    btnText.innerHTML = "Show Less";
    contentText.style.display = "inline";
  }
}


function readMoreFireFunction() {
    flagFire=!flagFire
  var contentText = document.getElementById("contentFire");
  var btnText = document.getElementById("buttonReadMoreFire");

  if (!flagFire) {
    btnText.innerHTML = "Read More";
    contentText.style.display = "none";
  } else {
    btnText.innerHTML = "Show Less";
    contentText.style.display = "inline";
  }
}

function readMoreMarFunction() {
    flagMar=!flagMar
  var contentText = document.getElementById("contentMar");
  var btnText = document.getElementById("buttonReadMoreMar");

  if (!flagMar) {
    btnText.innerHTML = "Read More";
    contentText.style.display = "none";
  } else {
    btnText.innerHTML = "Show Less";
    contentText.style.display = "inline";
  }
}

function readMorePsyFunction() {
    flagPsy=!flagPsy
  var contentText = document.getElementById("contentPsy");
  var btnText = document.getElementById("buttonReadMorePsy");

  if (!flagPsy) {
    btnText.innerHTML = "Read More";
    contentText.style.display = "none";
  } else {
    btnText.innerHTML = "Show Less";
    contentText.style.display = "inline";
  }
}

function readMoreDjaFunction() {
    flagDja=!flagDja
  var contentText = document.getElementById("contentDja");
  var btnText = document.getElementById("buttonReadMoreDja");

  if (!flagDja) {
    btnText.innerHTML = "Read More";
    contentText.style.display = "none";
  } else {
    btnText.innerHTML = "Show Less";
    contentText.style.display = "inline";
  }
}