$(function () {

    function showPage(page) {
        window.location.replace(page)
    }

    $('form.follow').submit(function(event) {
        event.preventDefault();

        var data = $(this).serializeArray().reduce((dict, field) => {
            dict[field.name] = field.value;
            return dict;
        }, {});

        data['follow'] = false;

        console.log(data)
        
        fetch("/follow", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);

            if(response.status == "OK")
                showPage('home')
                // renderView();
                // resetGame();
        })
    })

    $('#test').click(() => {
        var data = {
            "id": "093019215306"
        }
        
        fetch("/getgame", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);
        })
    })

    $('button.signup').click(() => {
        showPage("signup");
    })

    $('button.login').click(() => {
        showPage("login");
    })

    $('button.reset').click(() => {
        resetGame();
    })

    $('button.post-new').click(() => {
        addItem('new');
    })

    $('button.post-reply').click(() => {
        addItem('reply');
    })

    $('button.post-retweet').click(() => {
        data = {
            // "content": 
            "childType": "tweet",
        }
        fetch("/additem", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": data['csrfmiddlewaretoken']
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);
            
            // if(response.status == "OK")
                
        })
    })

    $('button.like').click(function() {
        var id = this.id.split("-")[1];
        var data = {
            "id": id,
        }
        console.log(data)
        fetch("/like", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);
            
            if(response.status == "OK") {
                $('span.likes-' + id).html(response.likes)
            }
        })
        
    })

    $('button.followers').click(function() {
        var username = this.id.split("-")[1];

        fetch("/user/" + username + "/followers", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);
            $(".followers.modal-title").html('Followers')

            if(response.status == "OK") {
                $("div.followers.list").empty();

                response.users.forEach((user) => {
                    $("div.followers.list").append(`
                        <div class="media text-muted pt-3">
                            <svg class="bd-placeholder-img mr-2 rounded-circle" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"/><text x="50%" y="50%" fill="#e83e8c" dy=".3em"></text></svg>
                            <p class="media-body pb-3 mb-0 small lh-125">
                                <strong class="d-block text-gray-dark">@` + user + `</strong>
                            </p>
                        </div>
                    `)
                });
            }
        })
    })

    $('button.following').click(function() {
        var username = this.id.split("-")[1];

        fetch("/user/" + username + "/following", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);
            $(".following.modal-title").html('Following')

            if(response.status == "OK") {
                $("div.following.list").empty();

                response.users.forEach((user) => {
                    $("div.following.list").append(`
                        <div class="media text-muted pt-3">
                            <svg class="bd-placeholder-img mr-2 rounded-circle" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"/><text x="50%" y="50%" fill="#e83e8c" dy=".3em"></text></svg>
                            <p class="media-body pb-3 mb-0 small lh-125">
                                <strong class="d-block text-gray-dark">@` + user + `</strong>
                            </p>
                        </div>
                    `)
                });
            }
        })
    })

    $('button.follow').click(function() {
        var csrftoken = getCookie('csrftoken');
        var params = this.id.split("-")
        var username = params[1];
        var follow = params[2] == "true" ? true : false;
        var data = {
            "username": username,
            "follow": follow,
        }

        fetch("/follow", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);

            if(response.status == "OK") {
                $(this).prop("id", "follow" + username + !follow.toString());
                $(this).toggleClass("btn-primary");
                $(this).toggleClass("btn-danger");
                $(this).html("Unfollow");
            }
        })
    })

    $('#signupForm').submit(function(event) {
        event.preventDefault();

        var data = $(this).serializeArray().reduce((dict, field) => {
            dict[field.name] = field.value;
            return dict;
        }, {});
        
        fetch("/adduser", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);
            
            if(response.status == "OK")
                // renderView();
                // $("input.verify-email").val(data["email"]) // also save as cookie?
                showPage("verify?email="+data["email"]);
        })
    })

    $('#verifyForm').submit(function(event) {
        event.preventDefault();

        var data = $(this).serializeArray().reduce((dict, field) => {
            dict[field.name] = field.value;
            return dict;
        }, {});
        
        fetch("/verify", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);
            
            if(response.status == "OK")
                // renderView();
                showPage("login");
        })
    })

    $('#loginForm').submit(function(event) {
        event.preventDefault();

        var data = $(this).serializeArray().reduce((dict, field) => {
            dict[field.name] = field.value;
            return dict;
        }, {});
        
        fetch("/login", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);

            if(response.status == "OK")
                showPage('home')
                // renderView();
                // resetGame();
        })
    })

    $('button.logout').click(function(event) {
        fetch("/logout", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            console.log(response);

            if(response.status == "OK")
                // renderView();
                showPage("login");
        })
    })

    function addItem(type) {
        $('form.post-' + type).submit(function(event) {
            event.preventDefault();
    
            var data = $(this).serializeArray().reduce((dict, field) => {
                dict[field.name] = field.value;
                return dict;
            }, {});
            data['childType'] = type=='new' ? null : type;
            
            fetch("/additem", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": data['csrfmiddlewaretoken']
                },
                redirect: "follow",
                referrer: "no-referrer",
                body: JSON.stringify(data)
            })
            .then(response => {
                return response.json();
            })
            .then(response => {
                console.log(response);
                
                // if(response.status == "OK")
                    
            })
        })
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

});