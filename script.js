// stopwatch instance
let watch;

// occurs in MANUAL mode
$("#start").click(function () {
  // It creates the data "Difficulty Level" menu in top right corner
  $("header.nav").append(
    `
            <div class="nav__burger">
                <h2 class="nav__difficulty">Difficulty</h2>
                <div class="nav__select_wrap">
                    <ul class="default_option">
                        <li>
                            <div class="option easy">
                                <p>Easy</p>
                            </div>
                        </li>
                    </ul>
                    <ul class="select_ul">
                        <li>
                            <div class="option easy-1">
                                <p>Easy</p>
                            </div>
                        </li>
                        <li>
                            <div class="option medium">
                                <p>Medium</p>
                            </div>
                        </li>
                        <li>
                            <div class="option hard">
                                <p>Hard</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        `
  );

  // This is required functionality for the dropdown menu to open i.e. slide down
  $(".default_option").click(function () {
    $(this).parent().toggleClass("active");
  });

  // This runs when any item from dropdown is selected
  $(".select_ul li").click(function () {
    // designs the dropdown menu
    let currentEle = $(this).html();
    $(".default_option li").html(currentEle);
    $(this).parents(".nav__select_wrap").removeClass("active");

    // code to change the level dynamically
    let level = $(this).children().text().trim();

    if (level === "Easy") {
      levelEasy();
    } else if (level === "Medium") {
      levelMedium();
    } else if (level === "Hard") {
      levelHard();
    }
  });

  // This creates the square blocks for Easy Level
  levelEasy();
});

// Emoji or Puzzle elements box
let code = ["X", "????", "Miss"];

// called when all stages are completed
function hugeSuccess() {
  // console.log("You're out of this world!");
  $(".content").html("");

  if ($(".nav__time").length !== 0) {
    watch.stop();
  }

  $(".game")
    .attr("class", "success content game")
    .append(
      `
            <div class= "hero">
                <h1>Congratulations !! You Won <span>????</span></h1>
            </div>
            <div class="play">
                <button>Home</button>
            </div>
        `
    );

  $(".success button").click(function () {
    let a = $(".select_ul li").clone()[0];
    $(".default_option li").html(a);

    // bring back website to original state
    location.reload(true);
  });
}

function genNewLevel() {
  // number of items in the content div or number of boxes
  let len = $(".item").length;

  // number of puzzles to be done (each pair means 2 items)
  let pairs = len / 2;

  // returns array of length `len` and having values
  // from 0 to `len` in RANDOM order
  function genRandArrayOfLen(len) {
    let arr = [];

    while (arr.length < len) {
      let r = Math.floor(Math.random() * len);
      if (arr.indexOf(r) === -1) {
        arr.push(r);
      }
    }

    return arr;
  }

  // randLenArr is an array of random numbers of length `len`
  // pairs is the number of puzzles we need to make (len / 2)
  // emojiLen is the length of the array of emojis`
  // it loops through the number of items, `pair` number of times
  // each time replaces two random items textContent with random emojis
  function encodeItems(randLenArray, pairs, emojiLen) {
    let itemsObj = $(".item p");

    // we used pop because once a item from the randArr is gone
    // we can't use it again, so results in no repetition
    // while selecting items inside `content` div

    for (let i = 0; i < pairs; i++) {
      let randItemOne = itemsObj[randLenArray.pop()];
      let randItemTwo = itemsObj[randLenArray.pop()];
      let randNumForEmoji = Math.floor(Math.random() * emojiLen);

      randItemOne.textContent = code[randNumForEmoji];
      randItemTwo.textContent = code[randNumForEmoji];
    }

    return undefined;
  }

  // stores array of random numbers ranging from 0 to `len`
  let randLenArray = genRandArrayOfLen(len);

  // length of emoji array
  let lenEmoji = code.length;

  encodeItems(randLenArray, pairs, lenEmoji);

  // this gets the clicked emoji and compares it to the previously clicked one
  // if matched returns true, else false
  // its length is never more than 2
  let matchArr = [];

  function isMatch(val) {
    if (matchArr.length < 1) {
      matchArr.push(val);
      return "First";
    } else if (matchArr.length === 1) {
      if (matchArr.indexOf(val) === -1) {
        matchArr = [];
        return false;
      } else {
        matchArr = [];
        return true;
      }
    }
  }

  // this stores the current element whose `hidden` class is removed
  let curBoxEle = [];

  // this stores the data-key value of the clicked element
  let curKeyVal = [];

  $(".item").click(function () {
    const x = $(this).children().removeClass("hidden");
    curBoxEle.push(x);

    const ele = $(this)[0];
    const key = ele.dataset.key;
    const emoji = ele.textContent;
    let match;

    // this makes sure if same block is clicked continously
    // it'll show and hide the emoji respectively
    if (curKeyVal.length < 1) {
      curKeyVal.push(key);
      match = isMatch(emoji);
    } else if (curKeyVal.length === 1) {
      if (curKeyVal.indexOf(key) === -1) {
        curKeyVal = [];
        curKeyVal.push(key);
        match = isMatch(emoji);
      } else {
        $(this).children().addClass("hidden");
        curKeyVal = [];
        matchArr = [];
        match = "First";
      }
    }

    if (match === "First") {
      // console.log("Waiting...");
    } else if (match === false) {
      setTimeout(function () {
        curBoxEle.forEach((item) => {
          item.addClass("hidden");
        });
        curBoxEle = [];
        // console.log("Try again, harder!");
      }, 200);
    } else if (match === true) {
      curBoxEle.forEach((item) => {
        item.parent(".item").off("click");
      });
      curBoxEle = [];
      // console.log("Its a match!");
      showNextLevel();
    }
  });

  function showNextLevel() {
    let hiddenArr = $(".hidden");

    if (hiddenArr.length === 0) {
      // console.log("Won the stage!");
      setTimeout(function () {
        // let stage = $(".default_option p").text();
        // number of items in the content div or number of boxes
        let stage = $(".item").length;

        if (stage === 4) {
          let a = $(".select_ul li").clone()[1];
          $(".default_option li").html(a);
          levelMedium();
        } else if (stage === 8) {
          let b = $(".select_ul li").clone()[2];
          $(".default_option li").html(b);
          levelHard();
        } else {
          hugeSuccess();
        }
      }, 1000);
    }

    // console.log("Keep hustling!");
  }
}

function levelEasy() {
  $(".game").html("");
  $(".game").attr("class", "game content content-sm");

  for (let i = 1; i <= 4; i++) {
    $(".game").append(
      `
        <div data-key=${i} class="item">
        <p class="hidden"></p>
        </div>
        `
    );
  }
  genNewLevel();
}

function levelMedium() {
  $(".game").html("");
  $(".game").attr("class", "game content content-md");

  for (let i = 1; i <= 9; i++) {
    $(".game").append(
      `
                    <div data-key=${i} class="item">
                        <p class="hidden"></p>
                    </div>
                `
    );
  }

  genNewLevel();
}

function levelHard() {
  $(".game").html("");
  $(".game").attr("class", "game content content-lg");

  for (let i = 1; i <= 16; i++) {
    $(".game").append(
      `
                    <div data-key=${i} class="item font-sm">
                        <p class="hidden"></p>
                    </div>
                `
    );
  }

  genNewLevel();
}