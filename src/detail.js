const $detailContainer = document.querySelector('#detailed_introduction');
const $reviewBox = document.querySelector('#reviewbox');

let movie;
let movieConfig;

let movie_id;

// 임시로 본인 API키 사용 중....
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTczM2JlZWJiMmJhNmZlOWRiY2QxYWZiYWMzNGY4NyIsInN1YiI6IjY2MmExNzQwMzNhNTMzMDA5YmQxZDI5ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iy6fJyWI7Os_VFgPwtAcFHOby3PIXzVRbiV3cOSk3cc'
    }
};

init();

function init() {

    const URLSearch = new URLSearchParams(location.search);
    //movie_id = URLSearch.get("id");
    movie_id = 278;
    fetch('https://api.themoviedb.org/3/configuration', options)
        .then(response => response.json())
        .then(response => {
            movieConfig = response.images;
            
            // 영화 정보 가져옴
            fetch(`https://api.themoviedb.org/3/movie/${movie_id}?language=ko-KR`, options)
                .then(response => response.json())
                .then(response => {
                    movie = response;
                    console.log(movie);
                    fetchMovieDetails();
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err));

    // 영화 id를 통해 review를 localstorage에서 가져온다.
    if(localStorage.getItem(movie_id) != ''){
        let reviewList = JSON.parse(localStorage.getItem(movie_id));
        
        //console.log(reviewList);

        // 가져온 커맨드를 커맨드 창에 추가한다.
        loadReviews(reviewList);
    }

}

// 영화 상세페이지 정보 입력.
function fetchMovieDetails() {
    
    let _fullUrl = movieConfig.base_url + movieConfig.poster_sizes[4] + movie.poster_path;

    $detailContainer.querySelector('img').src = _fullUrl;
    $detailContainer.querySelector('#movie_title').textContent = movie.original_title;
    $detailContainer.querySelector('#movie_contents').textContent = movie.overview; 
}

// 적힌 리뷰들 불러오는 함수.
function loadReviews(reviewList){
    // 아무것도 들어있지 않으면 리턴.
    if(reviewList === null) return;

    for(let i = 0; i < reviewList.length; i++){
        //console.log(`${reviewList[i].password}, ${reviewList[i].comment}`);
        appendReview(reviewList[i]);
    }
}

// 1개의 리뷰를 리뷰칸에 추가한다.
function appendReview(review_info) {
    const $reviewCotainer = document.createElement('div');
    $reviewCotainer.setAttribute("class", "review");

    let temp_html = `
        <div class="user_info" value="${review_info.pw}">
            <div>user_name: Dal</div>
            <div>score: ⭐⭐⭐⭐⭐</div>
        </div>
        <div class="review_comments">
            ${review_info.comment}
        </div>
        <br>
    `;

    $reviewCotainer.innerHTML = temp_html;

    //addButtonEvent($reviewCotainer);
     
    $reviewBox.append($reviewCotainer);
}