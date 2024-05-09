console.log("start");
console.log("1");
//영화 API
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwODE2MjU1ZDRlZjRkMjljMTk1MWEwYzllZTc0MzhlMyIsInN1YiI6IjY2MmNhYTJhZjZmZDE4MDEyODIyMzFiNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mL2dduBP0Qzg4Pqy8gMLYnXHu0g8LfmQA0FQoaQngVQ'
    }
};

console.log("2");
//a를 기준으로 소문자와 대문자를 무시하고 텍스트를 대조하는 함수
function text_measure(a, b) {
    let i = 0;
    a = a.toLowerCase();
    b = b.toLowerCase();
    while (a[i]) {
        if (a[i] !== b[i]) return false;
        i++;
    }
    return true;
}

console.log("3");
//40개 분량의 페이지의 제목들을 전부 수집하여 부합하는 조건이 나오면 그 페이지를 불러내는 함수
let pages = [];
let page = 1;

for (let i = 1; i <= 40; i++) {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, options)
        .then(response => response.json())
        .then(response => {

            let results = response["results"];
            let titles = [];
            for (let j in results) {
                titles.push(results[j]['title']);
            }
            pages[i] = titles;
        });
    page++;
}

console.log("4");

async function search_TMDB(text) {
    let end = 0;
    let decision_page;
    let decision_title;

    for (let i = 1; i <= 40; i++) {
        for (let j = 0; j < pages[i].length; j++) {
            if (text_measure(text, pages[i][j])) {
                console.log(pages[i][j]);
                decision_page = i;
                decision_title = j;
                end = 1;
                break;
            }
        }
        if (end) {
            console.log("종료");
            break;
        }
    }
    if (decision_page===undefined) {
        alert("조건에 부합하는 영화가 없습니다!");
        
        return;
    }
    
    function fetchData() {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=${decision_page}`, options)
            .then(response => response.json())
            .then(response => {
                let movie_Info = response['results'][decision_title];

                //로컬 스토리지에 저장 후 새로고침
                //window.localStorage.setItem("movie_title", movie_Info['title']);
                //window.localStorage.setItem("movie_review", movie_Info['overview']);
                //window.localStorage.setItem("movie_image", `https://image.tmdb.org/t/p/w500${movie_Info[`poster_path`]}`);
                //window.localStorage.setItem("moive_rating", movie_Info['vote_average']);

                
                //location.href = `details.html?id=${movie_Info['id']}`;
                console.log(movie_Info['id']);
                
                //location.reload();
            })
    }
    fetchData();

    
    document.getElementById("floatingInputValue").addEventListener("keypress", function (event) {
        if (event.key == "Enter") {
            let textvalue = document.getElementById("floatingInputValue").value;
            document.getElementById("floatingInputValue").value = null;
            event.preventDefault();
        }
    })
}