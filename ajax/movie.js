const txtYear = document.querySelector("#txtYear");
const selMon = document.querySelector("#selMon");
const selDay = document.querySelector("#selDay");

// 어제날짜 구하기
const init = () => {
  // 오늘날짜 구하기
  const today = new Date();
  console.log(today); // Wed Mar 13 2024 12:41:59 GMT+0900 (한국 표준시)

  // 년, 월, 일 변수에 담기
  let year = today.getFullYear();
  let month = today.getMonth() + 1; // 월 0부터 시작
  // 일-1 어제 날짜
  let day = today.getDate() - 1;

  // 화면에 보여주기
  // 요소 찾은 후 value 변경
  txtYear.value = year;
  //   selMon.value = month;
  //   1~9월 : "0"+month => 01,02..
  //   1~9일 : "0"+day => 01,02..

  //   if (month < 10) {
  //     month = "0" + month;
  //   }
  //   if (day < 10) {
  //     day = "0" + day;
  //   }

  //   selMon.value = month;
  //   selDay.value = day;

  selMon.value = month < 10 ? "0" + month : month;
  selDay.value = day < 10 ? "0" + day : day;
};

init();

function show(movieCd) {
  console.log(movieCd);

  url = "https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=f5eef3421c602c6cb7ea224104795888&movieCd=";
  url += movieCd;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error();
    })
    .then((data) => {
      let result = "";

      let movieInfo = data.movieInfoResult.movieInfo;
      // 영화한글제목 : movieNm
      let movieNm = movieInfo.movieNm;
      // 영화영어제목 : movieNmEn
      let movieNmEn = movieInfo.movieNmEn;
      // 상영시간 : showTm
      let showTm = movieInfo.showTm;

      let directors = "";
      // 감독 : directors
      movieInfo.directors.foreach((director) => {
        directors += `${director.peopleNm}, `;
      });
      // 배우 : actors
      let actors = "";
      movieInfo.directors.foreach((actor) => {
        directors += `${actor.peopleNm}, `;
      });

      result += `<ul>`;
      result += `<li> 영화제목 : ${movieNm}</li>`;
      result += `<li> 영어제목 : ${movieNmEn}</li>`;
      result += `<li> 상영시간 : ${showTm} 분</li>`;
      result += `<li> 감독 : ${directors}</li>`;
      result += `<li> 출연배우 : ${actors}</li>`;
      result += `</ul>`;

      document.querySelector(".box2").innerHTML = result;
    })
    .catc(() => console.log("error"));
}

document.querySelector("button").addEventListener("click", () => {
  // 영화진흥위원회 사용자가 선택한 날짜의 박스 오피스 가져오기

  let url = "https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=f5eef3421c602c6cb7ea224104795888&targetDt=";
  url += txtYear.value + selMon.value + selDay.value;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error();

      return response.json();
    })
    .then((data) => {
      console.log(data);

      let boxofficeList = data.boxOfficeResult.dailyBoxOfficeList;
      console.log(boxofficeList);

      let result = "";
      boxofficeList.forEach((movie) => {
        // 순위 1
        // 1위 (증감) : 파묘
        console.log(movie.rank);
        console.log(movie.rankUbten);
        console.log(movie.movieNm);
        console.log(movie.movieCd);

        // 증감
        let rankInten = movie.rankInten;

        result += `${movie.rank} 위( `;

        if (rankInten > 0) {
          result += "▲";
        } else if (rankInten < 0) {
          result += "▼";
        }

        result += `${movie.rankInten} ) : `;
        result += `<a href="#" onclick='javascript:show(${movie.movieCd})'>${movie.movieNm}</a><br>`;
      });

      document.querySelector("#msg").innerHTML = result;
    })
    .catch(() => console.log("주소 확인"));
});
