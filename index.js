//Search URL = https://api.twitter.com/1.1/trends/place.json?id=23424977

let twitterTrends = [];
let topNews = [];
let numOfCompleted = 0;

function getTrends() {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer AAAAAAAAAAAAAAAAAAAAABrCGgEAAAAAC1coVaNyGWQ0CGXKTsTV8e7f5eE%3DolLdFBbPmHPgkeJv97J8dXBKh6ZWTqVHKWci1jTRfGkM8AgR98"
  );
  myHeaders.append(
    "Cookie",
    'personalization_id="v1_QSZs3kHuqI6knlNtIbIchQ=="; guest_id=v1%3A159630901122767291'
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url =
    "https://cors-anywhere-gp.herokuapp.com/https://api.twitter.com/1.1/trends/place.json?id=23424977";

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((responseJson) => topFive(responseJson))
    .catch((error) => console.log("error", error));
}

function topFive(responseJson) {
  $("#results").html("<h2>Loading Twitter Trends...</h2>");
  for (let i = 0; i < 5; i++) {
    $("#results").append(`<p>${responseJson[0].trends[i].name}</p>`);
    twitterTrends.push(responseJson[0].trends[i].name);
    setTimeout(
      () => getNews(responseJson[0].trends[i].name.replace("#", ""), i),
      1000
    );
  }
  showTrends();
}

function getNews(topic, index) {
  var myHeaders = new Headers();
  myHeaders.append(
    "Ocp-Apim-Subscription-Key",
    "fae2d3935f5847c08503ac19fe08aa52"
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  fetch(
    `https://api.cognitive.microsoft.com/bing/v7.0/news/search?q=${topic}&count=5`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      topNews[index] = result.value;
      checkNewsDone();
    })
    .catch((error) => console.log("error", error));
}

function checkNewsDone() {
  numOfCompleted++;
  $("#results").append(`<p>Loading ${numOfCompleted} of 5</p>`);
  if (numOfCompleted === 5) {
    renderData();
  }
}

function renderData() {
  let html = "";
  for (let i = 0; i < twitterTrends.length; i++) {
    html += "<section class='news'>";
    html += `<h2>${twitterTrends[i]}</h2>`;
    html += "<ul class='articles'>";
    for (let j = 0; j < topNews[i].length; j++) {
      html += `<li>
        ${
          topNews[i][j].image && topNews[i][j].image.thumbnail
            ? `<div class="thumbnail" style="background-image:url('${topNews[i][j].image.thumbnail.contentUrl}')"></div>`
            : ""
        }
        <h3><a href="${topNews[i][j].url}" target="_blank">${
        topNews[i][j].name
      }</a></h3>
        <p>${topNews[i][j].description}</p>
      </li>`;
    }
    html += "</ul></section>";
  }
  html +=
    "<button type='button' class='js-restart button'>Refresh Results</button>";
  $("#results").html(html);
}

function showTrends() {
  let html = "";
  html += "<section class='twitter'>";
  html += "<ul class='trends'>";
  for (let i = 0; i < 5; i++) {
    html += `<li>${twitterTrends[i]}</li>`;
  }
  html += "</ul></section>";
  $(".topFiveTrends").html(html);
}

function getAgain() {
  $("#results").on("click", ".js-restart", function () {
    $("#results").html("");
    twitterTrends = [];
    topNews = [];
    numOfCompleted = 0;
    getTrends();
  });
}

function watchStart() {
  getTrends();
  $(".js-startButton").on("click", function (event) {
    $(".startPage").addClass("hidden");
    $(".topFiveTrends").addClass("hidden");
    $(".startButton").addClass("hidden");
    $("#results").removeClass("hidden");
  });
}

$(watchStart);
$(getAgain);

//<div class="thumbnail" style="background-image:url('${topNews[i][j].image.thumbnail.contentUrl}')"></div>
//topNews[index] = result.value.slice(0, 5);
//<div class="thumbnail" style="background-image:url('${topNews[i][j].image.thumbnail.contentUrl}')"></div>
// make an api call w/ that topic
// push those news into the array of news
/*fetch(
    `https://newsapi.org/v2/everything?q=${topic}&apiKey=4963ba8ddaed4ec193d5b70fe3939b82&pageSize=5`
  )*/
/*fetch(
    `https://google-news.p.rapidapi.com/v1/search?country=US&to=5&lang=en&q=${topic}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "google-news.p.rapidapi.com",
        "x-rapidapi-key": "af2f355581msh9a32bc4ec2970e5p15799djsn5c391589925d",
      },
    }
  )*/
/*fetch(
    `https://gnews.io/api/v3/search?q=${topic}&max=2&token=c4f50db60162137467804706598b52f1`
  )*/
