let username 
let socket = io()

const yourname = document.querySelector('#yourname')
const course = document.querySelector('#course')
const hostal = document.querySelector('#hostal')
const phoneno = document.querySelector('#phoneno')
const textarea = document.querySelector('#textarea')
const submitBtn = document.querySelector('#submitBtn')
const commentBox = document.querySelector('.comment__box')

submitBtn.addEventListener('click', (e) => {
    
    e.preventDefault()
    let comment = textarea.value
    let name=yourname.value
    let Course =course.value
    let Hostal =hostal.value
    let PhoneNo =phoneno.value
    if(!comment || !name || !Course || !Hostal || !PhoneNo) {
        return  
    }
    postComment(comment,name,Course,Hostal,PhoneNo)
    alert('Feedback Submitted!')
}) 

function postComment(comment,name,Course,Hostal,PhoneNo) {
    // Append to dom
    let data = {
        username: username,
        name:name,
        comment: comment,
        Course : Course,
        Hostal : Hostal,
        PhoneNo: PhoneNo
    }
    appendToDom(data)
    textarea.value = ''
    yourname.value = ''
    course.value = ''
    hostal.value = ''
    phoneno.value = ''
    // Broadcast
    broadcastComment(data)
    // Sync with Mongo Db
    syncWithDb(data)

}

function appendToDom(data) {
    let lTag = document.createElement('li')
    lTag.classList.add('comment', 'mb-3')

    let markup = `
                        <div class="card border-light mb-3 shadow rounded">
                            <div class="card-body">
                                <h6 class="text-uppercase">${data.name} ( ${data.Course} )</h6>
                                <small class="text-uppercase"><strong>Hostal/Locality : ${data.Hostal}</strong></small>
                                <div class="mt-2 text-uppercase">
                                <p>${data.comment}</p>
                                </div>
                                <div>
                                    <img src="/img/clock.png" alt="clock">
                                    <small>${moment(data.date).format('Do MMMM YYYY')}</small>
                                </div>
                            </div>
                        </div>
    `
    lTag.innerHTML = markup

    commentBox.prepend(lTag)
}

function broadcastComment(data) {
    // Socket
    socket.emit('comment', data)
}

socket.on('comment', (data) => {
    appendToDom(data)
})
let timerId = null
function debounce(func, timer) {
    if(timerId) {
        clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
        func()
    }, timer)
}
let typingDiv = document.querySelector('.typing')
socket.on('typing', (data) => {
    typingDiv.innerText = `someone is typing...`
    debounce(function() {
        typingDiv.innerText = ''
    }, 1000)
})

// Event listner on textarea
textarea.addEventListener('keyup', (e) => {
    socket.emit('typing', { username })
})

// Api calls 

function syncWithDb(data) {
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/comments', { method: 'Post', body:  JSON.stringify(data), headers})
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
}

function fetchComments () {
    fetch('/api/viewfd')
        .then(res => res.json())
        .then(result => {
            result.forEach((comment) => {
                comment.date = comment.createdAt
                appendToDom(comment)
            })
        })
}

window.onload = fetchComments
