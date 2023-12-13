let musicarr = [];
fetch("http://127.0.0.1/pltest/wp-json/musicapi/items")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((currentItem) => {
      let dataobjx = {
        name: currentItem.music_name,
        artist: currentItem.artist_name,
        url: currentItem.music_url,
        thumb: currentItem.thumb_url,
      };
      musicarr = [...musicarr, dataobjx];
    });
    if (data.length === 0) return;
    setTimeout(() => {
      document.querySelector(".loading").style.display = "none";
    }, 1000);
    loop();
    musiccontroler();
    display(0);
    playlist();
    autoplay();
    document.querySelector(".musictitle h1").click();
  })
  .catch((error) => {
    console.log(error);
  });
// main select //
let musimain = document.querySelector(".musicplayer");
let playlistdiv = document.querySelector(".playlists");
// loop function //
const loop = () => {
  const loopbutton = document.querySelector(".arrow");
  loopbutton.addEventListener("click", (e) => {
    if (!document.querySelector("#myviod").loop) {
      document.querySelector("#myviod").loop = true;
      loopbutton.style.background = "red";
    } else {
      document.querySelector("#myviod").loop = false;
      loopbutton.style.background = "#121212";
    }
  });
};

// music controler //
const musiccontroler = () => {
  // selector //
  const music = document.querySelector("#myviod");
  const play = document.querySelector("[data-ctrl-play]");
  const stop = document.querySelector("[data-ctrl-stop]");
  const back = document.querySelector("[data-ctrl-back]");
  const forward = document.querySelector("[data-ctrl-forward]");
  const slider = document.querySelector("#musicslider");
  let played = false;
  // on end //
  music.addEventListener("ended", (event) => {
    if (!document.querySelector("#myviod").loop) {
      stop.click();
    } else {
      return;
    }
  });
  // starting //
  music.addEventListener("play", () => {
    setTimeout(() => {
      document.querySelector(".musicbackground").classList.remove("stop");
      document.querySelector(".musicbackground").classList.add("play");
      document.querySelector(".musicbackground").classList.add("rotanime");
      play.click();
    }, 100);
  });
  music.addEventListener("pause", () => {
    document.querySelector(".musicbackground").classList.add("stop");
    document.querySelector(".musicbackground").classList.remove("play");
    stop.click();
  });
  // time out and int //
  setInterval(() => {
    slider.value = music.currentTime;
  }, 500);
  // play //
  play.addEventListener("click", () => {
    music.play();
    stop.style.display = "flex";
    play.style.display = "none";
  });
  // stop //
  stop.addEventListener("click", () => {
    music.pause();
    play.style.display = "flex";
    stop.style.display = "none";
  });
  // forward //
  forward.addEventListener("click", (e) => {
    slider.value = 0;
    !music.paused ? (played = true) : (played = false);
    musimain.dataset.id = parseInt(musimain.dataset.id) + 1;
    if (parseFloat(musimain.dataset.id) > musicarr.length - 1) {
      musimain.dataset.id = 0;
    }

    const next = [...playlistdiv.querySelectorAll(".items .music")].filter(
      (item) => {
        return item.dataset.id === musimain.dataset.id;
      }
    );
    next[0].querySelector(".musictitle h1").click();
    if (played) {
      play.click();
    }
  });
  // backword //
  back.addEventListener("click", (e) => {
    slider.value = 0;
    !music.paused ? (played = true) : (played = false);
    musimain.dataset.id = parseInt(musimain.dataset.id) - 1;
    if (parseFloat(musimain.dataset.id) < 0) {
      musimain.dataset.id = musicarr.length - 1;
    }
    const next = [...playlistdiv.querySelectorAll(".items .music")].filter(
      (item) => {
        return item.dataset.id === musimain.dataset.id;
      }
    );
    next[0].querySelector(".musictitle h1").click();
    if (played) {
      play.click();
    }
  });
  // slide //
  slider.addEventListener("input", (e) => {
    music.currentTime = slider.value;
    if (played) {
      play.click();
    }
  });
  slider.value = 11;
};

