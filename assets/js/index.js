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
            "author":"Shabas Ahammed", "about":"Co-Founder, Estudo"},
        {"comment":"I am really impressed by the quality of services I received from Epoq Zero. You were right on schedule, charged reasonable prices, were professional and courteous in dealings, and delivered items well before time. I have got an efficient e-commerce platform for my services. My revenue has increased and I will definitely use your services again.",
            "author":"Arun M", "about":"Founder, The Traveller, UK"},
        {"comment":"I wanted to take a moment to thank you for the services your team has provided. Your team has been a pleasure to work with, professional and timely. The only delay in work that we have experienced has been due to our own lack of organization managing our projects, not yours. Job well done and I hope we can continue to grow together.",
            "author":"Yoosof V", "about":"Director, Traverse 360 Consultation"},
        {"comment":"A robust congratulations to the team at Epoq Zero for a job well done. We've been trying to put together a functional website since we began our practice in April of 2018. I am happy to say we finally hired the e0 team and they've worked closely with us throughout the process, staying on task, on target, and on budget. I also appreciate their quick and courteous responses. I highly recommend their service!",
            "author":"Evelyn Faye", "about":"Strategic Director, Ixora Club, Jeddah, KSA"},
        {"comment":"",
            "author":"", "about":""},
        {"comment":"",
            "author":"", "about":""},
        {"comment":"",
            "author":"", "about":""},
    
    ]


    function myFunction() {
        setInterval(() => {
            counter=(counter+1)%4
            document.getElementById("comment").textContent=testimonials[counter].comment
            document.getElementById("author").textContent=testimonials[counter].author
            document.getElementById("about").textContent=testimonials[counter].about
        }, 10000);
      }

      myFunction()
   

var counter = 0
document.getElementById("comment").textContent=testimonials[counter].comment
document.getElementById("author").textContent=testimonials[counter].author
document.getElementById("about").textContent=testimonials[counter].about

function nextComment(){
    counter = (counter+1)%4
    console.log(counter)
    document.getElementById("comment").textContent=testimonials[counter].comment
    document.getElementById("author").textContent=testimonials[counter].author
    document.getElementById("about").textContent=testimonials[counter].about

}

function backComment(){
    counter = (4+(counter-1))%4
    console.log(counter)
    document.getElementById("comment").textContent=testimonials[counter].comment
    document.getElementById("author").textContent=testimonials[counter].author
    document.getElementById("about").textContent=testimonials[counter].about

}

function openNav() {
    document.getElementById("mySidepanel").style.width = "300px";
  }
  
  function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
  }