$("document").ready(function() {
        var header = document.getElementById("resultHeader");
        sessionStorage.setItem("sticky", header.offsetTop);        
        getData();
        sessionStorage.setItem("currentExercise", 0)
        sessionStorage.setItem("currentState", "leftNumber")     
});

function getData() {
    
   $.ajax({
    type: "POST",
    url: 'SharedScripts/getSharedGame.php',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({"gameId": "56D969B6-6710-45E1-BDAC-547CEB473A3C"}),
    headers: {'Access-Control-Allow-Origin': 'https://applicube.com/'},
    success: function (obj, textstatus) {
                  if( !('error' in obj) ) {
                    document.getElementById("resultHeader").innerHTML = obj.result;
                    $("#hiddenGoal").text(obj.result)
                    
                    var leftWidth = $("#applicubeHeaderName").position().left + $("#applicubeHeaderName").width()
                    var rightWidth = $(window).width() - $("#applicubeHeaderLogo").position().left
                    if (leftWidth > rightWidth) {
                        $("#hiddenGoal").css("margin-right", leftWidth - rightWidth)
                    } else {
                        $("#hiddenGoal").css("margin-left", rightWidth - leftWidth)                            
                    }
                        
                    $(window).scroll(function() {
                        alignHiddenGoal()
                    });

                    var numz = obj.numz.split(",");
                    sessionStorage.setItem("numzArray", JSON.stringify(numz));

                    var i;
                    for (i = 0; i < numz.length; i++) { 
                        createNumButton(numz[i])
                    }
                     addNumClick();

                    
                    var opers = new Array()
                    var operations = obj.operations.split(",");
                    opers.push("+", "-");

                    for (i = 0; i < operations.length; i++) { 

                        if (operations[i] == "multiply") {
                            opers.push("x");
                        }
                        if (operations[i] == "divide") {
                            opers.push(":");
                        }
                    }

                    for (i = 0; i < opers.length; i++) { 
                        createOperButton(opers[i])
                    }
                    
                    createUndoContainerButtons()
                    addOperClick()
                    addUndoClick()
                    addReloadClick()
                    addDismissClick()
                    
                    $(window).scrollTop(0);

                  }
                  else {
                      console.log(obj.error);
                  }
            }
    }); 
}

function alignHiddenGoal() {
    if (window.pageYOffset >= Number(sessionStorage.getItem("sticky"))) {
        $("#hiddenGoal").css("display", "block");
    } else {
        $("#hiddenGoal").css("display", "none");
    }                    
}

function createNumButton(value) {
    var num = document.createElement("div");
    var node = document.createTextNode(value);
    num.appendChild(node);
    num.classList.add("numButton")
    num.classList.add("rightShadow")
    var element = document.getElementById("numContainer");
    element.appendChild(num);   
    scrollToFooter()
}

function scrollToFooter() {
    $(".footerSpacer")[0].scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
}

function createOperButton(value) {
    var oper = document.createElement("div");
    var node = document.createTextNode(value);
    oper.appendChild(node);
    oper.classList.add("operButton")
    oper.classList.add("rightShadow")
    var element = document.getElementById("opersContainer");
    element.appendChild(oper);    
}

function createUndoContainerButtons() {
    var undo = document.createElement("div");
    var node = document.createTextNode("⟲");
    undo.appendChild(node);
    undo.classList.add("undoButton")
    undo.classList.add("rightShadow")
    
    var reload = document.createElement("div");
    var node = document.createTextNode("⟳");
    reload.appendChild(node);
    reload.classList.add("reloadButton")
    reload.classList.add("rightShadow")
    var element = document.getElementById("undoContainer");
    element.appendChild(undo);    
    element.appendChild(reload);    
}

