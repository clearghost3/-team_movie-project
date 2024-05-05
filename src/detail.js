const $detailContainer = document.querySelector('#detailed_introduction');
const $reviewBox = document.querySelector('#reviewbox');
const $encryptScript = document.createElement('script');
const movie_id = new URLSearchParams(location.search).get("id");

let movie;
let movieConfig;

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
                    loadReviews();          // 해당 영화의 리뷰를 가져온다.
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
function loadReviews(){

    if(localStorage.getItem(movie_id) === null) return;
    
    let reviewList = JSON.parse(localStorage.getItem(movie_id));
    for(let i = 0; i < reviewList.length; i++){
        //console.log(`${reviewList[i].password}, ${reviewList[i].comment}`);
        appendReview(reviewList[i], i);
    }
}

// 1개의 리뷰를 리뷰칸에 추가한다.
function appendReview(review_info, review_id) {
    const $reviewCotainer = document.createElement('div');
    $reviewCotainer.setAttribute("class", "review");
    $reviewCotainer.setAttribute("value", review_info.password);
    $reviewCotainer.setAttribute("id", review_id);
    //console.log(review_info);
    let temp_html = `
        <div class="user_info">
            <div>${review_info.nickname}</div>
            <div>score: ${review_info.rate}</div>
        </div>
        <img src="assets/edit-button.png" class="edit-btn" style="width: 50px; height: 50px;"></img>
        <img src="assets/delete-button.png" class="delete-btn" style="width: 50px; height: 50px;"></img>
        <div class="review_comments">
        <input type="textarea" value="${review_info.comment}" disabled>  
        </div>
        <br>
    `;

    $reviewCotainer.innerHTML = temp_html;

    addButtonEvent($reviewCotainer);
     
    $reviewBox.append($reviewCotainer);
}

function isCorrectPassword(password_correct){
    const password_try = prompt('비밀번호를 입력하세요:');

    if (password_try && sha256(password_try) === password_correct) {
        return true;
    }
    
    alert("비밀번호가 일치하지 않습니다.");

    return false;
}

function addButtonEvent($commentCotainer){
    const $editButton = $commentCotainer.querySelector('.edit-btn');
    const $deleteButton = $commentCotainer.querySelector('.delete-btn');
    const $commentInput = $commentCotainer.querySelector('input');

    $editButton.addEventListener("click", function(e){
        let isDisabled = $commentInput.disabled;
        if(confirm("s")){
            alert("true");
        }
        else{
            alert("false");
        }
        alert("edit button clicked!");
        //console.log($commentInput.getAttribute('value'));
        // 수정 요청 시 if문, 수정 완료 시 else문 진입.
        if(isDisabled){

            if(isCorrectPassword($commentCotainer.getAttribute('value'))){
                $commentInput.disabled = false;
            }
            
        }
        else{
            $commentInput.disabled = true;

            let arr = JSON.parse(window.localStorage.getItem(movie_id));
            let idx = $editButton.parentElement.getAttribute('id');

            let text_um = $commentInput.value;
            console.log(text_um);
            arr[idx].comment = text_um;
            window.localStorage.setItem(movie_id, JSON.stringify(arr));

            alert("edit completed!");
        }
        
    })
    
    $deleteButton.addEventListener("click", function(e){
        //e.preventDefault();
        
        if(!isCorrectPassword($deleteButton.parentElement.getAttribute("value"))) return;

        let sdssdsdsdd = confirm("정말로 삭제하시겠습니까?");
        console.log(typeof sdssdsdsdd);
        if(sdssdsdsdd){
            alert("if condition: true");
        }
        else{
            alert("if condition: false");
        }
        if("true" === confirm("정말로 삭제하시겠습니까?")){          
            // $deleteButton.parentElement.remove();
            
            let arr = JSON.parse(window.localStorage.getItem(movie_id));
            let idx = $deleteButton.parentElement.getAttribute('id');
            console.log(idx);
            arr.splice(idx, 1);
            window.localStorage.setItem(movie_id, JSON.stringify(arr));

            alert("This comment has been deleted!!");
            //console.log("test");
            window.location.reload();
        }   
        
        // let message = "2323";
        // let hash = sha256(message);
        // console.log(hash);
    })
}