// display music //
const display = (index) => {
  const thumb = document.querySelector(".musicbackground img");
  const name = document.querySelector(".musicname > h1");
  const artist = document.querySelector(".musicname > h2");
  const url = document.querySelector("#myviod");
  document.querySelector("[data-ctrl-stop]").click();
  thumb.src = musicarr[index].thumb;
  name.textContent = musicarr[index].name;
  artist.textContent = musicarr[index].artist;
  url.src = musicarr[index].url;
  const afterload = () => {
    document.querySelector(".musicbackground").classList.remove("rotanime");
    document.querySelector("#musicslider").value = 0;
    document.querySelector("#musicslider").max =
      document.querySelector("#myviod").duration;

    url.removeEventListener("loadeddata", afterload);
  };
  url.addEventListener("loadeddata", afterload);
};

// playlist //
const playlist = () => {
  let playlistitem;
  let timer;
  const menu = document.querySelector(".menu");
  const menuclose = document.querySelector(".menuclose");
  // play list open / close //
  menu.addEventListener("click", (e) => {
    clearTimeout(timer);
    e.currentTarget.style.display = "none";
    menuclose.style.display = "flex";
    musimain.classList.add("slide-left");
    playlistdiv.classList.add("slide-right");
    playlistdiv.classList.remove("ssright");
    musimain.classList.remove("ssleft");
    playlistdiv.style.display = "flex";
  });
  menuclose.addEventListener("click", (e) => {
    e.currentTarget.style.display = "none";
    menu.style.display = "flex";
    playlistdiv.classList.add("ssright");
    musimain.classList.add("ssleft");
    if (window.matchMedia("(width < 800px)").matches) {
      playlistdiv.style.display = "none";
    } else {
      setTimeout(() => {
        playlistdiv.style.display = "none";
      }, 500);
    }
  });
  const playlsitdisplay = () => {
    musicarr.forEach((track, key) => {
      let singeltrack = document
        .querySelector("[data-playlist-template]")
        .content.cloneNode(true).children[0];
      singeltrack.dataset.id = key;
      singeltrack.querySelector(".musicimg img").src = track.thumb;

      singeltrack.querySelector(".musictitle h1").textContent = track.name;
      // show the card //
      document.querySelector(".items").appendChild(singeltrack);
      // select //
      playlistitem = playlistdiv.querySelectorAll(".items .music");
    });
  };
  playlsitdisplay();
  // playlist click //
  const playlistplay = () => {
    [...playlistitem].forEach((value) => {
      value.querySelector(".musictitle h1").addEventListener("click", (e) => {
        value.querySelector(".musictitle h1").scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
        let current = document.querySelector("#myviod").paused;
        [...playlistitem].forEach((icon) => {
          icon.querySelector("i").style.color = "unset";
          icon.querySelector(".musictitle h1").style.color = "unset";
        });
        value.querySelector("i").style.color = "orange";
        value.querySelector(".musictitle h1").style.color = "aqua";
        document.querySelector(".musicplayer").dataset.id = value.dataset.id;
        display(value.dataset.id);
        if (current) return;
        document.querySelector("[data-ctrl-play]").click();
      });
    });
  };
  playlistplay();
};
// auto playlist //
const autoplay = () => {
  const ended = (e) => {
    const autoplayloop = [
      ...playlistdiv.querySelectorAll(".items .music"),
    ].filter((item) => {
      return (
        item.dataset.id - document.querySelector(".musicplayer").dataset.id == 1
      );
    });
    if (autoplayloop.length === 0) {
      document.querySelector(".musictitle h1").click();
      document.querySelector("[data-ctrl-play]").click();
      return;
    }
    autoplayloop[0].querySelector(".musictitle h1").click("");
    document.querySelector("[data-ctrl-play]").click();
  };
  document.querySelector("#myviod").addEventListener("ended", ended);
};
