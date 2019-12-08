$(function () {

    function showPage(page) {
        window.location.replace(page)
    }

    $('button.signup').click(() => {
        showPage("/signup");
    })

    $('button.login').click(() => {
        showPage("/login");
    })

    $('button.post-new').click(() => {
        media_ids = [];
        var files = $("input.file.new")[0].files;
        console.log(files)

        // for each file in input
        const addMedias = async _ => {          
            for (let i = 0; i < files.length; i++) {
              const file = files[i]
              const id = await addMedia(file)
              console.log(id)
              media_ids.push(id)
            }

            console.log(media_ids);
        }

        if(files.length > 0)
            addMedias();


        addItem('new', media_ids);
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

    $('button.delete').click(function() {
        var id = this.id.split("-")[1];

        fetch("/item/" + id, {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
        })
        // .then(response => {
        //     return response.json();
        // })
        .then(response => {
            console.log(response);

            if(response.status == 200) {
                $('#item-' + id).remove()
                $('#post-reply-' + id).remove()
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
                // params[2] = !follow;
                // $(this).prop("id", params.join("-"));
                followButtonText = follow ? "Unfollow" : "Follow";
                $(this).prop("id", "follow" + "-" + username + "-" + !follow);
                $(this).toggleClass("btn-primary");
                $(this).toggleClass("btn-danger");
                $(this).html(followButtonText);

                follwersCount = parseInt($("span.followers.count").html());
                follwersCount = follow ? ++follwersCount : --follwersCount;
                $("span.followers.count").html(follwersCount);
            }
        })
    })

    $('form.search').submit(function(event) {
        event.preventDefault();

        var data = $(this).serializeArray().reduce((dict, field) => {
            dict[field.name] = field.value;
            return dict;
        }, {});

        fetch("/search", {
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
                $('.modal.search').modal('hide');
                $('.items-list').empty();
                response.items.forEach(item => {
                    $('.items-list-header').html('Search results');
                    // test if request.user == item.user
                    $('.items-list').append(renderItem(item, false));
                });
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
                showPage("/login");
        })
    })

    async function addMedia(file) {
        var data = new FormData();
        var csrftoken = getCookie('csrftoken')

        data.append('media', file);

        console.log(data)
        return fetch("/addmedia", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                // "Content-Type": "multipart/form-data",
                "X-CSRFToken": csrftoken
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: data
        })
        .then(response => {
            return response.json();
        })
    }

    function addItem(type, media_ids) {
        $('form.post-' + type).submit(function(event) {
            event.preventDefault();
    
            var data = $(this).serializeArray().reduce((dict, field) => {
                dict[field.name] = field.value;
                return dict;
            }, {});

            data['childType'] = type=='new' ? null : type;
            data['media'] = media_ids;
            
            console.log(data)
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
                
                if(response.status == "OK") {
                    item = {
                        "id": response.id,
                        "username": getCookie("username"),
                        "property": {
                            "likes": 0,
                        },
                        "retweeted": 0,
                        "content": data.content,
                        // "timestamp":
                    }
                    // $('.items-list').prepend(renderItem(item, true));
                    console.log("hello", media_ids)
                }
            })
        })
    }

    function renderItem(item, allowDelete) {
        deleteItemButton = allowDelete ? '<button class="delete btn btn-sm btn-link text-danger" id="delete-' + item.id + '"><small><i class="fas fa-trash-alt"></i></small></button>' : ""
        return (`
            <div id="item-` + item.id + `" class="media text-muted pt-3">
            <svg class="bd-placeholder-img mr-2 rounded-circle" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"/><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
            <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                <strong class="d-block text-gray-dark"><a class="text-dark text-decoration-none" href="/user/` + item.username + `/profile">@` + item.username + `</a></strong>
                <span class="content-` + item.id + `">` + item.content + `</span>
                <span class="d-block text-right">`
                    + deleteItemButton +
                    `<button class="btn btn-sm btn-link" id="reply-` + item.id + `" data-toggle="collapse" data-target="#post-reply-` + item.id + `"><small><i class="fas fa-reply"></i></small></button>
                    <button class="btn btn-sm btn-link" id="retweet-` + item.id + `" data-toggle="collapse" data-target="#post-retweet-` + item.id + `"><small><i class="fas fa-retweet"></i></small></button>
                    <button class="like btn btn-sm btn-link" id="like-` + item.id + `"><small><i class="far fa-heart"></i> <span class="likes-` + item.id + `">` + item.property.likes + `</span></small></button>
                </span>
            </p>
            </div>
            <div id="post-reply-` + item.id + `" class="collapse my-4">
                <form class="post-reply ml-5 mr-2">
                    <div class="form-group">
                        <input type="text" name="content" class="form-control" placeholder="">
                    </div>
                    <div class="form-group">
                        <div class="custom-file">
                            <input type="file" name="media" class="custom-file-input rounded-pill px-3" id="customFile">
                            <label class="custom-file-label" for="customFile">Choose file</label>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="post-reply btn btn-primary rounded-pill px-4">Reply</button>
                    </div>
                </form>
            </div>
        `);
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