function addOperClick() {
    $(".operButton").on("click", function(evt) {
        var target = $(evt.target);    
        if (target.parents('#exerciseContainer').length) {
            return false;
        }
        
        if (sessionStorage.getItem("currentExercise") > 0 && sessionStorage.getItem("currentState") == "leftNumber") {
            var prevExId = "exercise".concat(sessionStorage.getItem("currentExercise") - 1)
            
            var exercise = $("<exercise/>").attr('id','exercise' + sessionStorage.getItem("currentExercise")).attr('class', "exercise rightShadow"); 
            $(exercise).hide()
            var num = document.createElement("div");
            var node = document.createTextNode($("#" + prevExId + " .numButton:last").text());
            num.appendChild(node);
            num.classList.add("numButton")
            exercise.append(num);
            $(num).css("border", "0px")
            $(num).css("background-color", "black")
            $(num).removeClass("rightShadow")
            $(exercise).fadeIn()
            $("#exerciseContainer").append(exercise);    
            $("#numContainer .numButton:last").remove()
            sessionStorage.setItem("currentState", "oper")  
        }

        if (sessionStorage.getItem("currentState") == "rightNumber") {
            var exId = "exercise".concat(sessionStorage.getItem("currentExercise"))
            $("#" + exId + " .operButton:last").text(target.text())
        }

        if (sessionStorage.getItem("currentState") == "oper") {
            var exId = "exercise".concat(sessionStorage.getItem("currentExercise"))
            var newOper = target.clone()
            $(newOper).hide()
            $(newOper).css("border", "0px")
            $(newOper).css("background-color", "black")
            $(newOper).removeClass("rightShadow")
            $("#" + exId).append(newOper);
            $(newOper).fadeIn()
            sessionStorage.setItem("currentState", "rightNumber")    
            scrollToFooter()
        }
    });
}

function addUndoClick() {
    $(".undoButton").on("click", function(evt) {
        var target = $(evt.target);    
        if (sessionStorage.getItem("currentExercise") == 0 && sessionStorage.getItem("currentState") == "leftNumber") {
            return false
        }
        
        if (sessionStorage.getItem("currentState") == "rightNumber") {
            var exId = "exercise".concat(sessionStorage.getItem("currentExercise"))
            $("#" + exId + " .operButton:last").remove()
            sessionStorage.setItem("currentState", "oper")  
        } else if (sessionStorage.getItem("currentState") == "oper") {
            var exId = "exercise".concat(sessionStorage.getItem("currentExercise"))
            createNumButton($("#" + exId + " .numButton:first").text())   
            $("#" + exId).fadeOut(function() {
                $("#" + exId + " .numButton:first").remove()
                $("#" + exId).remove()
                sessionStorage.setItem("currentState", "leftNumber")    
                addNumClick()
            })
        } else {
            sessionStorage.setItem("currentExercise", parseInt(sessionStorage.getItem("currentExercise")) - 1); 
            var exId = "exercise".concat(sessionStorage.getItem("currentExercise"))
            $("#numContainer .numButton:last").fadeOut(function() {
                $("#numContainer .numButton:last").remove()
                $("#" + exId + " .operButton:last").remove()
                $("#" + exId + " .numButton:last").remove()
                createNumButton($("#" + exId + " .numButton:last").text())  
                $("#" + exId + " .numButton:last").remove()
                sessionStorage.setItem("currentState", "rightNumber")    
                addNumClick()
            })

        }
    });
}

function addReloadClick() {
    $(".reloadButton").on("click", function(evt) {
        $("#exerciseContainer").empty()
        $("#numContainer").empty()
        var numz = JSON.parse(sessionStorage.getItem("numzArray"));
        var i;
        for (i = 0; i < numz.length; i++) { 
            createNumButton(numz[i])
        }
        sessionStorage.setItem("currentState", "leftNumber")     
        addNumClick()
    });
}

function addDismissClick() {
    $(".dismissButton").on("click", function(evt) {
        $(".modalGreatJob").css("display", "none")
    })
}

