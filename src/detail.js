const $detailContainer = document.querySelector('#detailed_introduction');
const $commentBox = document.querySelector('#reviewbox');
const $encryptScript = document.createElement('script');

const movie_id = new URLSearchParams(location.search).get("id");

let movie;
let movieConfig;
let comment_list = JSON.parse(localStorage.getItem(movie_id));

// 임시로 본인 API키 사용 중....
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTczM2JlZWJiMmJhNmZlOWRiY2QxYWZiYWMzNGY4NyIsInN1YiI6IjY2MmExNzQwMzNhNTMzMDA5YmQxZDI5ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iy6fJyWI7Os_VFgPwtAcFHOby3PIXzVRbiV3cOSk3cc'
    }
};

// 페이지 진입 시 초기화.
init();    

function init() {

    // SHA-256 암호화 스크립트 가져옴.
    $encryptScript.src = "https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js";
    document.head.appendChild($encryptScript);

    fetch('https://api.themoviedb.org/3/configuration', options)
        .then(response => response.json())
        .then(response => {
            movieConfig = response.images;
            
            fetch(`https://api.themoviedb.org/3/movie/${movie_id}?language=ko-KR`, options)
                .then(response => response.json())
                .then(response => {
                    movie = response;
                    //console.log(movie);
                    loadMovieDetails();     // 영화의 자세한 정보를 가져온다.
                    loadcomments();          // 해당 영화의 리뷰를 가져온다.
                    addEventToModal();
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
}

// 영화 상세페이지 정보 입력 함수
function loadMovieDetails() {
    
    let _fullUrl = movieConfig.base_url + movieConfig.poster_sizes[4] + movie.poster_path;

    $detailContainer.querySelector('img').src = _fullUrl;
    $detailContainer.querySelector('#movie_title').textContent = movie.original_title;
    $detailContainer.querySelector('#movie_contents').textContent = movie.overview; 
     
}

// 저장된 리뷰들을 불러오는 함수
function loadcomments(){

    // 저장된 리뷰가 없다면 리턴.
    if(localStorage.getItem(movie_id) === null) return;
    
    // 저장된 모든 리뷰들을 리뷰칸에 추가한다.
    let commentList = JSON.parse(localStorage.getItem(movie_id));
    for(let i = 0; i < commentList.length; i++){
        appendcomment(commentList[i], i);
    }
}

// 리뷰를 리뷰칸에 추가한다.
function appendcomment(comment_info, comment_id) {
    const $commentCotainer = document.createElement('div');

    $commentCotainer.setAttribute("class", "review");
    $commentCotainer.setAttribute("value", comment_info.password);
    $commentCotainer.setAttribute("id", comment_id);
    
    let temp_html = `
        <div class="user_info">
            <div>${comment_info.nickname}</div>
            <div>score: ${comment_info.rate}</div>
        </div>
        <img src="assets/edit-button.png" class="edit-btn" style="width: 50px; height: 50px;"></img>
        <img src="assets/delete-button.png" class="delete-btn" style="width: 50px; height: 50px;"></img>
        <div class="review_comments">
            ${comment_info.comment}
        </div>
    `;

    $commentCotainer.innerHTML = temp_html;
    addEventToComment($commentCotainer);
     
    $commentBox.append($commentCotainer);
}

// 비밀번호를 확인하는 함수. 일치 시 true, 아닐 시 false 반환.
function checkPassword(password_correct){
    const password_try = prompt('비밀번호를 입력하세요:');

    if (password_try && sha256(password_try) === password_correct) {
        return true;
    }
    
    alert("비밀번호가 일치하지 않습니다.");

    return false;
}

// 리뷰에 버튼 이벤트 추가.
function addEventToComment($commentCotainer){
    const $editButton = $commentCotainer.querySelector('.edit-btn');
    const $deleteButton = $commentCotainer.querySelector('.delete-btn');
    
    $editButton.addEventListener("click", function(e){
        e.preventDefault();
        alert("edit button clicked!");

        if(checkPassword($commentCotainer.getAttribute('value'))){
        
            let idx = $editButton.parentElement.getAttribute('id');
            
            openModal('edit', idx);
        }
            
    })
    
    $deleteButton.addEventListener("click", function(e){
        e.preventDefault();
        
        if(!checkPassword($deleteButton.parentElement.getAttribute("value"))) return;

        if(confirm("정말로 삭제하시겠습니까?")){          
                          
            let idx = $deleteButton.parentElement.getAttribute('id');
            //console.log(idx);
            comment_list.splice(idx, 1);
            window.localStorage.setItem(movie_id, JSON.stringify(comment_list));

            alert("해당 댓글이 삭제되었습니다.");
            window.location.reload();
        }   
        
    })
}

//------------------------------ 모달 관련 함수 시작 -----------------------

// 모달에 버튼 기능 달아주는 함수.
function addEventToModal(){
    document.getElementById('commentBtn').addEventListener('click', function () {
        openModal("create", -1);
    });

    document.getElementById('modalForm').addEventListener('submit', function (event) {
        event.preventDefault();
        submitComment();
    });

    document.getElementById('modalCancelBtn').addEventListener('click', function () {
        closeModal();
    });
}

// action에 따른 모달 창 open하는 함수. action: create | edit
function openModal(action, commentIndex) {

    // 모달 디스플레이 ON
    document.getElementById('commentModal').style.display = 'block';
    
    if(action == "create") {        
        // 리뷰 새로 쓰는 경우.
        document.getElementById('userNameModal').value = '';
        document.getElementById('userPasswordModal').value = '';
        document.getElementById('userCommentModal').value = '';
        document.getElementById('modalSubmitBtn').removeAttribute('data-index');
        document.getElementById('modalSubmitBtn').setAttribute('status', action);
    }
    else if (action === 'edit') {   
        // 리뷰를 편집하는 경우.    
        let comment = comment_list[commentIndex];
        document.getElementById('userNameModal').value = comment.nickname;
        // document.getElementById('userPasswordModal').value = comment.password;
        document.getElementById('userCommentModal').value = comment.comment;
        document.getElementById('modalSubmitBtn').setAttribute('data-index', commentIndex);
        document.getElementById('modalSubmitBtn').setAttribute('status', action);
    } 
    else{
        // 존재하지 않는 action으로 해당 함수로 진입한 경우.
        alert("inValid Access to openModal fuction");
        document.getElementById('commentModal').style.display = 'none';
    }
}

// 모달 창 닫는 함수.
function closeModal() {
    document.getElementById('commentModal').style.display = 'none';
}

// 모달 창 등록, 수정 시 localStorage에 데이터 저장
function submitComment() {
    let userName = document.getElementById('userNameModal').value;
    let userComment = document.getElementById('userCommentModal').value;
    let userPassword = document.getElementById('userPasswordModal').value;
    let userRate = document.getElementById('userRateModal').value;
    let openStatus = document.getElementById('modalSubmitBtn').getAttribute('status');
    
    if (userName !== "" && userComment !== "" && userPassword !== "" && makeValidPassword(userPassword)) {
        
        if(openStatus == "create"){
            
            let comment_data = {"nickname": userName, "comment": userComment, "rate": userRate, "password": sha256(userPassword)};
            
            // 한 번도 해당 영화에 코멘트가 적힌 적이 없다면 빈 배열 껍데기 만들고 push.
            if(comment_list === null){
                comment_list = [];       
            }

            comment_list.push(comment_data);
                    
            window.localStorage.setItem(movie_id, JSON.stringify(comment_list));
            
            alert("댓글이 등록되었습니다.");
        }
        else if(openStatus == "edit"){
            let comment_idx = document.getElementById('modalSubmitBtn').getAttribute('data-index');
            let comment_data = {"nickname": userName, "comment": userComment, "rate": userRate, "password": sha256(userPassword)};
              
            // console.log(userName, userComment, userPassword, openStatus, comment_idx);

            comment_list[comment_idx] = comment_data;
            window.localStorage.setItem(movie_id, JSON.stringify(comment_list));

            alert("수정 완료!");
        }
        else{
            alert("inValid Submit");
        }
               
        window.location.reload();
        
    } else {
        alert("입력하신 닉네임과 비밀번호, 리뷰를 다시 한 번 확인해주세요");
    }
}

// 비밀번호 유효성 검사(8자리이상 영문 대/소문자, 숫자, 특수문자 포함)
function makeValidPassword(userPassword) {
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return reg.test(userPassword);
}

