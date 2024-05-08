
let comments = [];

// document.addEventListener("DOMContentLoaded", function () {
//     //loadComments();

//     document.getElementById('commentBtn').addEventListener('click', function () {
//         openModal();
//     });

//     document.getElementById('modalForm').addEventListener('submit', function (event) {
//         event.preventDefault();
//         submitComment();
//     });

//     document.getElementById('modalCancelBtn').addEventListener('click', function () {
//         closeModal();
//     });
// });

//모달창 open할 때 데이터 가져오기
function openModal(action, commentIndex) {
    document.getElementById('commentModal').style.display = 'block';
    if (action === 'edit') {
        let comment = comments[commentIndex];
        document.getElementById('userNameModal').value = comment.name;
        document.getElementById('userPasswordModal').value = comment.password;
        document.getElementById('userCommentModal').value = comment.comment;
        document.getElementById('modalSubmitBtn').setAttribute('data-index', commentIndex);
    } else {
        document.getElementById('modalSubmitBtn').removeAttribute('data-index');
    }
}

//모달창 close시 모달창 텍스트 비우기
function closeModal() {
    document.getElementById('commentModal').style.display = 'none';
    document.getElementById('userNameModal').value = '';
    document.getElementById('userPasswordModal').value = '';
    document.getElementById('userCommentModal').value = '';
}

//모달창 등록, 수정 시 데이터 저장
function submitComment() {
    let userName = document.getElementById('userNameModal').value;
    let userComment = document.getElementById('userCommentModal').value;
    let userPassword = document.getElementById('userPasswordModal').value;
    let index = document.getElementById('modalSubmitBtn').getAttribute('data-index');

    if (userName !== "" && userComment !== "" && makeValidPassword(userPassword)) {
        if (index !== null) {
            comments[index] = { name: userName, password: userPassword, comment: userComment };
        } else {
            comments.push({ name: userName, password: userPassword, comment: userComment });
        }
        //localStorage.setItem('comments', JSON.stringify(comments));
        //displayComments();
        closeModal();
    } else {
        alert("입력하신 닉네임과 비밀번호, 리뷰를 다시 한 번 확인해주세요");
    }
}

//비밀번호 유효성 검사(8자리이상 영문 대/소문자, 숫자, 특수문자 포함)
function makeValidPassword(userPassword) {
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return reg.test(userPassword);
}

//수정버튼 작동 시 비밀번호 확인
function checkForEdit(index) {
    let pw = prompt("비밀번호를 입력해주세요", "비밀번호를 입력하는 곳입니다");

    if (pw === null || !comments[index]) {
        return;
    }

    if (pw === comments[index].password) {
        return openModal('edit', index);
    } else {
        alert('비밀번호를 다시 한 번 확인해주세요');
    }
}

//삭제버튼 작동시 비밀번호 확인
function checkForDel(index) {
    let pw = prompt("비밀번호를 입력해주세요", "비밀번호를 입력하는 곳입니다");

    if (pw === null || !comments[index]) {
        return;
    }

    if (pw === comments[index].password) {
        return commentDel(index);
    } else {
        alert('비밀번호를 다시 한 번 확인해주세요');
    }
}

//삭제 확인 시 로컬스토리지에서 삭제
function commentDel(index) {
    var a = confirm('정말 삭제할까요?');
    if (a) {
        comments.splice(index, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
        displayComments();
    }
}

//로컬스토리지에서 데이터 불러오는 부분
function loadComments() {
    let storedComments = getCommentsFromLocalStorage();
    if (storedComments) {
        comments = storedComments;
        displayComments();
    }
}

function getCommentsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('comments'));
}


function displayComments() {
    let newTable = document.getElementById('commentTable');
    newTable.innerHTML = '';

    if (comments) {
        comments.forEach(function (comment, index) {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${comment.name}</td>
                        <td>${comment.comment}</td>
                        <td><button class="commentEditbtn" onclick="checkForEdit(${index})">수정</button></td>
                        <td><button class="commentDelbtn" onclick="checkForDel(${index})">삭제</button></td>`;
            newTable.appendChild(row);
        });
    }
}