function onClick(evt) {
    var target = $(evt.target);    
    if (target.parents('#exerciseContainer').length) {
        return false;
    }
    
    if (sessionStorage.getItem("currentState") == "leftNumber") {
        var exercise = $("<exercise/>").attr('id','exercise' + sessionStorage.getItem("currentExercise")).attr('class', "exercise rightShadow");    
        exercise.hide()
        var newNum = $(target).clone()
        $(newNum).css("border", "0px")
        $(newNum).css("background-color", "black")
        $(newNum).removeClass("rightShadow")
        exercise.append(newNum);
        this.remove()
        $(newNum).fadeTo("fast", 1.0)
        exercise.fadeIn()
        if (sessionStorage.getItem("currentExercise") == 0) {
            $("#exerciseContainer").hide().append(exercise).fadeIn();     
        } else {
            $("#exerciseContainer").append(exercise);                         
        }
        sessionStorage.setItem("currentState", "oper") 
        scrollToFooter()
    } else if (sessionStorage.getItem("currentState") == "rightNumber") {
        var exId = "exercise".concat(sessionStorage.getItem("currentExercise"))
        if ($("#" + exId + " .operButton:first").text() == ":") {
            if (target.text() == "0") {
                return false
            }
        }
        
        var newNum = $(target).clone()
        $(newNum).hide()
        $(this).remove()
        $("#" + exId).append(newNum);
        $(newNum).css("border", "0px")
        $(newNum).css("background-color", "black")
        $(newNum).removeClass("rightShadow")
        $(newNum).fadeIn()
        calc()
        sessionStorage.setItem("currentExercise", parseInt(sessionStorage.getItem("currentExercise")) + 1); 
        sessionStorage.setItem("currentState", "leftNumber")  
    }
}

function addNumClick() {
    $(".numButton").off("click")
    $(".numButton").on("click", onClick)
}

function calc() {
    var exId = "exercise".concat(sessionStorage.getItem("currentExercise"));
    var left = $("#" + exId + " .numButton:first").text();
    var right = $("#" + exId + " .numButton:last").text();
    var oper = $("#" + exId + " .operButton:first").text();
    
    switch (oper) {
        case "+":
            var result = (Number(left) + Number(right)).toFixed(2) == Number(left) + Number(right) ? Number(left) + Number(right) : (Number(left) + Number(right)).toFixed(2)
            addResult(result)
            break;
        case "-":
            var result = (Number(left) - Number(right)).toFixed(2) == Number(left) - Number(right) ? Number(left) - Number(right) : (Number(left) - Number(right)).toFixed(2)
            addResult(result)
            break;
        case "x":
            var result = (Number(left) * Number(right)).toFixed(2) == Number(left) * Number(right) ? Number(left) * Number(right) : (Number(left) * Number(right)).toFixed(2)
            addResult(result)
            break;
        case ":":
            var result = (Number(left) / Number(right)).toFixed(2) == Number(left) / Number(right) ? Number(left) / Number(right) : (Number(left) / Number(right)).toFixed(2)
            addResult(result)
            break;
        default:
            break;
    }
}

function addResult(exerciseResult) {
    if ( $('#numContainer').children().length > 0 ) {
        createNumButton(exerciseResult)
    }
    
    var exId = "exercise".concat(sessionStorage.getItem("currentExercise"))
    var oper = document.createElement("div");
    var node = document.createTextNode("=");
    oper.appendChild(node);
    oper.classList.add("operButton")
    $(oper).hide()
    $("#" + exId).append(oper);     
    $(oper).css("border", "0px")
    $(oper).css("background-color", "black")
    $(oper).removeClass("rightShadow")
    $(oper).fadeIn()
    
    var result = document.createElement("div");
    var node2 = document.createTextNode(exerciseResult);
    result.appendChild(node2);
    result.classList.add("numButton")
    $(result).hide()
    $("#" + exId).append(result);
    $(result).css("border", "0px")
    $(result).css("background-color", "black")
    $(result).removeClass("rightShadow")
    $(result).fadeIn()
    
    if ( $('#numContainer').children().length == 0 ) {
        var goal = Number($("#resultHeader").text());
        if (goal == exerciseResult) {
            $(".modalGreatJob").css("display", "flex")            
        }
    }
            
    addNumClick()
}

function didTapNumButton(evt) {
}

function playGame() {
    $(".numButton").on("click", function(evt) {
        if (sessionStorage.getItem("currentState") == "leftNumber") {
            var exercise = $("<exercise/>").attr('id',sessionStorage.getItem("currentExercise"));    
            exercise.classList.add("exercise");
            exercise.appendChild(this);
            $("#exerciseContainer").appendChild(exercise);         

        }
//    $("#evtTarget").off("mouseover mouseleave", highlight);
//    $("#evtTarget").html("<p>You shut off the hover effect!</p>");
//    $("#evtTarget").removeClass("highlighted");
    });

}










